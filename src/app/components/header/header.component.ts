import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
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
        this.isLoggedIn = false;
        this.currentUser = null;
      }
    );
  }

  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Déconnexion réussie:', response);
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('token'); // Assurez-vous de supprimer le token
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Erreur lors de la déconnexion', error);
      }
    );
  }
  


}
