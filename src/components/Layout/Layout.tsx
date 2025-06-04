
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  const nutricionista = {
    nome: user?.user_metadata?.nome_completo || user?.email || 'Usuário',
    email: user?.email || '',
    crn: 'CRN-3 12345',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          nutricionista={nutricionista}
          onSignOut={signOut}
        />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
