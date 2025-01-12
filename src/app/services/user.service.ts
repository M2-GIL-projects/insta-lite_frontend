import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { User } from '../models/User';
import { Post } from '../models/Post';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8080/users/';
  private createUserUrl = 'http://localhost:8080/auth/signup';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  getPublicUsers(): Observable<Post[]> {
    return this.http.get<Post[]>('http://localhost:8080/portfolio/public');
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.userUrl}me`);
  }

  
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.createUserUrl, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.userUrl}${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.userUrl}${id}`);
  }

  changeUserRole(id: string, role: string): Observable<User> {
    return this.http.patch<User>(`${this.userUrl}${id}/role`, { role });
  }

}
