import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private UserUrl = 'http://localhost:8080/auth';

constructor(private http: HttpClient) { }

login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.UserUrl}/login`, { email, password });
}

logout(): Observable<any> {
  return this.http.post(`${this.UserUrl}/logout`, {});
}

isLoggedIn(): Observable<boolean> {
  return of(!!localStorage.getItem('token'));
}

 
}
