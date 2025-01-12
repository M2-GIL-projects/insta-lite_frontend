import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/User';
import { Picture, Post, Video } from '../../../models/Post';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  users: User[] = [];
  posts: Post[] = [];
  images: Picture[] = [];
  videos: Video[] = [];
    
    constructor(
      private adminService: AdminService
    ) {
      this.loadAllUsers();
      this.loadAllVideos();
      this.loadAllPosts();
      this.loadAllImages()
    }
  
    private loadAllUsers(): void {
      this.adminService.getAllUsers().subscribe(users => {
        this.users = users;
      });
    }

    private loadAllVideos(): void {
      this.adminService.getAllVideos().subscribe(videos => {
        this.videos = videos;
      });
    }

    private loadAllPosts(): void {
      this.adminService.getAllPosts().subscribe(posts => {
        this.posts = posts;
      });
    }

    private loadAllImages(): void {
      this.adminService.getAllImages().subscribe(images => {
        this.images = images;
      });
    }
}
