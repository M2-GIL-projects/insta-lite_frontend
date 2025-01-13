import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../models/Post';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  showMediaModal = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  createdPostId: number | null = null;
  createdPostImageId: number | null = null;
  isPrivate : boolean = false;
  @ViewChild('mediaModal') mediaModal: any;
  isEditMode: boolean = false; 
  postId : number | null = null;
  remainingChars: number = 255;
  oldImageUrl: string | null = null;
  oldVideoUrl: string | null = null;
  oldImageId: number | null = null;
  oldVideoId: number | null = null;

  currentUser: User | null = null;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private fb: FormBuilder, 
    private postService: PostService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private authService : AuthService,
    private userService : UserService
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(255)]],
      private: [false]
    });
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('postId');
      if (id) {
        this.postId = +id; 
        this.isEditMode = true;
        this.loadPostData(this.postId);
      }
    });

    this.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.loadUser();
      } else {
        this.currentUser = null;
      }
    });

    this.postForm.get('content')?.valueChanges.subscribe(() => {
      this.updateCharCount();
    });
  }

  loadUser() {
    this.userService.getMe().subscribe(
      user => {
        this.currentUser = user;
      },
      error => {
        console.log('Erreur lors du chargement de l\'utilisateur', error);
      }
    );
  }

  loadPostData(postId: number) {
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        this.postForm.patchValue({
          content: post.content,
          private: post.private
        });
        this.oldImageUrl = post.pictures && post.pictures.length > 0 ? this.getImageUrl(post.pictures[0].url) : null;
        this.oldVideoUrl = post.videos && post.videos.length > 0 ? this.getImageUrl(post.videos[0].url) : null;
        this.oldImageId = post.pictures && post.pictures.length > 0 ? post.pictures[0].id : null;
        this.oldVideoId = post.videos && post.videos.length > 0 ? post.videos[0].id : null;
      },
      (error) => {
        console.log('Erreur lors de la récupération des données', error);
      }
    );
  }
  
  getImageUrl(relativeUrl: string | undefined): string {
    if(relativeUrl == undefined){
      return 'assets/defaut.jpg';
    }
    return `http://localhost:8080/${relativeUrl}`;
  }
  

  updateCharCount() {
    const contentLength = this.postForm.get('content')?.value.length || 0;
    this.remainingChars = Math.max(0, 255 - contentLength);
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      
      if (this.isEditMode && this.postId) {
        this.postService.updatePost(this.postId, postData).subscribe(
          response => {
            this.alertService.showSuccess("Mise à jour", "Le post a été mis à jours!");
            this.createdPostId = this.postId; 
            this.openMediaModal(this.mediaModal);
          },
          error => {
            console.error('Erreur lors de la mise à jour du post', error);
          }
        );
      } else {
        this.postService.createPost(postData).subscribe(
          response => {
            this.alertService.showSuccess("Créer", "Le post a été crée !");
            this.createdPostId = response.id;
            this.openMediaModal(this.mediaModal);
          },
          error => {
            console.error('Erreur lors de la création du post', error);
          }
        );
      }
    }
  }
  
  

  openMediaModal(content: any): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
    this.previewUrls = [];

    this.selectedFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        this.previewUrls.push('assets/defaut-video.png');                                                                                                                                                          
      }
    });
  }

  cancelAction(){
    this.router.navigate(['/profile']);
  }

  annuler() {
    this.modalService.dismissAll();
    this.showMediaModal = false;
    this.router.navigate(['/profile']);
  }

  addMediaToPost(): void {
    if (this.createdPostId !== null && this.selectedFiles.length > 0) {
      const isPrivate = this.postForm.get('private')?.value;
      
      this.selectedFiles.forEach(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('private', isPrivate ? 'true' : 'false');
  
        if (file.type.startsWith('image/')) {
          if(!this.isEditMode){
            this.postService.addPictureToPost(this.createdPostId as number, isPrivate, formData).subscribe(
            response => {
              this.alertService.showSuccess("Ajout Image", "Image ajoutée avec succès!");
              this.modalService.dismissAll();
              this.router.navigate(['/profile']);
            },
            error => {
              console.error('Erreur lors de l\'ajout de l\'image', error);
            }
          ); 
          //si on est en mode edition est que le post avait été crée sans image
          }else if(this.isEditMode && !this.oldImageId){
            this.postService.addPictureToPost(this.createdPostId as number, isPrivate, formData).subscribe(
              response => {
                this.alertService.showSuccess("Ajout Image", "Image ajoutée avec succès!");
                this.modalService.dismissAll();
                this.router.navigate(['/profile']);
              },
              error => {
                console.error('Erreur lors de l\'ajout de l\'image', error);
              }
            ); 
          }else{
            this.postService.updatePictureToPost(this.createdPostId as number, formData).subscribe(
              (response) => {
                this.alertService.showSuccess("Mise à jour image", "Image mise à jour !");
                this.modalService.dismissAll();
                this.router.navigate(['/profile']);
              },
              error => {
                console.error('Erreur lors de la mise à jour de l\'image', error);
              }
            ); 
          }
          
          
        } else if (file.type.startsWith('video/')) {
          if(!this.isEditMode){
            this.postService.addVideoToPost(this.createdPostId as number,isPrivate, formData).subscribe(
              response => {
                this.alertService.showSuccess("Ajout vidéo", "La vidéo a été ajoutée!");
                this.modalService.dismissAll();
                this.router.navigate(['/profile']);
              },
              error => {
                console.error('Erreur lors de l\'ajout de la vidéo', error);
              }
            );
            //si on est en mode edition est que le post avait été crée sans vidéo
          }else if(this.isEditMode && !this.oldVideoId){
            this.postService.addVideoToPost(this.createdPostId as number,isPrivate, formData).subscribe(
              response => {
                this.alertService.showSuccess("Ajout vidéo", "La vidéo a été ajoutée!");
                this.modalService.dismissAll();
                this.router.navigate(['/profile']);
              },
              error => {
                console.error('Erreur lors de l\'ajout de la vidéo', error);
              }
            );
          }else{
            this.postService.updateVideoToPost(this.createdPostId as number,isPrivate, formData).subscribe(
            response => {
              this.alertService.showSuccess("Mise à jour vidéo", "La vidéo a été mis à jour!");
            },
            error => {
              console.error('Erreur lors de la mise à jour de la vidéo', error);
            }
          );
          }
          
        }
      });
  
      this.modalService.dismissAll();
      this.router.navigate(['/profile']);
    }
  }
  
  

  resetForm(): void {
    this.postForm.reset();
    this.selectedFiles = [];
    this.previewUrls = [];
    this.createdPostId = null;
    this.showMediaModal = false;
    this.isEditMode = false; 
    this.postId = null; 
  }
}
