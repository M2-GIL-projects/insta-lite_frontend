import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { finalize, Observable } from 'rxjs';
import { Picture, Post, Video } from '../models/Post';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminUrl = 'http://localhost:8080/admin/';

  constructor(private http: HttpClient, private progressService: ProgressService) {}

  getAllUsers(): Observable<User[]> {
    this.progressService.show();
    return this.http.get<User[]>(`${this.adminUrl}users`).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  createUser(user: User): Observable<User> {
    this.progressService.show();
    return this.http.post<User>(this.adminUrl, user).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  deleteUser(id: number): Observable<string> {
    this.progressService.show();
    return this.http.delete(`${this.adminUrl}users/${id}`, { responseType: 'text' }).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  getUserById(id: number): Observable<User> {
    this.progressService.show();
    return this.http.get<User>(`${this.adminUrl}users/${id}`).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  updateUser(id: number, user: User): Observable<User> {
    this.progressService.show();
    return this.http.put<User>(`${this.adminUrl}users/${id}`, user).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  changeUserRole(id: number, role: string): Observable<User> {
    this.progressService.show();
    return this.http.put<User>(`${this.adminUrl}users/role/${id}`,role).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

/**Gestion des posts */
  getAllPosts(): Observable<Post[]> {
    this.progressService.show();
    return this.http.get<Post[]>(`${this.adminUrl}posts`).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  createPost(postData: FormData): Observable<Post> {
    this.progressService.show();
    return this.http.post<Post>(`${this.adminUrl}posts`, postData).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  addVideoToPost(postId: number, isPrivate: boolean, postData: FormData): Observable<any> {
    this.progressService.show();
    return this.http.post<any>(`${this.adminUrl}videos/upload/${postId}?isPrivate=${isPrivate}`, postData).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

  addPictureToPost(postId: number, isPrivate: boolean, postData: FormData): Observable<any> {
    this.progressService.show();
    return this.http.post<any>(`${this.adminUrl}pictures/upload/${postId}?isPrivate=${isPrivate}`, postData).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

  updatePost(id: number, postData: FormData): Observable<Post> {
    this.progressService.show();
    return this.http.put<Post>(`${this.adminUrl}posts/${id}`, postData).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

  deletePost(postId: number): Observable<string> {
    this.progressService.show();
    return this.http.delete(`${this.adminUrl}posts/${postId}`, { responseType: 'text' }).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  togglePostVisibility(postId: number, isPublic: boolean): Observable<Post> {
    this.progressService.show();
    return this.http.patch<Post>(`${this.adminUrl}posts/${postId}/visibility`, { isPublic }).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }


  /**Gestion des images */
  getAllImages(): Observable<Picture[]> {
    this.progressService.show();
    return this.http.get<Picture[]>(`${this.adminUrl}images`).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  deleteImage(imageId: number): Observable<string> {
    this.progressService.show();
    return this.http.delete(`${this.adminUrl}images/${imageId}`, { responseType: 'text' }).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

  /**Gestion des Vidéos */
  getAllVideos(): Observable<Video[]> {
    this.progressService.show();
    return this.http.get<Video[]>(`${this.adminUrl}videos`).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
  deleteVideo(videoId: number): Observable<string> {
    this.progressService.show();
    return this.http.delete(`${this.adminUrl}videos/${videoId}`, { responseType: 'text' }).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

  
}
