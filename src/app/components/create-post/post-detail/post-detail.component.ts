import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../models/User';
import { Like, Post } from '../../../models/Post';
import { PostService } from '../../../services/post.service';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-detail',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit {
  post?: Post | null = null;
  currentUser: User | null = null;
  newComment: string = '';
  isLiked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId');
    if (postId) {
      this.loadPost(+postId);
    }
    this.userService.getMe().subscribe(user => {
      this.currentUser = user;
    });
  }

  loadPost(id: number): void {
    this.postService.getPostById(id).subscribe(
      (post) => {
        console.log('Post reçu:', post);
        this.post = post;
        console.log('Post assigné:', this.post);
        this.isLiked = this.checkIfLiked();
      },
      error => console.error('Erreur lors du chargement du post', error)
    );
  }
  

  toggleLike(): void {
    if (this.post) {
      if (this.isLiked) {
        this.postService.deleteLikePost(this.post.id).subscribe(
          () => {
            this.isLiked = false;
            this.post!.likes = this.post!.likes?.filter(like => like.user.id !== this.currentUser?.id) || [];
          },
          error => console.error('Erreur lors du dislike', error)
        );
      } else {
        this.postService.likePost(this.post.id).subscribe(
          (newLike: Like) => {
            this.isLiked = true;
            this.post!.likes = [...(this.post!.likes || []), newLike];
          },
          error => console.error('Erreur lors du like', error)
        );
      }
    }
  }
  

  addComment(): void {
    if (this.post && this.newComment.trim()) {
      this.postService.addComment(this.post.id, this.newComment).subscribe(
        comment => {
          this.post!.comments = [...(this.post!.comments || []), comment];
          this.newComment = '';
        },
        error => console.error('Erreur lors de l\'ajout du commentaire', error)
      );
    }
  }

  deleteComment(commentId: number): void {
    if (this.post) {
      this.postService.deleteComment(commentId).subscribe(
        () => {
          this.post!.comments = this.post!.comments?.filter(c => c.id !== commentId) || [];
        },
        error => console.error('Erreur lors de la suppression du commentaire', error)
      );
    }
  }

  checkIfLiked(): boolean {
    return this.post?.likes?.some(like => like.user.id === this.currentUser?.id) ?? false;
  }

  canDeleteComment(comment: any): boolean {
    return this.currentUser?.id === comment.user.id || this.currentUser?.role === 'ADMIN';
  }

  getImageUrl(relativeUrl: string | undefined): string {
    if(relativeUrl == undefined){
      return 'assets/defaut.jpg';
    }
    return `http://localhost:8080/${relativeUrl}`;
  }
}