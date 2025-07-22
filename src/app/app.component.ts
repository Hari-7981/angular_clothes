import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { navComponent } from './nav/nav.component';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, // <--- MAKE IT STANDALONE
  imports: [
    CommonModule,   // Add CommonModule
    RouterOutlet    // Add RouterOutlet for <router-outlet>
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular_clothes';
}
