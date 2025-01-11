import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Post } from '../../models/Post';
import { ActivatedRoute, Router } from '@angular/router';

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
  isPrivate : boolean = false;
  @ViewChild('mediaModal') mediaModal: any;
  isEditMode: boolean = false; 
  postId : number | null = null;


  constructor(
    private fb: FormBuilder, 
    private postService: PostService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(255)]],
      isPrivate: [false]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('postId');
      if (id) {
        this.postId = +id; // Convertir en nombre
        this.isEditMode = true;
        this.loadPostData(this.postId);
      }
    });
  }

  loadPostData(postId: number) {
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        this.postForm.patchValue({
          content: post.content,
          isPrivate: post.isPrivate // Charger la valeur existante pour isPrivate
        });
      },
      (error) => {
       console.log('Erreur lors de la récupération des données', error);
      }
    );
  }

  onPrivacyChange(): void {
    // Afficher la valeur actuelle de isPrivate dans la console pour vérification
    console.log('isPrivate:', this.postForm.get('isPrivate')?.value);
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
        console.log('niveau 1',postData);

        if (this.isEditMode && this.postId) {
          this.postService.updatePost(this.postId, postData).subscribe(
            response => {
              console.log('niveau 2',response);
              console.log('Post mis à jour avec succès', response);
              this.openMediaModal(this.mediaModal);
            },
            error => {
              console.error('Erreur lors de la mise à jour du post', error);
            }
          );
        } else {
          this.postService.createPost(postData).subscribe(
            response => {
              console.log('niveau 2',response);
              console.log('Post créé avec succès', response);
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
        // Pour les vidéos, on peut afficher une vignette par défaut ou la première frame
        this.previewUrls.push('assets/video-thumbnail.png');
      }
    });
  }

  annuler() {
    this.modalService.dismissAll();
    this.showMediaModal = false;
    this.router.navigate(['/profile']);
  }

  addMediaToPost(): void {
    if (this.createdPostId !== null && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        const formData = new FormData();
        formData.append('file', file);

        const isPrivate = this.postForm.get('isPrivate')?.value;
        if (file.type.startsWith('image/')) {
          this.postService.addPictureToPost(this.createdPostId as number, isPrivate, formData).subscribe(
            response => {
              alert('Image ajoutée avec succès');
              console.log('Image ajoutée avec succès', response);
              this.router.navigate(['/profile']);
            },
            error => {
              console.error('Erreur lors de l\'ajout de l\'image', error);
            }
          );
        } else if (file.type.startsWith('video/')) {
          this.postService.addVideoToPost(this.createdPostId as number,isPrivate, formData).subscribe(
            response => {
              alert('Vidéo ajoutée avec succès');
              console.log('Vidéo ajoutée avec succès', response);
              this.router.navigate(['/profile']);
            },
            error => {
              console.error('Erreur lors de l\'ajout de la vidéo', error);
            }
          );
        }
      });
  
      this.modalService.dismissAll();
      this.resetForm();
    }
  }
  

  resetForm(): void {
    this.postForm.reset();
    this.selectedFiles = [];
    this.previewUrls = [];
    this.createdPostId = null;
    this.showMediaModal = false;
    this.isEditMode = false; // Reset edit mode after submission
    this.postId = null; 
  }
}
