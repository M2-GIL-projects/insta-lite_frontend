import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgressService } from '../../services/progress.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress',
  imports: [CommonModule, AsyncPipe],
  standalone:true,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent {

  showProgress$!: Observable<boolean>;

  constructor(private progressService: ProgressService) {
   this.showProgress$ = this.progressService.progress$;
  }
}
