import { Routes } from '@angular/router';
import { HomeComponent } from './compoents/home/home.component';
import { GalleryComponent } from './compoents/gallery/gallery.component';
import { LoginComponent } from './compoents/login/login.component';
import { ProfileComponent } from './compoents/profile/profile.component';
import { AdminDashboardComponent } from './compoents/admin-dashboard/admin-dashboard.component';
import { VideoPlayerComponent } from './compoents/video-player/video-player.component';

export const routes: Routes = [
{ path: '', component: HomeComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'videos', component: VideoPlayerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'admin', component: AdminDashboardComponent}
  //{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  //{ path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] }
];
