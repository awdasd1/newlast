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

    console.log('Sending request to:', webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('N8N response not OK:', response.status, response.statusText);
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('N8N response data:', data);
    
    // Check different possible response formats
    if (data.response) {
      return data.response;
    } else if (data.message) {
      return data.message;
    } else if (data.result) {
      return data.result;
    } else if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object') {
      // If it's an object but doesn't have expected fields, stringify it
      return JSON.stringify(data);
    }
    
    return 'Sorry, I couldn\'t process your request.';
  } catch (error) {
    console.error('Error sending message to n8n:', error);
    return 'عذراً، حدث خطأ أثناء الاتصال بالخدمة. يرجى المحاولة مرة أخرى.';
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
