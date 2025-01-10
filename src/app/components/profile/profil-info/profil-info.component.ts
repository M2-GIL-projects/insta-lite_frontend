import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/User';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/Post';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil-info',
  imports: [RouterLink, CommonModule],
  templateUrl: './profil-info.component.html',
  styleUrl: './profil-info.component.css'
})
export class ProfilInfoComponent implements OnInit{
  posts: Post[] = [];
  currentUser: User | null = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.userService.getMe().subscribe(
      (user) => {
        if (user) {
          this.currentUser = user;
          this.loadUserPosts(user.id as number);
        } else {
          console.error('Aucun utilisateur connecté');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur connecté', error);
      }
    );
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

    openModal(type: string, item: any) {
      const modalRef = this.modalService.open(ProfilModalComponent, { size: 'lg' });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.item = item;
    }
}
