import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';
import { VideoListComponent } from './video-list/video-list.component';
import { ImageListComponent } from './image-list/image-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/User';
import { PostListComponent } from './post-list/post-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ImageListComponent,
    VideoListComponent,
    UserListComponent,
    DashboardComponent,
    PostListComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  activeTab: string = 'users';
  users: User[] = [];
  posts: any[] = [];
  images: any[] = [];

  constructor(private adminService: AdminService) {
    this.loadAllUsers();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private loadAllUsers(): void {
    this.adminService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
