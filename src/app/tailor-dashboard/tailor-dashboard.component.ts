// src/app/tailor-dashboard/tailor-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router'; // Ensure all routing modules are here

import { AuthService } from '../Services/auths.service'; // Assuming AuthService provides user info
import { User } from '../interfaces/user.interface'; // Your User interface
import { TailorService } from '../Services/tailor.service';
import { Tailor } from '../interfaces/tailors.interface'; // Import Tailor interface

@Component({
  selector: 'app-tailor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './tailor-dashboard.component.html',
  styleUrls: ['./tailor-dashboard.component.css']
})
export class TailorDashboardComponent implements OnInit {
  tailorName: string = 'Tailor';
  currentUser: User | null = null;
  currentTailorProfile: Tailor | null = null;
  editMode: boolean = false;
  editedProfile: Partial<Tailor> = {};
  
 // tailorId: string | null = null; // To hold the tailor ID from the route

  constructor(private authService: AuthService, private tailorService: TailorService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {


  const tailorId = this.route.snapshot.paramMap.get('id');

   console.log('Tailor ID from route:', tailorId);

  if (tailorId) {
    this.tailorService.getTailorProfile(tailorId).subscribe(profile => {
      this.currentTailorProfile = profile;
      this.editedProfile = { ...profile };
      console.log('Fetched Tailor Profile ID:', profile.id);
    });
  }
     
    
    // this.route.paramMap.subscribe(params => {
    //   this.tailorId = params.get('id');
    //   console.log('Tailor ID from route:', this.tailorId);
    // });
  
  //   this.tailorService.tailorProfile$.subscribe(profile => {
  //     this.currentTailorProfile = profile;
  //  //   console.log('Current Tailor Profile id:', this.currentTailorProfile?.id);

  //     this.editedProfile = { ...profile };
  //   });
  
   


    // Subscribe to currentUser observable to get real-time updates
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        // Use shopName if available, otherwise username, or fallback
        this.tailorName =   user.username || 'Tailor';
      } else {
        this.tailorName = 'Tailor'; // Reset if not a tailor or logged out
      }
    });

    // Also get the immediate value if available (for initial load)
    if (this.authService.currentUserValue && this.authService.currentUserValue.role === 'tailor') {
        this.authService.currentUserValue.username || 'Tailor';
    }
  }

get tailorId(): string | null {
  return this.currentTailorProfile?.id || null;
}


goToProfile() {
  if (this.tailorId) {
    this.router.navigate(['/tailor-profile', this.tailorId]);
  }
}

   

  enableEdit() {
    this.editMode = true;
    this.editedProfile = { ...this.currentTailorProfile };
  }

  

  cancelEdit() {
    this.editMode = false;
    this.editedProfile = { ...this.currentTailorProfile };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page after logout
  }
}