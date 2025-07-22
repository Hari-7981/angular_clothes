import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor (though not directly used in this template)
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router'; // For routing capabilities

import { AuthService } from '../Services/auths.service'; // To get user info and handle logout
import { User } from '../interfaces/user.interface'; // User interface

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  userName: string = 'User'; // Default name
  currentUser: User | null = null; // To hold the full user object

  constructor(
  private route: ActivatedRoute,
  private authService: AuthService,
  private router: Router
) {
  this.route.params.subscribe(params => {
    const userId = params['id'];
    
  });
}

  ngOnInit(): void {
    // Subscribe to currentUser observable to get real-time updates
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userName = user.username; // Or user.firstName if you have it
      } else {
        this.userName = 'User'; // Reset if user logs out
      }
    });

    // Optionally, if the component initializes and currentUser is already there 
    if (this.authService.currentUserValue) {
      this.userName = this.authService.currentUserValue.username;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}