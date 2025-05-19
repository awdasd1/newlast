import { Message } from '../types';

export const sendMessageToN8N = async (message: string, file?: File): Promise<string> => {
  try {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('N8N webhook URL is not configured');
    }

    const formData = new FormData();
    formData.append('message', message);
    
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'Sorry, I couldn\'t process your request.';
  } catch (error) {
    console.error('Error sending message to n8n:', error);
    return 'Sorry, there was an error connecting to the service.';
  }
};

export const generateMessageId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const createUserMessage = (content: string, file?: { url: string, name: string, type: string }): Message => {
  return {
    id: generateMessageId(),
    content,
    sender: 'user',
    timestamp: new Date(),
    fileUrl: file?.url,
    fileName: file?.name,
    fileType: file?.type
  };
};

export const createBotMessage = (content: string): Message => {
  return {
    id: generateMessageId(),
    content,
    sender: 'bot',
    timestamp: new Date(),
  };
};
