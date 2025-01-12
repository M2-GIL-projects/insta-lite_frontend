import { Component } from '@angular/core';
import { User } from '../../../models/User';
import { AdminService } from '../../../services/admin.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone:true,
  imports: [CommonModule, DatePipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  users: User[] = [];
  
  constructor(
    private adminService: AdminService,
    private router : Router
  ) {
    this.loadAllUsers();
  }

  private loadAllUsers(): void {
    this.adminService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  onDelete(id: number){
    if(id){
      const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cet utlisateur ?');
      if(confirmDelete){
        this.adminService.deleteUser(id).subscribe(
          (response) => {
            console.log('Réponse de suppression:', response);
            alert('Post supprimé avec succès');
            this.loadAllUsers();
          },
          (error) => {
              alert('Erreur lors de la suppression du post');
              console.log('erreur:', error);
            }
        );
      }
    }
  }

  onUpdate (id : number) {
    this.router.navigate(['/signup', id]);
  }

  onView (id : number) {
    this.router.navigate(['/profile', id]);
  }


  onCreateUser () {
    this.router.navigate(['/signup']);
  }




}
