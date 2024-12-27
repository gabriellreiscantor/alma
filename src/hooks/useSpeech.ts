import { useCallback, useRef, useEffect } from 'react';

export function useSpeech() {
  const synth = useRef(window.speechSynthesis);
  const voices = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      voices.current = synth.current.getVoices();
    };

    loadVoices();
    synth.current.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      synth.current.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const getPortugueseVoice = useCallback(() => {
    return voices.current.find(voice => 
      voice.lang.includes('pt-BR') || 
      voice.lang.includes('pt-PT')
    ) || voices.current[0];
  }, []);

  const speak = useCallback((text: string) => {
    if (!synth.current) return;

    // Cancela qualquer fala em andamento
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = getPortugueseVoice();
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    synth.current.speak(utterance);
  }, [getPortugueseVoice]);

  const stop = useCallback(() => {
    if (synth.current) {
      synth.current.cancel();
    }
  }, []);

  return {
    speak,
    stop,
    isSupported: 'speechSynthesis' in window
  };
}