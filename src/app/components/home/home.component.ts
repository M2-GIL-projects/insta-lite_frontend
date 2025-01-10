import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/Post';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  suggestions: User[] = [];
  currentUser: User | null = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadUserAndSuggestions();
  }

  loadUserAndSuggestions(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      if (loggedIn) {
        this.userService.getMe().subscribe(
          user => {
            this.currentUser = user;
            this.loadSuggestionsForLoggedInUser();
          },
          error => console.error('Erreur lors de la récupération de l\'utilisateur courant', error)
        );
      } else {
        this.currentUser = null;
        this.loadRandomUsers();
      }
    });
  }

  loadPosts(): void {
    this.postService.getPublicPosts().subscribe(
      (posts) => {
        this.posts = posts;
      },
      (error) => {
        console.error('Erreur lors du chargement des posts', error);
      }
    );
  }

  loadSuggestionsForLoggedInUser(): void {
    if (!this.posts.length || !this.currentUser) return;
    const uniqueUsers = new Map<number, User>();
    for (const post of this.posts) {
      if (post.user.id !== this.currentUser.id && !uniqueUsers.has(post.user.id as number)) {
        uniqueUsers.set(post.user.id as number, post.user);
      }
    }
    this.suggestions = Array.from(uniqueUsers.values())
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }

  loadRandomUsers(): void {
    this.postService.getPublicPostsUsers().subscribe(
      (users) => {
        this.suggestions = users;
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs aléatoires', error);
      }
    );
  }

  likePost(postId: number): void {
    if (!this.currentUser) {
      alert('Vous devez être connecté pour liker un post');
      this.router.navigate(['/login']);
      return;
    }
    this.postService.likePost(postId).subscribe(
      () => {
        console.log('Post liké avec succès');
        this.loadPosts();
      },
      (error) => {
        console.error('Erreur lors du like du post', error);
      }
    );
  }

  openCommentModal(postId: number): void {
    if (!this.currentUser) {
      alert('Vous devez être connecté pour commenter un post');
      this.router.navigate(['/login']);
      return;
    }
    const modalRef = this.modalService.open(CommentModalComponent);
    modalRef.componentInstance.postId = postId;
    modalRef.result.then((commentContent) => {
      if (commentContent) {
        this.addComment(postId, commentContent);
      }
    });
  }

  addComment(postId: number, commentContent: string): void {
    if (!this.currentUser) return;
    this.postService.addComment(postId, { content: commentContent }).subscribe(
      () => {
        console.log('Commentaire ajouté avec succès');
        this.loadPosts();
      },
      (error) => {
        console.error("Erreur lors de l'ajout du commentaire", error);
      }
    );
  }
}
