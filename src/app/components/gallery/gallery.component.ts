import { Component, OnInit } from '@angular/core';
import { GalleryService } from '../../services/gallery.service';
import { Gallery } from '../../models/Gallery';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit{
  images: Gallery[] = []; 
  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.galleryService.getPublicImages().subscribe(
      (images) => {
        this.images = images;
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }

  openModal(image: Gallery): void {
    console.log('Image clicked:', image);
  }
  
}
