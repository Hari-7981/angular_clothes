import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatThread } from '../interfaces/chatthread.interface';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chat-card" (click)="open.emit()">
      <img [src]="thread.avatar" class="avatar" />
      <div class="info">
        <h4>{{ thread.partnerName }}</h4>
        <small>{{ thread.lastMessage | slice:0:45 }}</small>
      </div>
      <span class="time">{{ thread.time | date:'shortTime' }}</span>
    </div>
  `,
  styleUrls: ['./chat-card.component.css']
})
export class ChatCardComponent {
  @Input() thread!: ChatThread;
  @Output() open = new EventEmitter<void>();
}