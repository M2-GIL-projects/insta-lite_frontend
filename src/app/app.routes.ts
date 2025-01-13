import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ProfilEditComponent } from './components/profile/profil-edit/profil-edit.component';
import { ProfilInfoComponent } from './components/profile/profil-info/profil-info.component';
import { ProfilModalComponent } from './components/profile/profil-modal/profil-modal.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './components/auth.guard';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { AdminGuard } from './components/admin.guard';
import { UserListComponent } from './components/admin-dashboard/user-list/user-list.component';
import { ProfilPublicComponent } from './components/profile/profil-public/profil-public.component';
import { PostDetailComponent } from './components/create-post/post-detail/post-detail.component';
import { PostListComponent } from './components/admin-dashboard/post-list/post-list.component';
import { ImageListComponent } from './components/admin-dashboard/image-list/image-list.component';
import { VideoListComponent } from './components/admin-dashboard/video-list/video-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'signup/:userId', component: RegisterComponent , canActivate: [AuthGuard, AdminGuard] },
  { path: 'posts', component: PostListComponent , canActivate: [AuthGuard, AdminGuard] },
  { path: 'users', component: UserListComponent , canActivate: [AuthGuard, AdminGuard] },
  { path: 'images', component: ImageListComponent , canActivate: [AuthGuard, AdminGuard] },
  { path: 'videos', component: VideoListComponent , canActivate: [AuthGuard, AdminGuard] },
  { path: 'public-profile/:userId', component: ProfilPublicComponent },
  { path: 'addPost', component: CreatePostComponent, canActivate: [AuthGuard] },
  { path: 'post-detail/:postId', component: PostDetailComponent, canActivate: [AuthGuard] },
  {
    path: 'addPost/:postId',
    component: CreatePostComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfilInfoComponent, canActivate: [AuthGuard] },
  {
    path: 'profile/:userId',
    component: ProfilEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/contenu/:Id',
    component: ProfilModalComponent,
    canActivate: [AuthGuard],
  },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard, AdminGuard], },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, AdminGuard],
  }
];
