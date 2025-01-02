import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../../models/User';
import { ProfilModalComponent } from '../profil-modal/profil-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profil-info',
  imports: [RouterLink],
  templateUrl: './profil-info.component.html',
  styleUrl: './profil-info.component.css'
})
export class ProfilInfoComponent implements OnInit{
   constructor (private userService : UserService, private modalService: NgbModal ){}
     user? : User; 
     route = inject(Router);
    
     ngOnInit() {
      this.userService.getUserById(2).subscribe(
        (userData) => {
          if (userData.joinDate) {
            const [day, month, year] = userData.joinDate.split('/').map(Number);
            userData.joinDate = new Date(year, month - 1, day); 
          }
          this.user = userData;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }

    openModal(type: string, item: any) {
      const modalRef = this.modalService.open(ProfilModalComponent, { size: 'lg' });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.item = item;
    }
}
