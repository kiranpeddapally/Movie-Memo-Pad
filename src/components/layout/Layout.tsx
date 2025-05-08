import React from 'react';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../auth/AuthForm';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Movie Memo Pad. All rights reserved.</p>
          <p className="mt-1">Track your movie journey with ease.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;