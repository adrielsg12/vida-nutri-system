
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

  // Dados do usuário logado
  const nutricionista = {
    nome: user?.user_metadata?.nome_completo || user?.email || 'Usuário',
    email: user?.email || '',
    crn: 'CRN-3 12345', // Pode vir do perfil no futuro
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
        
        <main className="px-4 lg:px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};
