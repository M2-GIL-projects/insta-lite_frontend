import { Component, ViewChild } from '@angular/core';
import { User } from '../../../models/User';
import { AdminService } from '../../../services/admin.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  standalone:true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: User[] = [];
  @ViewChild('roleModal') roleModal: any; // Référence au modal
  roleForm: FormGroup;
  userId: number | null = null;
  role : string = '';

  constructor(
    private adminService: AdminService,
    private router : Router, 
    private alertService : AlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.loadAllUsers();
    this.roleForm = this.formBuilder.group({
      role: ['', Validators.required]
    });
  }

  private loadAllUsers(): void {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  onDelete(id: number){
    if(id){
      this.alertService.confirmDelete("Êtes-vous sûr de vouloir supprimer cet utlisateur ?")
      .then((confirmed) => {
      if(confirmed){
        this.adminService.deleteUser(id).subscribe(
          (response) => {
            this.alertService.showSuccess("Suppression d'un utilisateur", "L'utilisateur a été supprimé!")
            this.loadAllUsers();
          },
          (error) => {
            this.alertService.showError('Erreur','Erreur lors de la suppression du post!');
            }
        );
      }
    });
    }
  }


  onUpdate (id : number) {
    this.router.navigate(['/signup', id]);
  }

  onView (id : number) {
    this.router.navigate(['/public-profile', id]);
  }


  onCreateUser () {
    this.router.navigate(['/signup']);
  }



  openRoleModal(userId: number): void {
    this.userId = userId;
    this.modalService.open(this.roleModal, { size: 'lg' });
  }

  onChangeRole(): void {
    if (this.roleForm.valid && this.userId !== null) { 
      const newRole = this.roleForm.value.role;
      this.adminService.changeUserRole(this.userId, newRole).subscribe(response => {
        this.alertService.showSuccess("Changer le rôle!", "Rôle changé avec succès!");
        this.loadAllUsers();
        this.modalService.dismissAll();
      }, error => {
        console.error('Erreur lors du changement de rôle', error);
      });
    }
  }

}
