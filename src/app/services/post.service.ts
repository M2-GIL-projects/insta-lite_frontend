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
  private apiPublicUrl = 'http://localhost:8080/portfolio/public';
  private addMediaUrl = 'http://localhost:8080/posts/';
  private userPostUrl = 'http://localhost:8080/posts/user';
  private commentUrl="http://localhost:8080/comments";

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

  getPrivatePosts(): Observable<Post[]> {
    return this.http.get<Post[]>("http://localhost:8080/portfolio/private");
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

  addPictureToPost(postId: number, isPrivate: boolean, postData: FormData): Observable<any> {
    return this.http.post(`${this.addMediaUrl}pictures/upload/${postId}?isPrivate=${isPrivate}`, postData);
  }

  updatePictureToPost(postId: number, isPrivate: boolean, postData: FormData): Observable<any> {
    return this.http.put(`${this.addMediaUrl}pictures/update/${postId}?isPrivate=${isPrivate}`, postData);
  }
  
  addVideoToPost(postId: number, isPrivate: boolean, formData: FormData): Observable<any> {
    return this.http.post(`${this.addMediaUrl}videos/upload/${postId}?isPrivate=${isPrivate}`, formData);
  }

  updateVideoToPost(postId: number, isPrivate: boolean, formData: FormData): Observable<any> {
    return this.http.put(`${this.addMediaUrl}videos/update/${postId}?isPrivate=${isPrivate}`, formData);
  }
  
  

  updatePost(id: number, postData: FormData): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData);
  }

  
  deletePost(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  togglePostVisibility(id: number, isPublic: boolean): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}/visibility`, { isPublic });
  }

  addComment(postId: number, comment: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.commentUrl}/add/${postId}`, comment);
  }

  deleteComment(commentId: number): Observable<string> {
    return this.http.delete(`${this.commentUrl}/${commentId}`, { responseType: 'text' });
  }

  likePost(postId: number): Observable<Like> {
    const likeUrl="http://localhost:8080/likes";
    return this.http.post<Like>( `${likeUrl}/${postId}`, {});
  }

  deleteLikePost(postId: number): Observable<string> {
    const likeUrl = "http://localhost:8080/likes";
    return this.http.delete(`${likeUrl}/${postId}`, { responseType: 'text' });
  }
  

}
