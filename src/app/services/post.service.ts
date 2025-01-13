import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, Like, Post } from '../models/Post';
import { finalize, map, mergeMap, Observable, of } from 'rxjs';
import { User } from '../models/User';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8080/posts';
  private apiPublicUrl = 'http://localhost:8080/portfolio/public';
  private addMediaUrl = 'http://localhost:8080/posts/';
  private userPostUrl = 'http://localhost:8080/posts/user';
  private commentUrl = 'http://localhost:8080/comments';

  constructor(
    private http: HttpClient,
    private progressService: ProgressService
  ) {}

  getPosts(): Observable<Post[]> {
    this.progressService.show();
    return this.http.get<Post[]>(this.apiUrl).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  getUserPost(userId: number): Observable<Post[]> {
    this.progressService.show();
    return this.http.get<Post[]>(`${this.userPostUrl}/${userId}`).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  getPublicPosts(): Observable<Post[]> {
    this.progressService.show();
    return this.http.get<Post[]>(this.apiPublicUrl).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  getPrivatePosts(): Observable<Post[]> {
    this.progressService.show();
    return this.http.get<Post[]>('http://localhost:8080/portfolio/private').pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  getPublicPostsUsers(): Observable<User[]> {
    this.progressService.show();
    return this.getPublicPosts().pipe(
      map((posts) => {
        // Extraire les utilisateurs uniques des posts
        const uniqueUsers = new Map<number, User>();
        posts.forEach((post) => {
          if (!uniqueUsers.has(post.user.id as number)) {
            uniqueUsers.set(post.user.id as number, post.user);
          }
        });
        return Array.from(uniqueUsers.values());
      }),
      mergeMap((users) => this.getRandomUsers(users, 10))
    ).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  getRandomUsers(users: User[], count: number): Observable<User[]> {
    const shuffled = users.sort(() => 0.5 - Math.random());
    return of(shuffled.slice(0, count));
  }

  getPostById(id: number): Observable<Post> {
    this.progressService.show();
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  createPost(postData: FormData): Observable<Post> {
    this.progressService.show();
    return this.http.post<Post>(this.apiUrl, postData).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  addPictureToPost(
    postId: number,
    isPrivate: boolean,
    postData: FormData
  ): Observable<any> {
    this.progressService.show();
    return this.http.post(
      `${this.addMediaUrl}pictures/upload/${postId}?isPrivate=${isPrivate}`,
      postData
    ).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  updatePictureToPost(
    postId: number,
    postData: FormData
  ): Observable<any> {
    this.progressService.show();
    return this.http.put(
      `${this.addMediaUrl}pictures/update/${postId}`,
      postData
    ).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  addVideoToPost(
    postId: number,
    isPrivate: boolean,
    formData: FormData
  ): Observable<any> {
    this.progressService.show();
    return this.http.post(
      `${this.addMediaUrl}videos/upload/${postId}?isPrivate=${isPrivate}`,
      formData
    ).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  updateVideoToPost(
    postId: number,
    isPrivate: boolean,
    formData: FormData
  ): Observable<any> {
    this.progressService.show();
    return this.http.put(
      `${this.addMediaUrl}videos/update/${postId}?isPrivate=${isPrivate}`,
      formData
    ).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  updatePost(id: number, postData: FormData): Observable<Post> {
    this.progressService.show();
    return this.http.put<Post>(`${this.apiUrl}/${id}`, postData).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  deletePost(id: number): Observable<string> {
    this.progressService.show();
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  togglePostVisibility(id: number, isPublic: boolean): Observable<Post> {
    this.progressService.show();
    return this.http.patch<Post>(`${this.apiUrl}/${id}/visibility`, {
      isPublic,
    }).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  addComment(postId: number, comment: string): Observable<Comment> {
    this.progressService.show();
    return this.http.post<Comment>(`${this.commentUrl}/add/${postId}`, comment).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  deleteComment(commentId: number): Observable<string> {
    this.progressService.show();
    return this.http.delete(`${this.commentUrl}/${commentId}`, {
      responseType: 'text',
    }).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  likePost(postId: number): Observable<Like> {
    this.progressService.show();
    const likeUrl = 'http://localhost:8080/likes';
    return this.http.post<Like>(`${likeUrl}/${postId}`, {}).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

  deleteLikePost(postId: number): Observable<string> {
    this.progressService.show();
    const likeUrl = 'http://localhost:8080/likes';
    return this.http.delete(`${likeUrl}/${postId}`, { responseType: 'text' }).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }
}
