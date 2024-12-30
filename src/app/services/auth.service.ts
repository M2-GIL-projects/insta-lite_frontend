import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//ceci est un mock pour tester le frontend
constructor() { }

  private users = [
    { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { id: 2, email: 'user@example.com', password: 'user123', role: 'user' }
  ];

  login(email: string, password: string): Observable<any> {
    const user = this.users.find(u => u.email === email && u.password === password);
    return of(user ? { success: true, user } : { success: false, message: 'Invalid credentials' });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
}
