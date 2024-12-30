import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = ''; 
  password: string = ''; 
  errorMessage: string = '';
  constructor (private authService : AuthService ){}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Connexion réussie :', response);
        // Redirigez l'utilisateur ou gérez l'état connecté
      },
      (error) => {
        console.error('Erreur de connexion :', error);
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    );
  }
}
