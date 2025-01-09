import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUser();
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
        console.error('Erreur lors du chargement de l\'utilisateur', error);
      }
    );
  }
  

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.currentUser = null;
        this.isLoggedIn = false;
      },
      error => {
        console.error('Erreur lors de la déconnexion', error);
      }
    );
  }
}
