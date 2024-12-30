import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  constructor (private userService : UserService ){}
 user? : User; 

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

}
