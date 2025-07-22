export interface ChatMessage {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: string;
}
