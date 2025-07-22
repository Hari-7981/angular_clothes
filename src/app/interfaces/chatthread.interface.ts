export interface ChatThread {
  partnerId: number;       // userId
  partnerName: string;
  avatar: string;
  lastMessage: string;
  time: string;            // ISO timestamp of last msg
  unread?: number;
}
