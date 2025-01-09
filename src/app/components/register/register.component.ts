import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  userForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      pseudo: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = {
        email: this.userForm.get('email')?.value,
        password: this.userForm.get('password')?.value,
        pseudo: this.userForm.get('pseudo')?.value
      };
      this.userService.createUser(userData).subscribe(
        response => {
          alert('Utilisateur créé avec succès');
          console.log('Utilisateur créé avec succès', response);
          this.router.navigate(['/login']);
        },
        error => {
          alert('Erreur lors de la création de l\'utilisateur')
          console.error('Erreur lors de la création de l\'utilisateur', error);
          // Gérer l'erreur (afficher un message, etc.)
        }
      );
    }
  }
}
