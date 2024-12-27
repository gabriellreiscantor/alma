export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  voiceEnabled: boolean;
}

export interface SpeechOptions {
  lang?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}