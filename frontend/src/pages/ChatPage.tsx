import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from '../components/Sidebar';
import { Message } from '../components/Message';
import { ResponseDisplay } from '../components/ResponseDisplay';
import { QueryForm } from '../components/QueryForm';
import { Disclaimer } from '../components/Disclaimer';
import { legalAPI } from '../services/api';
import { LegalResponse, ChatMessage } from '../types/index';

export const ChatPage: React.FC = () => {
  const [userId] = useState(() => localStorage.getItem('userId') || uuidv4());
  const [selectedCase, setSelectedCase] = useState<string>('FIR');
  const [language, setLanguage] = useState<string>('en');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('userId', userId);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCaseSelect = (caseType: string) => {
    setSelectedCase(caseType);
    setMessages([]);
    setError(undefined);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleNewChat = () => {
    setMessages([]);
    setError(undefined);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all chat history?')) {
      setMessages([]);
      setError(undefined);
    }
  };

  const handleSubmitQuery = async (data: { location: string; description: string; file?: File }) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        type: 'user',
        content: data.file 
          ? `Document: ${data.file.name}\nYour Location: ${data.location}${data.description ? `\nAdditional Details: ${data.description}` : ''}`
          : `Issue Location: ${data.location}\n\nDescription: ${data.description}`,
        timestamp: new Date(),
        metadata: { caseType: selectedCase, location: data.location },
      };
      setMessages(prev => [...prev, userMessage]);

      // Get response from API
      const response = await legalAPI.submitQuery({
        userId,
        caseType: selectedCase as any,
        location: data.location,
        description: data.description,
        language,
      }, data.file);

      // Add assistant message with response
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        type: 'assistant',
        content: 'Legal guidance provided below',
        timestamp: new Date(),
        metadata: {
          ...response,
          caseType: selectedCase,
          location: data.location,
        },
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to get legal guidance';
      setError(errorMsg);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${errorMsg}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <Sidebar
        selectedCase={selectedCase}
        onCaseSelect={handleCaseSelect}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <div className="main-content">
        <div className="chat-messages">
          {messages.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">⚖️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">AI LegalGPT</h2>
              <p className="text-gray-600 mb-4 max-w-md">
                Welcome to your AI Legal Assistant. Select a case type from the sidebar and describe your legal issue to get step-by-step guidance.
              </p>
              <Disclaimer />
            </div>
          )}

          {messages.map(msg => {
            if (msg.type === 'user') {
              return <Message key={msg.id} content={msg.content} type="user" timestamp={msg.timestamp} />;
            } else {
              const response = msg.metadata as LegalResponse | undefined;
              if (response && response.steps) {
                return (
                  <div key={msg.id} className="max-w-[90%]">
                    <ResponseDisplay response={response} />
                  </div>
                );
              } else {
                return <Message key={msg.id} content={msg.content} type="assistant" timestamp={msg.timestamp} />;
              }
            }
          })}

          {isLoading && (
            <div className="message assistant flex gap-2">
              <span className="loading"></span>
              <span className="loading" style={{ animationDelay: '0.2s' }}></span>
              <span className="loading" style={{ animationDelay: '0.4s' }}></span>
            </div>
          )}

          {error && (
            <div className="error-message max-w-[90%]">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <QueryForm
          onSubmit={handleSubmitQuery}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
