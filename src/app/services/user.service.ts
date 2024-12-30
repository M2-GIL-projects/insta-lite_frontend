import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private users = [
    { id: 1,bio:'à definir', name: 'Admin User', email: 'admin@example.com', role: 'admin', avatarUrl: 'https://example.com/admin-avatar.jpg', joinDate:'20/05/2024' },
    { id: 2,bio:'à definir', name: 'Regular User', email: 'user@example.com', role: 'user', avatarUrl: 'https://example.com/user-avatar.jpg', joinDate:'20/12/2024' }
  ];

  getUsers(): Observable<any[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<any> {
    return of(this.users.find(user => user.id === id));
  }
}
