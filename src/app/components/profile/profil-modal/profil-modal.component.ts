import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { PostService } from '../../../services/post.service';
import { Comment } from '../../../models/Post';

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
    private postService: PostService
  ) {}

  getImageUrl(relativeUrl: string | undefined): string {
    return relativeUrl
      ? `http://localhost:8080/${relativeUrl}`
      : 'assets/default-image.jpg';
  }


  deleteComment(commentId: number) {
    if (commentId) {
      const confirmDelete = confirm(
        'Êtes-vous sûr de vouloir supprimer ce commentaire ?'
      );
      if (confirmDelete) {
        this.postService.deleteComment(commentId).subscribe(
          () => {
            alert('Commentaire supprimé avec succès');
            // Mettre à jour l'affichage local
            this.item.comments = this.item.comments;
            console.log('Commentaire supprimé avec succès');
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

    if (!this.commentContent.trim()) return; // Ne pas envoyer de commentaire vide

    const commentData = {
      content: this.commentContent,
    };
    this.postService.addComment(postId, commentData).subscribe(
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
