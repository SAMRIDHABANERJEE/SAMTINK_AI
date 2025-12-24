import React, { useRef, useEffect } from 'react';
import { ChatMessage, MessageSender } from '../types';
import ChatBubble from './ChatBubble';

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]); // Scroll when messages or typing status changes

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3 bg-white shadow-inner rounded-lg">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      {isTyping && (
        <div className="self-start bg-gray-200 text-gray-700 p-3 rounded-lg rounded-bl-none shadow-md max-w-[80%] my-1 animate-pulse">
          <p className="text-sm">Gemini is typing...</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
