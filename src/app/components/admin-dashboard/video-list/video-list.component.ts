import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { Video } from '../../../models/Post';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-video-list',
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent {
   videos: Video[] = [];
    
    constructor(
      private adminService: AdminService,
      private router : Router
    ) {
      this.loadAllVideos();
    }
  
    private loadAllVideos(): void {
      this.adminService.getAllVideos().subscribe(videos => {
        this.videos = videos;
      });
    }
  
}
