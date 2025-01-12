import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  constructor(private alertService: AlertService) { }

  deleteItem(ask : string, succes: string) {
    this.alertService.confirmDelete(ask)
      .then((confirmed) => {
        if (confirmed) {
          // Logique pour supprimer l'élément.
          this.alertService.showSuccess("Supprimé!", succes);
        } else {
          console.log("L'utilisateur a annulé la suppression.");
        }
      });
  }
}
