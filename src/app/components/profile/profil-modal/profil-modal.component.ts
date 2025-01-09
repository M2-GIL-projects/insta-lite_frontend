import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil-modal.component.html',
  styleUrl: './profil-modal.component.css'
})
export class ProfilModalComponent {
  @Input() type: string = '';
  @Input() item: any;
  constructor(public activeModal: NgbActiveModal) {}
}
