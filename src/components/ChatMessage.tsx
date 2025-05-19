import React from 'react';
import { Message } from '../types';
import { User, Bot, FileText, Image as ImageIcon } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formattedTime = new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  const isImage = message.fileType?.startsWith('image/');

  return (
    <div
      className={`flex ${isUser ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div
        className={`flex max-w-[80%] ${
          isUser ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        <div
          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            isUser ? 'mr-3 bg-indigo-100' : 'ml-3 bg-gray-200'
          }`}
        >
          {isUser ? (
            <User size={20} className="text-indigo-600" />
          ) : (
            <Bot size={20} className="text-gray-600" />
          )}
        </div>
        <div>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? 'bg-indigo-600 text-white rounded-tl-none'
                : 'bg-gray-100 text-gray-800 rounded-tr-none'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {message.fileUrl && (
              <div className="mt-2">
                {isImage ? (
                  <div className="mt-2">
                    <img 
                      src={message.fileUrl} 
                      alt={message.fileName || 'Attached image'} 
                      className="max-w-full rounded-lg max-h-60 object-contain"
                    />
                    <div className={`text-xs mt-1 flex items-center ${isUser ? 'text-indigo-200' : 'text-gray-600'}`}>
                      <ImageIcon size={12} className="ml-1" />
                      {message.fileName}
                    </div>
                  </div>
                ) : (
                  <a 
                    href={message.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center mt-2 ${isUser ? 'text-indigo-200 hover:text-white' : 'text-indigo-600 hover:text-indigo-800'}`}
                  >
                    <FileText size={16} className="ml-1" />
                    <span className="text-sm underline">{message.fileName || 'Attached file'}</span>
                  </a>
                )}
              </div>
            )}
          </div>
          <div
            className={`text-xs text-gray-500 mt-1 ${
              isUser ? 'text-left' : 'text-right'
            }`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
