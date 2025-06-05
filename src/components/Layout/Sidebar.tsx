
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  MessageCircle, 
  Settings,
  BarChart3,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    href: '/',
  },
  {
    title: 'Pacientes',
    icon: Users,
    href: '/pacientes',
  },
  {
    title: 'Consultas',
    icon: Calendar,
    href: '/consultas',
  },
  {
    title: 'Financeiro',
    icon: DollarSign,
    href: '/financeiro',
  },
  {
    title: 'Comunicação',
    icon: MessageCircle,
    href: '/comunicacao',
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/configuracoes',
  },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-30 w-64 h-full bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">NutriCRM</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © 2024 NutriCRM - Sistema para Nutricionistas
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
