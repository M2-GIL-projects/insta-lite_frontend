import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ProgressComponent } from "./components/progress/progress.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'InstaLite';
}
