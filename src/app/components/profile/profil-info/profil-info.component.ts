import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/User';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/Post';
import { CommonModule } from '@angular/common';

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
  constructor(
    private postService: PostService,
    private userService: UserService,
    private modalService: NgbModal,
    private router : Router
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
  if(postId){
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce post ?');
    if(confirmDelete){
      this.postService.deletePost(postId).subscribe(
        (response) => {
          console.log('Réponse de suppression:', response);
          alert('Post supprimé avec succès');
          this.loadUserPosts(this.userId as number);
        },
        (error) => {
          //console.error('Erreur lors de la suppression du post', error);
          if (error.status === 200) {
            // La suppression a réussi malgré l'erreur de parsing
            alert('Post supprimé avec succès');
            this.loadUserPosts(this.userId as number);
          } else {
            alert('Erreur lors de la suppression du post');
          }
        }
      );
    }
  }
}



  getImageUrl(relativeUrl: string | undefined): string {
    return `http://localhost:8080/${relativeUrl}`;
  }

  openModal(type: string, item: any) {
    const modalRef = this.modalService.open(ProfilModalComponent, { size: 'lg' });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.currentUser = this.currentUser;
}

}
