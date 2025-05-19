import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import ChatInterface from './components/ChatInterface';
import { Bot } from 'lucide-react';

const AppContent: React.FC = () => {
  const { auth } = useAuth();

  return auth.isAuthenticated ? <ChatInterface /> : <LoginForm />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
