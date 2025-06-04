
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: string;
  type: 'consulta' | 'pagamento' | 'plano';
  patient: string;
  description: string;
  time: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'consulta',
    patient: 'Maria Santos',
    description: 'Consulta de retorno agendada',
    time: '10:30',
    status: 'pending'
  },
  {
    id: '2',
    type: 'pagamento',
    patient: 'João Silva',
    description: 'Pagamento de R$ 150,00 recebido',
    time: '09:15',
    status: 'completed'
  },
  {
    id: '3',
    type: 'plano',
    patient: 'Ana Costa',
    description: 'Plano alimentar enviado',
    time: '08:45',
    status: 'completed'
  },
];

export const RecentActivity = () => {
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'consulta': return 'bg-blue-100 text-blue-700';
      case 'pagamento': return 'bg-emerald-100 text-emerald-700';
      case 'plano': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null;
    
    const variants = {
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    const labels = {
      pending: 'Pendente',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={getActivityColor(activity.type)}>
                  {activity.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.patient}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {activity.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-right">
                <span className="text-sm text-gray-500">{activity.time}</span>
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
