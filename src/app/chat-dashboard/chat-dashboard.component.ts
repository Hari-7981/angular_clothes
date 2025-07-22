import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChatThread } from '../interfaces/chatthread.interface';
import { ChatService } from '../Services/chat.service';
import { AuthService } from '../Services/auths.service';
import { ChatCardComponent } from '../chat-card/chat-card.component';

@Component({
  selector: 'app-chat-dashboard',
 // templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css'],
  imports: [CommonModule, RouterModule, ChatCardComponent],
  template: `
    <h2 class="title">Chats</h2>

    <app-chat-card *ngFor="let t of threads"
                   [thread]="t"
                   (open)="openChat(t.partnerId)">
    </app-chat-card>

    <p *ngIf="threads.length === 0" class="empty">No messages yet.</p>
  `,
  standalone: true
})
export class ChatsDashboardComponent implements OnInit {
 threads: ChatThread[] = [];
 private currentUserId!: string;         // ← class‑level field

  constructor(
    private chatApi: ChatService,       
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // 1️⃣ Get current logged-in user's ID from AuthService
    // Ensure auth.currentUserValue has the ID property (e.g., .id or ._id)
    if (this.auth.currentUserValue && this.auth.currentUserValue.id) {
      this.currentUserId = this.auth.currentUserValue.id;
      console.log('ChatsDashboard: Logged-in User ID (Sender):', this.currentUserId);
    } else {
      console.error('ChatsDashboard: Current user not logged in or ID not found.');
      // Handle case where user is not logged in, e.g., redirect to login
      this.router.navigate(['/login']); // Example redirect
      return;
    }
  
    /* 2️⃣ initial thread list */

    console.log('Fetching threads for user ID:', this.currentUserId);

    if (this.currentUserId) {
      this.refreshThreads();
    }

    /* 3️⃣ live update when a new message arrives */
     this.chatApi.connect(this.currentUserId, (msg: any) => {
      if (msg.receiverId === this.currentUserId) { // Use currentUserId here
        this.refreshThreads();
      }
    });
  }

  openChat(receiverId: number): void { // Renamed parameter for clarity
    console.log('Opening chat with receiver ID:', receiverId);
    console.log('Current Sender ID:', this.currentUserId); // This is the ID of the logged-in user

    // Ensure IDs are consistent (both string or both number) when passing to queryParams
    this.router.navigate(
      ['/chat-room'],
      {
        queryParams: {
          senderId: this.currentUserId,
          receiverId: receiverId, // The ID of the person you want to chat with
        }
      }
    );
  }


   
  /** helper to reload list */
  private refreshThreads(): void {
    const userIdAsNumber = Number(this.currentUserId);

    this.chatApi.getThreadsForTailor(userIdAsNumber)
                .subscribe(t => (this.threads = t));
  }
}