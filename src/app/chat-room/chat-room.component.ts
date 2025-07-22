import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../Services/chat.service';
import { AuthService } from '../Services/auths.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat-room',
  standalone: true,
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
 imports: [CommonModule, FormsModule], // Add any necessary Angular modules here, e.g., FormsModule for ngModel
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  tailorId!: string;
  message  = '';
  messages: any[] = [];

  /* strictly typed as numbers */
  currentUserId!: number;          // 0 is fine as default
  receiverId!:   number;           // non‑null after route params

  /* keep originals if you still want the raw strings */
  senderId:   string | null = null;
  receiverIdRaw: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.senderId = params.get('senderId');
      this.receiverIdRaw   = params.get('receiverId');
      console.log('ChatRoom Loaded:', this.senderId, this.receiverIdRaw);
 
 
      this.currentUserId   = +this.authService.currentUserValue!.id;
      this.receiverId      = +(this.receiverIdRaw ?? 0);


     this.chatService
          .getChatHistory(this.currentUserId, this.receiverId!)
          .subscribe(history => {
            this.messages = history;           // display old msgs
            this.scrollToBottom();
          });

   // Connect to WebSocket after sender/receiver ID is set
    this.chatService.connect(this.receiverId, (message) => {
      this.messages.push(message);
    });
    });
  }

  sendMessage() {
    if (this.message.trim()) {
      const msg = {
        senderId: this.currentUserId,
        receiverId: this.receiverId,
        content: this.message,
        timestamp: new Date().toISOString()
      };
      this.chatService.sendMessage(msg);
     this.messages.push(msg); // Show immediately
      this.message = '';
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const box = document.querySelector<HTMLElement>('.chat-messages');
      if (box) box.scrollTop = box.scrollHeight;
    }, 50);
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
