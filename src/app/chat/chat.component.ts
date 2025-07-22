// chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../Services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  messageContent = '';
  senderId = 'user1';
  receiverId = 'tailor1';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.connect((msg) => {
      this.messages.push(msg);
    });
  }

  send() {
    this.chatService.sendMessage({
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: this.messageContent
    });
    this.messageContent = '';
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
}
