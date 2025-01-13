import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, map, Observable, of } from 'rxjs';
import { User } from '../models/User';
import { Post } from '../models/Post';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8080/users/';
  private createUserUrl = 'http://localhost:8080/auth/signup';

  constructor(private http: HttpClient, private progressService: ProgressService) {}

  getUsers(): Observable<User[]> {
    this.progressService.show();
    return this.http.get<User[]>(this.userUrl).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  getPublicUsers(): Observable<Post[]> {
    this.progressService.show();
    return this.http.get<Post[]>('http://localhost:8080/portfolio/public').pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  getMe(): Observable<User> {
    this.progressService.show();
    return this.http.get<User>(`${this.userUrl}me`).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  
  
  getUserById(id: number): Observable<User> {
    this.progressService.show();
    return this.http.get<User>(`${this.userUrl}${id}`).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  createUser(user: User): Observable<User> {
    this.progressService.show();
    return this.http.post<User>(this.createUserUrl, user).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    this.progressService.show();
    return this.http.put<User>(`${this.userUrl}${id}`, user).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    this.progressService.show();
    return this.http.delete<void>(`${this.userUrl}${id}`).pipe(
      finalize(() => {
        this.progressService.hide();
      })
    );
  }

  changeUserRole(id: string, role: string): Observable<User> {
    this.progressService.show();
    return this.http.patch<User>(`${this.userUrl}${id}/role`, { role }).pipe(
          finalize(() => {
            this.progressService.hide();
          })
        );
  }

}
