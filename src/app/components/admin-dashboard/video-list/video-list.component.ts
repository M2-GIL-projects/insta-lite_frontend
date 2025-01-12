import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Video } from '../../../models/Post';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../services/alert.service';


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
      private adminService: AdminService,private modalService: NgbModal, private alertService: AlertService
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
  

    openVideoModal(videoUrl: string): void {
      this.selectedVideoUrl = videoUrl; 
      const modalRef = this.modalService.open(this.imageModal, { size: 'lg' }); 
      modalRef.result.then(() => {
        this.selectedVideoUrl = null; 
      }, () => {
        this.selectedVideoUrl = null; 
      });
    }

    onDeleteVideo(videoId: number) {
      if (videoId) {
        this.alertService.confirmDelete("Êtes-vous sûr de vouloir supprimer cette vidéo ?")
          .then((confirmed) => {
            if (confirmed) {
              this.adminService.deleteVideo(videoId).subscribe(
                (response) => {
                  this.loadAllVideos();
                  this.alertService.showSuccess("Suppression !", "Vidéo supprimée avec succès !");
                  
                },
                (error) => {
                  this.alertService.showError("Erreur !", "Une erreur s'est produite lors de la suppression de la Vidéo.");
                  console.error("Erreur lors de la suppression de                                                                                                                                                                                                   l'image :", error);
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

}
