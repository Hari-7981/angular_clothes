import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // For navigation buttons

@Component({
  selector: 'app-register-chooser',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './register-chooser.component.html',
  styleUrls: ['./register-chooser.component.css']
})
export class RegisterChooserComponent {
  // No complex logic needed here, just routing
}