import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log('AuthInterceptor: Token found:', !!token);
    
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('AuthInterceptor: Request cloned with token');
      return next.handle(cloned).pipe(
        tap(
          event => console.log('AuthInterceptor: Request successful'),
          error => console.error('AuthInterceptor: Request failed', error)
        )
      );
    }
    console.log('AuthInterceptor: No token, proceeding with original request');
    return next.handle(req);
  }
}