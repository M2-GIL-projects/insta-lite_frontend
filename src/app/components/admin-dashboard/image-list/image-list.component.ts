import { Component, ViewChild } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Picture } from '../../../models/Post';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-image-list',
  imports: [CommonModule],
  templateUrl: './image-list.component.html',
  styleUrl: './image-list.component.css'
})
export class ImageListComponent {
  images: Picture[] = [];
  selectedImageUrl: string | null = null;
  @ViewChild('imageModal') imageModal: any;
    
    constructor(
      private adminService: AdminService,
       private modalService: NgbModal,
       private alertService: AlertService,

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

    openImageModal(imageUrl: string): void {
      this.selectedImageUrl = imageUrl; 
      const modalRef = this.modalService.open(this.imageModal, { size: 'lg' }); // Ouvre le modal
      modalRef.result.then(() => {
        this.selectedImageUrl = null; 
      }, () => {
        this.selectedImageUrl = null; 
      });
    }


    onDeleteImage(imageId: number) {
      if (imageId) {
        this.alertService.confirmDelete("Êtes-vous sûr de vouloir supprimer cette image ?")
          .then((confirmed) => {
            if (confirmed) {
              this.adminService.deleteImage(imageId).subscribe(
                (response) => {
                  this.loadAllImages();
                  this.alertService.showSuccess("Suppression !", "Image supprimée avec succès !");
                  
                },
                (error) => {
                  this.alertService.showError("Erreur !", "Une erreur s'est produite lors de la suppression de l'image.");
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
