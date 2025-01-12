import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/User';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  existingUsers: any[] = [];
  isEditMode: boolean = false; 
  userId : number | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route :ActivatedRoute,
    private alertService : AlertService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('userId');
      if (id) {
        this.userId = +id; 
        this.isEditMode = true;
        this.loadUserData(this.userId);
      }
    });
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


  loadUserData(userId: number) {
    this.userService.getUserById(userId).subscribe((user: User) => {
      this.userForm.patchValue({
        pseudo: user.pseudo,
        email: user.email,
        password: user.password
      });
    }, error => {
      console.error("Erreur lors du chargement des données de l'utilisateur", error);
    });
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

      if(this.isEditMode && this.userId){
        this.userService.updateUser(this.userId as number ,userData).subscribe(
          (response) => {
            this.alertService.showSuccess("Mise à jour d'utilisateur!", "Utilisateur mis à jour avec succès");
            this.router.navigate(['/home']);
          },
          (error) => {
            this.alertService.showError("Erreur!", "Erreur lors de la mise à jour de l'utilisateur");
          }
        );
      }else{
        this.userService.createUser(userData).subscribe(
        (response) => {
          this.alertService.showSuccess("Création d'utilisateur!", "Utilisateur créé avec succès");
          this.router.navigate(['/login']);
        },
        (error) => {
          this.alertService.showError("Erreur!", "Erreur lors de la création de l'utilisateur");
        }
      );
      }
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
