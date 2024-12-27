import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ChatState, Message } from '../types/chat';
import { useSpeech } from './useSpeech';

export function useChat(setState: Dispatch<SetStateAction<ChatState>>) {
  const navigate = useNavigate();
  const { speak, stop, isSupported } = useSpeech();
  
  const handleSendMessage = useCallback(async (content: string) => {
    try {
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date()
      };

      // Tenta inserir a mensagem (isso vai disparar o trigger que verifica o limite)
      const { error } = await supabase
        .from('messages')
        .insert({
          content,
          type: 'user'
        });

      if (error) {
        if (error.message.includes('Limite de mensagens')) {
          navigate('/dashboard');
          throw new Error('Você atingiu o limite de mensagens gratuitas. Faça upgrade do seu plano para continuar conversando!');
        }
        throw error;
      }

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage]
      }));

      // Simula resposta do bot após 1 segundo
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Obrigada por compartilhar comigo. Como você está se sentindo agora?',
          sender: 'bot',
          timestamp: new Date()
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, botResponse]
        }));

        if (isSupported) {
          speak(botResponse.content);
        }
      }, 1000);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }, [navigate, setState, speak, isSupported]);

  const toggleVoice = useCallback(() => {
    setState(prev => {
      const newVoiceEnabled = !prev.voiceEnabled;
      if (!newVoiceEnabled) {
        stop();
      }
      return {
        ...prev,
        voiceEnabled: newVoiceEnabled
      };
    });
  }, [stop]);

  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setState(prev => ({ ...prev, isListening: true }));
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
          
        window.dispatchEvent(new CustomEvent('speech-text', { 
          detail: { text: transcript }
        }));
      };
      
      recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        setState(prev => ({ ...prev, isListening: false }));
      };
      
      recognition.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };
      
      recognition.start();
      (window as any).recognition = recognition;
    } else {
      alert('Desculpe, seu navegador não suporta reconhecimento de voz.');
    }
  }, []);

  const stopListening = useCallback(() => {
    if ((window as any).recognition) {
      (window as any).recognition.stop();
    }
    setState(prev => ({ ...prev, isListening: false }));
  }, []);

  return {
    handleSendMessage,
    toggleVoice,
    startListening,
    stopListening
  };
}