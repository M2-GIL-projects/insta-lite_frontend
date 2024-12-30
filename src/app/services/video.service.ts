import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Video } from '../models/Video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor() { }

  private videos: Video[] = [
    { id: 1, description: 'video1', title: 'Nature Documentary', url: 'https://example.com/nature.mp4', isPublic: true },
    { id: 2, description: 'video2', title: 'Cooking Tutorial', url: 'https://example.com/cooking.mp4', isPublic: false },
    { id: 3, description: 'video3', title: 'Travel Vlog', url: 'https://example.com/travel.mp4', isPublic: true }
  ];
  
  

  getVideos(): Observable<Video[]> {
    return of(this.videos);
  }

  getPublicVideos(): Observable<Video[]> {
    return of(this.videos.filter(video => video.isPublic));
  }

  getVideoById(id: number): Observable<any> {
    return of(this.videos.find(video => video.id === id));
  }
}
