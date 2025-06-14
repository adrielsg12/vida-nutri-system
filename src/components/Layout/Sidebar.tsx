import React from 'react';
import {
  BarChart3,
  Calendar,
  ChefHat,
  DollarSign,
  MessageSquare,
  Settings,
  Users,
  Search
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface NavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ name, href, icon: Icon, current }) => {
  return (
    <li>
      <Link
        to={href}
        className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 ${
          current ? 'bg-gray-100' : ''
        }`}
      >
        <Icon className={`w-5 h-5 text-gray-500 ${current ? 'text-gray-900' : ''}`} />
        <span className="ml-3">{name}</span>
      </Link>
    </li>
  );
};

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: location.pathname === '/dashboard' },
    { name: 'Pacientes', href: '/pacientes', icon: Users, current: location.pathname === '/pacientes' },
    { name: 'Consultas', href: '/consultas', icon: Calendar, current: location.pathname === '/consultas' },
    { name: 'Planos Alimentares', href: '/planos-alimentares', icon: ChefHat, current: location.pathname === '/planos-alimentares' },
    { name: 'Pesquisa de Alimentos', href: '/pesquisa-alimentos', icon: Search, current: location.pathname === '/pesquisa-alimentos' },
    { name: 'Financeiro', href: '/financeiro', icon: DollarSign, current: location.pathname === '/financeiro' },
    { name: 'Comunicação', href: '/comunicacao', icon: MessageSquare, current: location.pathname === '/comunicacao' },
    { name: 'Configurações', href: '/configuracoes', icon: Settings, current: location.pathname === '/configuracoes' },
  ];

  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="overflow-y-auto h-full py-4 px-3 bg-gray-50 rounded">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} {...item} />
          ))}
        </ul>
      </div>
    </aside>
  );
};
