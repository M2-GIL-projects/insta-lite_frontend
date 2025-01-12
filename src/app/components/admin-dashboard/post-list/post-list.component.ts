import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { Post } from '../../../models/Post';
import { CommonModule, DatePipe } from '@angular/common';

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
      private router : Router
    ) {
      this.loadAllPosts();
    }
  
    private loadAllPosts(): void {
      this.adminService.getAllPosts().subscribe(posts => {
        this.posts = posts;
      });
    }
  
    onDelete(id: number){
      if(id){
        const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce post ?');
        if(confirmDelete){
          this.adminService.deletePost(id).subscribe(
            (response) => {
              console.log('Réponse de suppression:', response);
              alert('Post supprimé avec succès');
              this.loadAllPosts();
            },
            (error) => {
                alert('Erreur lors de la suppression du post');
                console.log('erreur:', error);
              }
          );
        }
      }
    }
  
    onUpdate (id : number) {
      this.router.navigate(['/addPost', id]);
    }
  
  
    onCreatePost () {
      this.router.navigate(['/addPost']);
    }
  
    onView(postId : number){
      
    }
  
}
