import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { Post } from '../../../models/Post';
import { CommonModule, DatePipe } from '@angular/common';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, DatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {
   posts: Post[] = [];
    
    constructor(
      private adminService: AdminService,
      private router : Router,
      private alertService : AlertService
    ) {
      this.loadAllPosts();
    }
  
    private loadAllPosts(): void {
      this.adminService.getAllPosts().subscribe(posts => {
        this.posts = posts;
      });
    }
  


    onDelete(postId: number) {
      if (postId) {
        this.alertService.confirmDelete("Êtes-vous sûr de vouloir supprimer ce post ?")
          .then((confirmed) => {
            if (confirmed) {
              this.adminService.deletePost(postId).subscribe(
                (response) => {
                  this.alertService.showSuccess("Suppression !", "Post supprimé avec succès !");
                  this.loadAllPosts();
                },
                (error) => {
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
  
    onUpdate (id : number) {
      this.router.navigate(['/addPost', id]);
    }
  
  
    onCreatePost () {
      this.router.navigate(['/addPost']);
    }
  
    onView(postId : number){
      this.router.navigate(['/post-detail', postId]);
    }
  
}
