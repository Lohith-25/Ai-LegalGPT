import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../types/index';

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = useCallback((content: string, type: 'user' | 'assistant', metadata?: any) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      type,
      content,
      timestamp: new Date(),
      metadata,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, addMessage, clearMessages };
};
