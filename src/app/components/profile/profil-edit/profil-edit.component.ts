import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/User';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil-edit.component.html',
  styleUrls: ['./profil-edit.component.css'],
})
export class ProfilEditComponent implements OnInit {
  userId?: number | null = null;
  userForm: FormGroup;
  isChangePassword: boolean = false;
  currentProfileImageUrl: string | undefined;
  selectedImageUrl: string | null = null;
  remainingChars: number = 255;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private router : Router
  ) {
    this.userForm = this.fb.group({
      pseudo: ['', [Validators.required, Validators.maxLength(7), Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(255)]],
      phone: ['', [Validators.maxLength(15)]],
      photo: [''],
      password: [''],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { mismatch: true };
  }


  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const userIdString = params.get('userId');
      if (userIdString) {
        const userId = Number(userIdString);
        this.loadUserData(userId);
      }
    });
  
    this.userForm.get('content')?.valueChanges.subscribe(() => {
      this.updateCharCount();
    });
  }
  

  loadUserData(userId: number) {
    this.userService.getUserById(+userId).subscribe(
      (user: User) => {
        this.userForm.patchValue({
          pseudo: user.pseudo,
          email: user.email,
          bio: user.bio,
          phone: user.phone,
          photo: user.photo
        });
        this.currentProfileImageUrl = user.photo || undefined;
      },
      (error) => {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      }
    );
  }

  updateCharCount() {
    const contentLength = this.userForm.get('content')?.value.length || 0;
    this.remainingChars = Math.max(0, 255 - contentLength);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  getImageUrl(relativeUrl: string | undefined): string {
    if(relativeUrl == undefined){
      return 'assets/defaut.jpg';
    }
    return `http://localhost:8080/${relativeUrl}`;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUser: User = {
        ...this.userForm.value,
        id: this.userId
      };
      if (!this.isChangePassword) {
        delete updatedUser.password;
      }
      this.userService.updateUser(this.userId! , updatedUser).subscribe(
        (response) => {
          console.log('Profil mis à jour avec succès', response);
          this.router.navigate(['/profile']);
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du profil', error);
        }
      );
    }
  }

  onCancel(){
    this.router.navigate(['/profile']); 
  this.userForm.reset();
  }

  togglePasswordChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.userForm.get('password')!.setValidators([Validators.required, Validators.minLength(8)]);
      this.userForm.get('confirmPassword')!.setValidators([Validators.required]);
    } else {
      this.userForm.get('password')!.clearValidators();
      this.userForm.get('confirmPassword')!.clearValidators();
    }
    this.userForm.get('password')!.updateValueAndValidity();
    this.userForm.get('confirmPassword')!.updateValueAndValidity();
  }
}
