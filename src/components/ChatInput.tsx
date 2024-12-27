import React, { useState } from 'react';
import { Mic, Send, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export function ChatInput({
  onSendMessage,
  voiceEnabled,
  onToggleVoice,
  isListening,
  onStartListening,
  onStopListening
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 bg-white/80 backdrop-blur-lg border-t border-primary/10 shadow-lg">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-4 flex items-center gap-3"
      >
        <button
          type="button"
          onClick={onToggleVoice}
          className={cn(
            "button-icon",
            voiceEnabled ? "text-primary hover:bg-primary/10" : "text-gray-400 hover:bg-gray-100"
          )}
        >
          {voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escreva aqui como você está se sentindo hoje..."
          className="w-full p-4 text-sm rounded-2xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        
        <button
          type="button"
          onClick={isListening ? onStopListening : onStartListening}
          className={cn(
            "button-icon relative",
            isListening ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Mic className="w-6 h-6" />
          {isListening && (
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-primary text-white text-xs py-1 px-2 rounded">
              Pode falar...
            </span>
          )}
        </button>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className={cn(
            "button-icon",
            message.trim() 
              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg hover:opacity-90" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}