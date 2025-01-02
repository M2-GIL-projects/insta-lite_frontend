import { Routes } from '@angular/router';
import { HomeComponent } from './compoents/home/home.component';
import { GalleryComponent } from './compoents/gallery/gallery.component';
import { LoginComponent } from './compoents/login/login.component';
import { AdminDashboardComponent } from './compoents/admin-dashboard/admin-dashboard.component';
import { VideoPlayerComponent } from './compoents/video-player/video-player.component';
import { ProfilEditComponent } from './compoents/profile/profil-edit/profil-edit.component';
import { ProfilInfoComponent } from './compoents/profile/profil-info/profil-info.component';
import { ProfilModalComponent } from './compoents/profile/profil-modal/profil-modal.component';

export const routes: Routes = [
{ path: '', component: HomeComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'videos', component: VideoPlayerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfilInfoComponent},
  { path: 'profile/:userId', component: ProfilEditComponent},
  { path: 'profile/contenu/:Id', component: ProfilModalComponent},
  { path: 'admin', component: AdminDashboardComponent}
  //{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  //{ path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] }
];
