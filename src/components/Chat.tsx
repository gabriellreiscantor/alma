import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { MessageLimitOverlay } from './MessageLimitOverlay';
import { useChat } from '../hooks/useChat';
import { useScroll } from '../hooks/useScroll';
import { useSubscription } from '../hooks/useSubscription';
import { Message } from '../types/chat';

export function Chat() {
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const [showLimitOverlay, setShowLimitOverlay] = useState(false);
  const [state, setState] = useState({
    messages: [],
    isListening: false,
    isSpeaking: false,
    voiceEnabled: true
  });

  const { handleSendMessage, toggleVoice, startListening, stopListening } = useChat(setState);
  const { messagesEndRef, scrollToBottom } = useScroll();

  useEffect(() => {
    // Verifica se atingiu o limite de mensagens
    if (subscription?.plan === 'trial' && subscription?.message_count >= 10) {
      setShowLimitOverlay(true);
    }
  }, [subscription]);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleMessageSend = async (message: string) => {
    try {
      await handleSendMessage(message);
    } catch (error: any) {
      if (error.message.includes('Limite de mensagens')) {
        setShowLimitOverlay(true);
      }
    }
  };

  return (
    <div className="chat-container">
      <Header />
      
      <div className="messages-area">
        {state.messages.map((message: Message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleMessageSend}
        voiceEnabled={state.voiceEnabled}
        onToggleVoice={toggleVoice}
        isListening={state.isListening}
        onStartListening={startListening}
        onStopListening={stopListening}
      />

      {showLimitOverlay && <MessageLimitOverlay />}
    </div>
  );
}