import React from 'react';
import { Message } from '../types/chat';
import { cn } from '../lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isBot ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "message-bubble",
        isBot ? "message-bubble-bot" : "message-bubble-user"
      )}>
        <p className="text-[15px] text-gray-800">{message.content}</p>
        <span className="text-[11px] text-gray-500 mt-1 block text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}