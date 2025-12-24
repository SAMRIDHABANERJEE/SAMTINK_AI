import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage, MessageSender } from './types';
import { startChatSession, sendMessageToGemini } from './services/geminiService';
import MessageInput from './components/MessageInput';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat session on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        await startChatSession();
        setMessages([
          {
            id: 'initial-gemini',
            sender: MessageSender.GEMINI,
            text: "Hello! I'm SAMTINK AI, your helpful assistant. How can I help you today?",
            timestamp: new Date(),
          },
        ]);
      } catch (e: any) {
        console.error("Failed to initialize chat:", e);
        setError(`Failed to start chat session: ${e.message}. Please ensure API_KEY is set correctly.`);
      } finally {
        setIsLoading(false);
      }
    };
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs only once on mount

  const handleSendMessage = useCallback(async (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: MessageSender.USER,
      text: text,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const geminiResponse = await sendMessageToGemini(text);
      const geminiMessage: ChatMessage = {
        id: Date.now().toString() + '-gemini',
        sender: MessageSender.GEMINI,
        text: geminiResponse,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, geminiMessage]);
    } catch (e: any) {
      console.error("Error sending message:", e);
      setError(`Failed to get response: ${e.message}. Please try again.`);
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: MessageSender.GEMINI, // Display error as if from Gemini for consistency
        text: `Error: ${e.message}. Please check your API key or network connection.`,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading SAMTINK AI...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl bg-gray-100 rounded-lg shadow-xl overflow-hidden md:h-[90vh] lg:h-[80vh]">
      <header className="p-4 bg-blue-600 text-white text-center font-bold text-2xl shadow-md rounded-t-lg">
        SAMTINK AI
      </header>
      {error && (
        <div className="p-3 bg-red-100 text-red-700 border-l-4 border-red-500" role="alert">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      <ChatWindow messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={isTyping} />
    </div>
  );
};

export default App;