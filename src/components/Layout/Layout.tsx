
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

// Mock data - em produção viria do contexto de autenticação
const mockNutricionista = {
  nome: 'Dr. Ana Silva',
  email: 'ana.silva@email.com',
  crn: 'CRN-3 12345',
};

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          nutricionista={mockNutricionista}
        />
        
        <main className="px-4 lg:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};
