import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  /**
   * Affiche une alerte de confirmation avant de supprimer.
   * @param message Message à afficher dans l'alerte.
   * @returns Une promesse qui résout à `true` si confirmé, `false` sinon.
   */
  confirmDelete(message: string = "Vous ne pouvez plus récupérer après supression!"): Promise<boolean> {
    return Swal.fire({
      title: "Êtes vous sûre?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je veux supprimer!"
    }).then((result) => {
      return result.isConfirmed; // Renvoie `true` si l'utilisateur confirme.
    });
  }

  /**
   * Affiche une alerte de succès.
   * @param title Titre de l'alerte.
   * @param message Message de succès.
   */
  showSuccess(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: "success",
      confirmButtonColor: "#3085d6"
    });
  }

  /**
   * Affiche une alerte d'erreur.
   * @param title Titre de l'alerte.
   * @param message Message d'erreur.
   */
  showError(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: "error",
      confirmButtonColor: "#d33"
    });
  }
}
