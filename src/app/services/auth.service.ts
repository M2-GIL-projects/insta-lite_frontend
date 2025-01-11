import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private UserUrl = 'http://localhost:8080/auth';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userRoleSubject = new BehaviorSubject<string | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkInitialLoginState();
  }

  private checkInitialLoginState() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    this.isLoggedInSubject.next(!!token);
    this.userRoleSubject.next(role);
  }

  login(email: string, password: string): Observable<any> {
    const emailRec = email;
    if(emailRec =="admin@instalite.fr"){
      localStorage.setItem('userRole', "ADMIN");
      this.userRoleSubject.next("ADMIN");
    }
    return this.http.post(`${this.UserUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          //localStorage.setItem('userRole', response.role);
          this.isLoggedInSubject.next(true);
          //this.userRoleSubject.next(response.role);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.UserUrl}/logout`, {}, { responseType: 'text' }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        this.isLoggedInSubject.next(false);
        this.userRoleSubject.next(null);
      })
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  getUserRole(): Observable<string | null> {
    return this.userRole$;
  }

  isAdmin(): boolean {
    return this.userRoleSubject.value === 'ADMIN';
  }

  hasPrivileges(): boolean {
    const role = this.userRoleSubject.value;
    return role === 'ADMIN' || role === 'PRIVILEGED_USER';
  }

}
