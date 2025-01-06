import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor() {}

  ngOnInit(): void {
    // Initialisation si nécessaire
  }

  onLogin(form: NgForm): void {
    if (form.valid) {
      console.log('Connexion réussie. Données envoyées :', {
        email: this.email,
        password: this.password,
      });
      alert('Connexion réussie !');
    } else {
      alert('Veuillez corriger les erreurs dans le formulaire.');
    }
  }
}
