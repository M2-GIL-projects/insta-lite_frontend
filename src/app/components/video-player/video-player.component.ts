import { Component, OnInit } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { Video } from '../../models/Video';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnInit{
 constructor(private videoService: VideoService){}
 videos: Video[] = [];

 ngOnInit() {
   this.videoService.getVideos().subscribe(
     (videos) => {
       this.videos = videos;
     },
     (error) => {
       console.error('Error fetching video data:', error);
     }
   );
 }
}
