import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit(): void {
    this.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        this.loadUser();
      } else {
        this.currentUser = null;
      }
    });
  }

  loadUser() {
    this.userService.getMe().subscribe(
      user => {
        this.currentUser = user;
      },
      error => {
        console.log('Erreur lors du chargement de l\'utilisateur', error);
        this.handleAuthError();
      }
    );
  }
  
  getImageUrl(relativeUrl: string | undefined): string {
    if(relativeUrl == undefined){
      return 'assets/defaut.jpg';
    }
    return `http://localhost:8080/${relativeUrl}`;
  }

  

  private handleAuthError() {
    this.authService.logout().subscribe(() => {
      this.currentUser = null;
      localStorage.removeItem('token');
      // Optionnel : rediriger vers la page de connexion
      // this.router.navigate(['/login']);
    });
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Déconnexion réussie:', response);
        this.currentUser = null;
        localStorage.removeItem('token');
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Erreur lors de la déconnexion', error);
      }
    );
  }
}
