import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule} from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor (private authService : AuthService, private router : Router ){}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        console.log('Connexion réussie :', response);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Erreur de connexion :', error);
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    );
  }
}
