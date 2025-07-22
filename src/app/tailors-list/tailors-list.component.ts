import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor, *ngIf
import { Router, RouterLink, ActivatedRoute  } from '@angular/router'; // To navigate to individual tailor details

import { TailorService } from '../Services/tailor.service';
//import { TwilioService } from '../Services/twilio.service';
import { AuthService } from '../Services/auths.service';
import { Tailor } from '../interfaces/tailors.interface';


@Component({
  selector: 'app-tailors-list',
  standalone: true,
  imports: [
    CommonModule,   // Provides NgFor, NgIf
    RouterLink,
      // Used if you add a "View Details" link for each tailor
  ],
  templateUrl: './tailors-list.component.html',
  styleUrls: ['./tailors-list.component.css']
})
export class TailorsListComponent implements OnInit {
  tailors: Tailor[] = [];
  loading: boolean = false;
  error: string | null = null;
  currentUser: any = null; // Add currentUser property
  chatWithTailor: Tailor | null = null;
  


  constructor(
    private tailorService: TailorService,
  //  private twilioService: TwilioService,
    private authService: AuthService, // Inject AuthService
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue; // Initialize currentUser
    console.log('Current User:', this.currentUser); // Debugging line to check current user
    this.loadTailors();
  }

  loadTailors(): void {
    this.loading = true;
    this.error = null; // Clear previous errors

    this.tailorService.getAllTailors("TAILOR").subscribe({
      next: (data: any) => {
        this.tailors = data
         .filter((t: Tailor) => t.id !== this.currentUser?.id); // ← new line
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load tailors:', err);
        this.error = 'Failed to load tailors. Please try again later.';
        this.loading = false;
      }
    });
  }

  // Helper function to generate star ratings (optional, for display)
  getStarRating(rating: number): string {
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating));
    return fullStars + emptyStars;
  }

  // async callTailor(tailor: Tailor, currentUserId: string) {
  //   // Initialize Twilio device for the current user (identity)
  //   await this.twilioService.init(currentUserId);
  //   // Call the tailor using their identity (or tailor.id if that's your identity system)
  //   this.twilioService.call( tailor.id);
  // }

//   openChat(tailor: Tailor) {
//   this.chatWithTailor = tailor;
// }

goToChat(tailor: Tailor): void {
  console.log('goToChat function entered!'); // Add this
  if (!this.currentUser || !this.currentUser.id) {
    console.error('User not logged in');
    return;
  }

  console.log(this.currentUser.id, 'is the current user ID');
  const senderId   = this.currentUser.id; // user
  const receiverId = tailor.id;           // tailor

  console.log('Navigating to chat-room with:', { senderId, receiverId });

  this.router.navigate(['/chat-room'], {
    queryParams: { senderId, receiverId }
  });
}

}

