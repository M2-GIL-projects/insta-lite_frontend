import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/User';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/Post';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-profil-info',
  imports: [RouterLink, CommonModule],
  templateUrl: './profil-info.component.html',
  styleUrl: './profil-info.component.css',
})
export class ProfilInfoComponent implements OnInit {
  posts: Post[] = [];
  currentUser: User | null = null;
  userId? : number ;
  showAllComments: boolean = false;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private modalService: NgbModal,
    private router : Router,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.userService.getMe().subscribe(
      (user) => {
        if (user) {
          this.currentUser = user;
          this.userId = user.id;
          this.loadUserPosts(user.id as number);
        } else {
          console.error('Aucun utilisateur connecté');
        }
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération de l'utilisateur connecté",
          error
        );
      }
    );
  }

  removePostFromList(postId: number) {
    this.posts = this.posts.filter((post) => post.id !== postId);
  }

  loadUserPosts(userId: number) {
    this.postService.getUserPost(userId).subscribe(
      (posts) => {
        this.posts = posts;
      },
      (error) => {
        console.error('Erreur lors de la récupération des posts', error);
      }
    );
  }

  onEdit(postId : number){
    if(postId){
      this.router.navigate(['/addPost', postId]);
    }

  }

  deletePost(postId: number) {
    if (postId) {
      this.alertService.confirmDelete("Êtes-vous sûr de vouloir supprimer ce post ?")
        .then((confirmed) => {
          if (confirmed) {
            // Appeler le service de suppression
            this.postService.deletePost(postId).subscribe(
              (response) => {
                // Succès : afficher une alerte et recharger les posts
                this.alertService.showSuccess("Suppression !", "Post supprimé avec succès !");
                this.loadUserPosts(this.userId as number);
              },
              (error) => {
                // Échec : gérer les erreurs et afficher une alerte
                this.alertService.showError("Erreur !", "Une erreur s'est produite lors de la suppression du post.");
                console.error("Erreur lors de la suppression du post :", error);
              }
            );
          } else {
            console.log("L'utilisateur a annulé la suppression.");
          }
        });
    } else {
      console.warn("Aucun ID de post fourni pour la suppression.");
    }
  }
  



getImageUrl(relativeUrl: string | undefined): string {
  if(relativeUrl == undefined){
    return 'assets/defaut.jpg';
  }
  return `http://localhost:8080/${relativeUrl}`;
}

  openModal(type: string, item: any) {
    const modalRef = this.modalService.open(ProfilModalComponent, { size: 'lg' });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.showAllComments = this.showAllComments;
    modalRef.componentInstance.currentUser = this.currentUser;
}

}
