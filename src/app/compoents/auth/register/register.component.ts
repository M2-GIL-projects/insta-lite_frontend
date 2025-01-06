import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  errors: { fullName: string; email: string; password: string } = {
    fullName: '',
    email: '',
    password: ''
  };

  constructor() {
  }

  ngOnInit(): void {
    this.resetForm();
  }


  validateField(field: string): void {
    if (field === 'fullName') {
      if (!this.fullName.trim()) {
        this.errors.fullName = 'Le nom complet est obligatoire.';
      } else if (this.fullName.length < 3) {
        this.errors.fullName = 'Le nom complet doit contenir au moins 3 caractères.';
      } else {
        this.errors.fullName = '';
      }
    }

    if (field === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email.trim()) {
        this.errors.email = "L'adresse email est obligatoire.";
      } else if (!emailPattern.test(this.email)) {
        this.errors.email = "Veuillez entrer une adresse email valide.";
      } else {
        this.errors.email = '';
      }
    }

    if (field === 'password') {
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!this.password.trim()) {
        this.errors.password = 'Le mot de passe est obligatoire.';
      } else if (this.password.length < 8) {
        this.errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
      } else if (!passwordPattern.test(this.password)) {
        this.errors.password =
          'Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.';
      } else {
        this.errors.password = '';
      }
    }
  }

  isFormValid(): boolean {
    return (
      !this.errors.fullName && // Vérifie que le champ "fullName" n'a pas d'erreur
      !this.errors.email && // Vérifie que le champ "email" n'a pas d'erreur
      !this.errors.password && // Vérifie que le champ "password" n'a pas d'erreur
      this.fullName.trim() !== '' && // Vérifie que le champ "fullName" est rempli
      this.email.trim() !== '' && // Vérifie que le champ "email" est rempli
      this.password.trim() !== '' // Vérifie que le champ "password" est rempli
    );
  }





  onRegister(): void {
    if (this.isFormValid()) {
      console.log('Formulaire soumis avec succès :', {
        fullName: this.fullName,
        email: this.email,
        password: this.password
      });
      alert('Inscription réussie !');
      this.resetForm();
    } else {
      alert('Veuillez corriger les erreurs.');
    }
  }

  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.errors = { fullName: '', email: '', password: '' };
  }
}
