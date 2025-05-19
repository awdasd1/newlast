import React, { useState, useRef, useEffect } from 'react';
import { Send, LogOut, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatMessage from './ChatMessage';
import FileUploadButton from './FileUploadButton';
import { Message } from '../types';
import { sendMessageToN8N, createUserMessage, createBotMessage } from '../services/chatService';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    createBotMessage('مرحباً! كيف يمكنني مساعدتك اليوم؟'),
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { auth, logout } = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  const createFileObject = (file: File): Promise<{ url: string, name: string, type: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: e.target?.result as string,
          name: file.name,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() && !selectedFile) return;
    
    let fileObject;
    if (selectedFile) {
      fileObject = await createFileObject(selectedFile);
    }

    const userMessage = createUserMessage(
      inputMessage.trim() || (selectedFile ? `Sent a file: ${selectedFile.name}` : ''),
      fileObject
    );
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Add typing indicator
      const typingMessage = createBotMessage('...');
      setMessages((prev) => [...prev, typingMessage]);

      // Send message to n8n webhook
      const response = await sendMessageToN8N(inputMessage, selectedFile);
      
      // Remove typing indicator and add actual response
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.id !== typingMessage.id);
        return [...filtered, createBotMessage(response)];
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => {
        const filtered = prev.filter(msg => msg.content === '...');
        return [...filtered, createBotMessage('عذراً، حدث خطأ أثناء معالجة طلبك.')];
      });
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <div className="bg-indigo-600 p-2 rounded-full mr-3">
            <Bot size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">N8N Assistant</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <span className="mr-2">تسجيل الخروج</span>
          <LogOut size={18} />
        </button>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <FileUploadButton 
              onFileSelect={handleFileSelect} 
              selectedFile={selectedFile}
              onClearFile={clearSelectedFile}
            />
            
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-transparent outline-none py-2 px-3 text-right"
              disabled={isLoading}
              dir="rtl"
            />
            
            <button
              type="submit"
              disabled={isLoading || (!inputMessage.trim() && !selectedFile)}
              className={`ml-2 p-2 rounded-full ${
                isLoading || (!inputMessage.trim() && !selectedFile)
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } transition-colors`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
