export enum MessageSender {
  USER = 'user',
  GEMINI = 'gemini',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
}
