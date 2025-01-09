import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/User';

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

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.userUrl}me`);
  }
  
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.createUserUrl, user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.userUrl}${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.userUrl}${id}`);
  }

  changeUserRole(id: string, role: string): Observable<User> {
    return this.http.patch<User>(`${this.userUrl}${id}/role`, { role });
  }

}
