import React from 'react';
import { MessageSender, ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;
  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white self-end rounded-br-none'
    : 'bg-gray-300 text-gray-800 self-start rounded-bl-none';

  // Conditional class for timestamp alignment
  const timestampAlignmentClass = isUser ? 'text-right' : 'text-left';

  // Custom components for ReactMarkdown to apply Tailwind CSS styles
  const markdownComponents = {
    p: ({ node, ...props }: any) => <p className="mb-2 last:mb-0 text-sm" {...props} />,
    h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mb-3 mt-4" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-base font-bold mb-1 mt-2" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc list-inside mb-2 ml-4" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal list-inside mb-2 ml-4" {...props} />,
    li: ({ node, ...props }: any) => <li className="mb-1" {...props} />,
    strong: ({ node, ...props }: any) => <strong className="font-semibold" {...props} />,
    em: ({ node, ...props }: any) => <em className="italic" {...props} />,
    a: ({ node, ...props }: any) => <a className="text-blue-700 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" {...props} />,
    code: ({ node, inline, ...props }: any) => (
      <code className={`${inline ? 'bg-gray-200 px-1 py-0.5 rounded text-red-700 text-xs' : 'block bg-gray-700 text-white p-2 rounded-md overflow-x-auto text-sm my-2'}`} {...props} />
    ),
    pre: ({ node, ...props }: any) => <pre className="my-2" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-gray-400 pl-4 py-1 italic my-2" {...props} />,
  };


  return (
    <div className={`flex flex-col max-w-[80%] my-1 p-3 rounded-lg shadow-md ${bubbleClasses}`}>
      <div className={`break-words text-left ${isUser ? 'text-white' : 'text-gray-800'}`}>
        <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
      </div>
      <span className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-600'} ${timestampAlignmentClass}`}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default ChatBubble;