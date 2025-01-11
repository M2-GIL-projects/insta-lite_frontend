import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  existingUsers: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group(
      {
        pseudo: [
          '',
          [
            Validators.required,
            Validators.maxLength(7),
            Validators.minLength(3),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );

    this.loadExistingUsers();
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password &&
      confirmPassword &&
      password.value === confirmPassword.value
      ? null
      : { mismatch: true };
  }

  loadExistingUsers() {
    this.userService.getPublicUsers().subscribe((users) => {
      const userPublic = users.map((publicuser) => publicuser.user);
      this.existingUsers = userPublic;
    });
  }

  checkDuplicateUser(): boolean {
    const email = this.userForm.get('email')?.value;
    const pseudo = this.userForm.get('pseudo')?.value;

    const isEmailTaken = this.existingUsers.some(
      (user) => user.email === email
    );
    const isPseudoTaken = this.existingUsers.some(
      (user) => user.pseudo === pseudo
    );

    if (isEmailTaken) {
      alert("L'adresse email est déjà utilisée.");
      return false;
    }

    if (isPseudoTaken) {
      alert('Le pseudo est déjà pris.');
      return false;
    }

    return true;
  }

  onSubmit() {
    if (this.userForm.valid && this.checkDuplicateUser()) {
      const userData = {
        email: this.userForm.get('email')?.value,
        password: this.userForm.get('password')?.value,
        pseudo: this.userForm.get('pseudo')?.value,
      };
      this.userService.createUser(userData).subscribe(
        (response) => {
          alert('Utilisateur créé avec succès');
          console.log('Utilisateur créé avec succès', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          alert("Erreur lors de la création de l'utilisateur");
          console.error("Erreur lors de la création de l'utilisateur", error);
        }
      );
    }
  }
}
