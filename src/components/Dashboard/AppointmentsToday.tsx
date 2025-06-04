
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Clock, Video, MapPin } from 'lucide-react';

interface Appointment {
  id: string;
  patient: string;
  time: string;
  type: 'presencial' | 'online';
  status: 'scheduled' | 'completed' | 'cancelled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patient: 'Maria Santos',
    time: '10:30',
    type: 'presencial',
    status: 'scheduled'
  },
  {
    id: '2',
    patient: 'João Silva',
    time: '14:00',
    type: 'online',
    status: 'scheduled'
  },
  {
    id: '3',
    patient: 'Ana Costa',
    time: '16:30',
    type: 'presencial',
    status: 'scheduled'
  },
];

export const AppointmentsToday = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Consultas de Hoje</CardTitle>
        <Button variant="outline" size="sm">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {appointment.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {appointment.patient}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{appointment.time}</span>
                  {appointment.type === 'online' ? (
                    <Video className="h-4 w-4 text-blue-500" />
                  ) : (
                    <MapPin className="h-4 w-4 text-emerald-500" />
                  )}
                  <span className="text-xs text-gray-400">
                    {appointment.type === 'online' ? 'Online' : 'Presencial'}
                  </span>
                </div>
              </div>
              
              <Button size="sm" variant="outline">
                Iniciar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
