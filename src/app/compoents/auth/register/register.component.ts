import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importation des modules nécessaires
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';

  constructor() {}

  ngOnInit(): void {
    this.resetForm();
    console.log('Valeur initiale de fullName:', this.fullName); // Doit afficher une chaîne vide
  }

  onRegister(): void {
    if (this.fullName && this.email && this.password) {
      console.log('Formulaire soumis avec :', {
        fullName: this.fullName,
        email: this.email,
        password: this.password
      });
      alert('Inscription réussie !');
      this.resetForm(); // Nettoie les champs après la soumission
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

  resetForm(): void {
    this.fullName = '';
    this.email = '';
    this.password = '';
  }
}
