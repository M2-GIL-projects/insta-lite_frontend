import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { GalleryService } from '../../services/gallery.service';
import { VideoService } from '../../services/video.service';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  activeTab: string = 'users';
  users: any[] = [];
  content: any[] = [];
  stats: any = {};
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private galleryService: GalleryService,
    private videoService: VideoService
  ) {
    this.loadUsers();
    this.loadContent();
    this.loadStats();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  private loadContent(): void {
    this.galleryService.getImages().subscribe(images => {
      this.content = [...this.content, ...images];
    });
    this.videoService.getVideos().subscribe(videos => {
      this.content = [...this.content, ...videos];
    });
  }

  private loadStats(): void {
    // Simuler le chargement des statistiques
    this.stats = {
      totalUsers: this.users.length,
      totalContent: this.content.length,
      publicContent: this.content.filter(item => item.isPublic).length
    };
  }
}
