import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { ProfilEditComponent } from './components/profile/profil-edit/profil-edit.component';
import { ProfilInfoComponent } from './components/profile/profil-info/profil-info.component';
import { ProfilModalComponent } from './components/profile/profil-modal/profil-modal.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './components/auth.guard';
import { CreatePostComponent } from './components/create-post/create-post.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'videos', component: VideoPlayerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'addPost', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfilInfoComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userId', component: ProfilEditComponent, canActivate: [AuthGuard] },
  { path: 'profile/contenu/:Id', component: ProfilModalComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  // Ajoutez un AdminGuard spécifique pour la route admin si nécessaire
];

