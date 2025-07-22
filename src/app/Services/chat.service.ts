// chat.service.ts
import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import SockJS from 'sockjs-client'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatMessage } from '../interfaces/chatmessage.interface';
import { ChatThread } from '../interfaces/chatthread.interface';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient: Client;
  private isConnected = false;
  private apiUrl = 'http://localhost:8080/api/auth';



  constructor(private http: HttpClient) {
    this.stompClient = new Client({
      brokerURL: '', // Let SockJS handle this
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
    });
  }

  connect(currentUserId: string | number, onMessage: (msg: any) => void) {
    if (this.isConnected) { return; }        // already active

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-chat'),
      reconnectDelay   : 5000,              // auto‑retry
      debug            : str => console.log('[STOMP]', str)
    });



    this.stompClient.onConnect = () => {
      console.log('STOMP connected');
      this.isConnected = true;


      this.stompClient.subscribe('/user/queue/messages', (message: IMessage) => {
            console.log(`STOMP: Private message received for user ${currentUserId}:`, JSON.parse(message.body));
            onMessage(JSON.parse(message.body));
        });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    this.stompClient.activate();
  }

  sendMessage(message: any) {
    if (!this.isConnected) {
      console.error('Cannot send message: STOMP is not connected yet.');
      return;
    }

    this.stompClient.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(message),
    });
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      this.isConnected = false;
    }
  }


    getChatHistory(senderId: number, recipientId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history`, {
      params: { senderId, recipientId }
    });
  }


  getThreadsForTailor(tailorId: number) {
    return this.http.get<ChatThread[]>(`${this.apiUrl}/threads/${tailorId}`);
  }

  /** full history between tailor and user */
  getHistory(tailorId: string, userId: number) {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/history`, {
      params: { senderId: tailorId, recipientId: userId }
    });
  }


}
