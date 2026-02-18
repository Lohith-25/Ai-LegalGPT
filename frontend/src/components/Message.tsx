import React from 'react';

interface MessageProps {
  content: string;
  type: 'user' | 'assistant';
  timestamp?: Date;
}

export const Message: React.FC<MessageProps> = ({ content, type, timestamp }) => {
  return (
    <div className={`message ${type}`}>
      <div className="text-sm md:text-base">{content}</div>
      {timestamp && (
        <div className="text-xs opacity-70 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};
