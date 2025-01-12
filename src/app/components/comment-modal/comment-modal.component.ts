import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comment-modal',
  imports: [FormsModule],
  templateUrl: './comment-modal.component.html',
  styleUrl: './comment-modal.component.css'
})
export class CommentModalComponent {
  postId!: number;
  commentContent: string = ''; 

  constructor(public activeModal: NgbActiveModal, private router:Router) {}

  voirPost(postId: number | undefined): void {
    if (postId !== undefined) {
  this.router.navigate(['/post-detail', postId]); 
    }
}

 submit(): void {
    this.activeModal.close(this.commentContent); // Passer le contenu du commentaire au parent
  }
}
