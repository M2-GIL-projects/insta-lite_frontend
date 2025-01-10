import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild('mediaModal') mediaModal: any;


  constructor(
    private fb: FormBuilder, 
    private postService: PostService,
    private modalService: NgbModal
  ) {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]],
      isPrivate: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      this.postService.createPost(postData).subscribe(
        response => {
          console.log('Post créé avec succès', response);
          this.createdPostId = response.id; // Récupération de l'ID du post créé
          this.openMediaModal(this.mediaModal);// Ouvrir le modal pour ajouter des médias
        },
        error => {
          console.error('Erreur lors de la création du post', error);
        }
      );
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
  

  addMediaToPost(): void {
    if (this.createdPostId !== null && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        const formData = new FormData();
        formData.append('file', file);
  
        if (file.type.startsWith('image/')) {
          this.postService.addPictureToPost(this.createdPostId as number, formData).subscribe(
            response => {
              alert('Image ajoutée avec succès');
              console.log('Image ajoutée avec succès', response);
            },
            error => {
              console.error('Erreur lors de l\'ajout de l\'image', error);
            }
          );
        } else if (file.type.startsWith('video/')) {
          this.postService.addVideoToPost(this.createdPostId as number, formData).subscribe(
            response => {
              alert('Vidéo ajoutée avec succès');
              console.log('Vidéo ajoutée avec succès', response);
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
  }
}
