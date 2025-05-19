export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}
