
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Video, 
  MapPin,
  Filter
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Appointment {
  id: string;
  patient: string;
  date: string;
  time: string;
  type: 'presencial' | 'online';
  status: 'agendada' | 'concluida' | 'cancelada' | 'faltou';
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patient: 'Maria Santos',
    date: '2024-06-04',
    time: '10:30',
    type: 'presencial',
    status: 'agendada'
  },
  {
    id: '2',
    patient: 'João Silva',
    date: '2024-06-04',
    time: '14:00',
    type: 'online',
    status: 'agendada'
  },
  {
    id: '3',
    patient: 'Ana Costa',
    date: '2024-06-04',
    time: '16:30',
    type: 'presencial',
    status: 'agendada'
  },
  {
    id: '4',
    patient: 'Carlos Oliveira',
    date: '2024-06-03',
    time: '09:00',
    type: 'online',
    status: 'concluida'
  },
];

export const Consultas = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getStatusBadge = (status: Appointment['status']) => {
    const variants = {
      agendada: 'bg-blue-100 text-blue-700',
      concluida: 'bg-emerald-100 text-emerald-700',
      cancelada: 'bg-red-100 text-red-700',
      faltou: 'bg-yellow-100 text-yellow-700',
    };

    const labels = {
      agendada: 'Agendada',
      concluida: 'Concluída',
      cancelada: 'Cancelada',
      faltou: 'Faltou',
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const filteredAppointments = mockAppointments.filter(appointment =>
    appointment.date === selectedDate
  );

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600">Gerencie seus agendamentos e consultas</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Date Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-0 flex-1 text-center">
                <h2 className="text-lg font-semibold text-gray-900 capitalize">
                  {formatDate(selectedDate)}
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: 'day' | 'week' | 'month') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Dia</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {appointment.patient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.patient}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-1">
                        {appointment.type === 'online' ? (
                          <>
                            <Video className="h-4 w-4 text-blue-500" />
                            <span>Online</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-emerald-500" />
                            <span>Presencial</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {appointment.status === 'agendada' && (
                      <>
                        <Button size="sm" variant="outline">
                          Reagendar
                        </Button>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Iniciar Consulta
                        </Button>
                      </>
                    )}
                    {appointment.status === 'concluida' && (
                      <Button size="sm" variant="outline">
                        Ver Relatório
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma consulta agendada
              </h3>
              <p className="text-gray-600 mb-4">
                Não há consultas agendadas para esta data
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
