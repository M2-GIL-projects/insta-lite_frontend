import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { PostService } from '../../../services/post.service';
import { Comment } from '../../../models/Post';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-profil-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil-modal.component.html',
  styleUrl: './profil-modal.component.css',
})
export class ProfilModalComponent {
  @Input() type: string = '';
  @Input() item: any;
  @Input() currentUser: User | null = null;

  commentContent: string = '';
  

  constructor(
    public activeModal: NgbActiveModal,
    private postService: PostService,
    private router : Router,
    private alertService : AlertService
  ) {}

  getImageUrl(relativeUrl: string | undefined): string {
    if(relativeUrl == undefined){
      return 'assets/defaut.jpg';
    }
    return `http://localhost:8080/${relativeUrl}`;
  }

  voirPost(postId: number | undefined): void {
    if (postId !== undefined) {
  this.router.navigate(['/post-detail', postId]); 
    }
}

  deleteComment(commentId: number) {
    if (commentId) {
      const confirmDelete = confirm(
        'Êtes-vous sûr de vouloir supprimer ce commentaire ?'
      );
      if (confirmDelete) {
        this.postService.deleteComment(commentId).subscribe(
          () => {
            this.alertService.showSuccess("Suppression", "Commentaire supprimé avec succès!");
            this.item.comments = this.item.comments;
          },
          (error) => {
            console.error(
              'Erreur lors de la suppression du commentaire',
              error
            );
          }
        );
      }
    }
  }

  addComment(postId: number): void {
    console.log('Commentaire is called');
    if (!this.currentUser) return;

    if (!this.commentContent.trim()) return; 

    this.postService.addComment(postId, this.commentContent).subscribe(
      () => {
        console.log('Commentaire ajouté avec succès');
        this.item.comments.push({
          user: { pseudo: this.currentUser?.pseudo },
          content: this.commentContent,
        }); // Ajoutez le nouveau commentaire à l'affichage
        this.commentContent = ''; // Réinitialiser le champ de commentaire
      },
      (error) => {
        console.error("Erreur lors de l'ajout du commentaire", error);
      }
    );
  }

}
