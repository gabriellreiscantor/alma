import { useRef } from 'react';

export function useScroll() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    messagesEndRef,
    scrollToBottom
  };
}