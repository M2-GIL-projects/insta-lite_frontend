import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { Picture, Post, Video } from '../models/Post';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private adminUrl = 'http://localhost:8080/admin/';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminUrl}users`);
  }
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.adminUrl, user);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}users/${id}`);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.adminUrl}users/${id}`);
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.adminUrl}users/${id}`, user);
  }
  changeUserRole(id: number, role: string): Observable<User> {
    return this.http.patch<User>(`${this.adminUrl}users/role/${id}`, { role });
  }

/**Gestion des posts */
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.adminUrl}posts`);
  }
  createPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.adminUrl}posts`, postData);
  }
  addVideoToPost(postId: number, isPrivate: boolean, postData: FormData): Observable<any> {
    return this.http.post<any>(`${this.adminUrl}videos/upload/${postId}?isPrivate=${isPrivate}`, postData);
  }

  addPictureToPost(postId: number, isPrivate: boolean, postData: FormData): Observable<any> {
    return this.http.post<any>(`${this.adminUrl}pictures/upload/${postId}?isPrivate=${isPrivate}`, postData);
  }

  updatePost(id: number, postData: FormData): Observable<Post> {
    return this.http.put<Post>(`${this.adminUrl}posts/${id}`, postData);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}posts/${postId}`);
  }
  togglePostVisibility(postId: number, isPublic: boolean): Observable<Post> {
    return this.http.patch<Post>(`${this.adminUrl}posts/${postId}/visibility`, { isPublic });
  }


  /**Gestion des images */
  getAllImages(): Observable<Picture[]> {
    return this.http.get<Picture[]>(`${this.adminUrl}images`);
  }

  /**Gestion des Vidéos */
  getAllVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.adminUrl}videos`);
  }

  
}
