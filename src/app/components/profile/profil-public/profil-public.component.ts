import { Component, OnInit } from '@angular/core';
import { Post } from '../../../models/Post';
import { User } from '../../../models/User';
import { UserService } from '../../../services/user.service';
import { PostService } from '../../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';

@Component({
  selector: 'app-profil-public',
  imports: [CommonModule],
  templateUrl: './profil-public.component.html',
  styleUrl: './profil-public.component.css',
})
export class ProfilPublicComponent implements OnInit {
  posts: Post[] = [];
  currentUser: User | null = null;
  selectedUser?: User | null = null;
  users: User[] = [];
  private userMap = new Map<number, User>();

  constructor(
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();

    this.authService.isLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        this.userService.getMe().subscribe(
          (user) => {
            this.currentUser = user;
          },
          (error) =>
            console.error(
              "Erreur lors de la récupération de l'utilisateur courant",
              error
            )
        );
      } else {
        this.currentUser = null;
      }
    });
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPublicPosts().subscribe(
      (lesPosts) => {
        this.posts = lesPosts;
        this.extractUsers();

        if (!this.currentUser) {
          const userId = this.route.snapshot.paramMap.get('userId');
          if (userId) {
            this.selectedUser = this.getUserById(+userId);
            if (this.selectedUser) {
              console.log('Utilisateur trouvé :', this.selectedUser);
            } else {
              console.log("Aucun utilisateur trouvé avec l'ID :", userId);
            }
          }
        } else {
          const userId = this.route.snapshot.paramMap.get('userId');
          if (userId !== null) {
            this.userService.getUserById(+userId).subscribe(
              (user) => {
                this.selectedUser = user;
                this.currentUser = user;
              },
              (error) =>
                console.error(
                  "Erreur lors de la récupération de l'utilisateur courant",
                  error
                )
            );
          } else {
            console.error("L'ID de l'utilisateur est null");
          }
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des posts', error);
      }
    );
  }

  voirPost(postId: number | undefined): void {
    if (postId !== undefined) {
  this.router.navigate(['/post-detail', postId]); 
    }
}

  getUserById(id: number): User | undefined {
    return this.userMap.get(id);
  }

  extractUsers(): void {
    const userPostCount = new Map<number, number>();

    this.posts.forEach((post) => {
      if (post.user && post.user.id !== undefined) {
        if (!this.userMap.has(post.user.id)) {
          this.userMap.set(post.user.id, { ...post.user, postCount: 0 });
        }

        const currentCount = userPostCount.get(post.user.id) || 0;
        userPostCount.set(post.user.id, currentCount + 1);
      }
    });

    userPostCount.forEach((count, userId) => {
      const user = this.userMap.get(userId);
      if (user) {
        user.postCount = count;
      }
    });

    this.users = Array.from(this.userMap.values());
    console.log('Utilisateurs extraits avec nombre de posts :', this.users);
  }

  getImageUrl(relativeUrl: string | undefined): string {
    if (relativeUrl == undefined) {
      return 'assets/defaut.jpg';
    }
    return `http://localhost:8080/${relativeUrl}`;
  }

    openModal(type: string, item: any) {
      const modalRef = this.modalService.open(ProfilModalComponent, { size: 'lg' });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.item = item;
      modalRef.componentInstance.currentUser = this.currentUser;
  }
}
