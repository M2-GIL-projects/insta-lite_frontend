import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Gallery } from '../models/Gallery';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor() { }

  private images = [
    { id: 1,description:'', title: 'Sunset', url: 'https://source.unsplash.com/300x200/?nature', isPublic: true },
    { id: 2,description:'', title: 'Mountains', url: 'https://source.unsplash.com/300x200/?nature', isPublic: false },
    { id: 3,description:'', title: 'Beach', url: 'https://source.unsplash.com/300x200/?nature', isPublic: true }
  ];

  getImages(): Observable<Gallery[]> {
    return of(this.images);
  }

  getPublicImages(): Observable<Gallery[]> {
    return of(this.images.filter(img => img.isPublic));
  }
}
