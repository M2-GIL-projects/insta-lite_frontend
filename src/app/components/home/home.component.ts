import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Like, Post } from '../../models/Post';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { ProfilModalComponent } from '../profile/profil-modal/profil-modal.component';
import { AlertService } from '../../services/alert.service';

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
    private alertService: AlertService,
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

    if(this.currentUser?.role == "USER" || !this.currentUser){
      this.postService.getPublicPosts().subscribe(
        (posts) => {
          this.posts = posts;
        },
        (error) => {
          console.error('Erreur lors du chargement des posts', error);
        }
      );
    }else if(this.currentUser?.role == "PRIVILEGED_USER" || this.currentUser?.role == "ADMIN"){
      this.postService.getPrivatePosts().subscribe(
      (posts) => {
        this.posts = posts;
      },
      (error) => {
        console.error('Erreur lors du chargement des posts', error);
      }
    );
    }
  }

  voirPost(postId: number | undefined): void {
    if (postId !== undefined) {
  this.router.navigate(['/post-detail', postId]); 
    }
}

  voirUser(userId: number | undefined): void {
    if (userId !== undefined) {
  this.router.navigate(['/public-profile', userId]); 
    }
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

  likePost(post: Post): void {
    if (!this.currentUser) {
      this.alertService.showError("Action non autorisés!", "Vous devez être connecté pour liker un post");
      this.router.navigate(['/login']);
      return;
    }
    this.postService.likePost(post.id).subscribe(
      (response: Like) => {
        console.log('Post liké avec succès');
        post.likes = post.likes || [];
        post.likes.push(response);
      },
      (error) => {
        console.error('Erreur lors du like du post', error);
      }
    );
    
  }
  
  dislikePost(post: Post): void {
    this.postService.deleteLikePost(post.id).subscribe(
      (response: string) => {
        console.log('Post disliké avec succès:', response);
        post.likes = post.likes?.filter(like => like.user.id !== this.currentUser?.id) || [];
      },
      (error) => {
        console.error('Erreur lors du dislike du post', error);
      }
    );
  }
  
  
  isLikedByCurrentUser(post: Post): boolean {
    return post.likes?.some(like => like.user.id === this.currentUser?.id) ?? false;
  }
  
  toggleLike(post: Post): void {
    if (!this.currentUser) {
    this.alertService.showError("Action non autorisée!", "Vous devez être connecté pour liker ou disliker un post!");
      this.router.navigate(['/login']);
      return;
    }
  
    if (this.isLikedByCurrentUser(post)) {
      this.dislikePost(post);
    } else {
      this.likePost(post);
    }
  }
  
  


  getImageUrl(relativeUrl: string | undefined): string {
    if(relativeUrl == undefined){
      return 'assets/defaut.jpg';
    }
    return `http://localhost:8080/${relativeUrl}`;
  }
  
  

  openCommentModal(postId: number): void {
    if (!this.currentUser) {
      this.alertService.showError("Action non autoriséé!", "Vous devez être connecté pour commenter un post");  
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

  openHomeModal(type: string, item: any) {
      const modalRef = this.modalService.open(ProfilModalComponent, { size: 'lg' });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.currentUser = this.currentUser;
  }


  addComment(postId: number, commentContent: string): void {
    if (!this.currentUser) return;
    this.postService.addComment(postId, commentContent).subscribe(
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
