import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Picture } from '../../../models/Post';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-list',
  imports: [CommonModule],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})
export class ImageListComponent {
  images: Picture[] = [];
    
    constructor(
      private adminService: AdminService,
      private router : Router
    ) {
      this.loadAllImages();
    }
  
    private loadAllImages(): void {
      this.adminService.getAllImages().subscribe(images => {
        this.images = images;
      });
    }

    getImageUrl(relativeUrl: string | undefined): string {
      if(relativeUrl == undefined){
        return 'assets/defaut.jpg';
      }
      return `http://localhost:8080/${relativeUrl}`;
    }
  
}
