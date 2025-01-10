import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, Like, Post } from '../models/Post';
import { map, mergeMap, Observable, of } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:8080/posts';
  private apiPublicUrl = 'http://localhost:8080/public';
  private addMediaUrl = 'http://localhost:8080/posts/videos/';
  private userPostUrl = 'http://localhost:8080/posts/user';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getUserPost(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.userPostUrl}/${userId}`);
  }  

  getPublicPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiPublicUrl);
  }

  getPublicPostsUsers(): Observable<User[]> {
    return this.getPublicPosts().pipe(
      map(posts => {
        // Extraire les utilisateurs uniques des posts
        const uniqueUsers = new Map<number, User>();
        posts.forEach(post => {
          if (!uniqueUsers.has(post.user.id as number)) {
            uniqueUsers.set(post.user.id as number, post.user);
          }
        });
        return Array.from(uniqueUsers.values());
      }),
      mergeMap(users => this.getRandomUsers(users, 10))
    );
  }
  
  getRandomUsers(users: User[], count: number): Observable<User[]> {
    const shuffled = users.sort(() => 0.5 - Math.random());
    return of(shuffled.slice(0, count));
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(postData: FormData): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData);
  }

  addVideoToPost(id: number, postData: FormData): Observable<any> {
    return this.http.post<any>(`${this.addMediaUrl}upload/${id}`, postData);
  }

  addPictureToPost(id: number, postData: FormData): Observable<any> {
    return this.http.post<any>(`${this.addMediaUrl}upload/${id}`, postData);
  }

  updatePost(id: number, postData: FormData): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  togglePostVisibility(id: number, isPublic: boolean): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}/visibility`, { isPublic });
  }

  addComment(postId: number, comment: { content: string }): Observable<Comment> {
    const commentUrl="http://localhost:8080/comments/add";
    return this.http.post<Comment>(`${commentUrl}/${postId}`, comment);
  }

  deleteComment(postId: number, commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}/comments/${commentId}`);
  }

  likePost(postId: number): Observable<Like> {
    const likeUrl="http://localhost:8080/likes";
    return this.http.post<Like>( `${likeUrl}/${postId}`, {});
  }
}
