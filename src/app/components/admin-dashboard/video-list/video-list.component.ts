import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { Video } from '../../../models/Post';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-video-list',
  imports: [CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent {
   videos: Video[] = [];
   selectedVideoUrl: string | null = null;
  @ViewChild('imageModal') imageModal: any;
    
    constructor(
      private adminService: AdminService,private modalService: NgbModal
    ) {
      this.loadAllVideos();
    }
  
    private loadAllVideos(): void {
      this.adminService.getAllVideos().subscribe(videos => {
        this.videos = videos;
      });
    }

    getImageUrl(relativeUrl: string | undefined): string {
      if(relativeUrl == undefined){
        return 'assets/defaut.jpg';
      }
      return `http://localhost:8080/${relativeUrl}`;
    }
  

    openImageModal(videoUrl: string): void {
      this.selectedVideoUrl = videoUrl; 
      const modalRef = this.modalService.open(this.imageModal, { size: 'lg' }); // Ouvre le modal
      modalRef.result.then(() => {
        this.selectedVideoUrl = null; 
      }, () => {
        this.selectedVideoUrl = null; 
      });
    }

}
