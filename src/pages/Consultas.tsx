
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NovaConsultaDialog } from '@/components/NovaConsultaDialog';

interface Appointment {
  id: string;
  paciente_id: string;
  paciente_nome: string;
  data_hora: string;
  tipo: 'presencial' | 'online';
  status: 'agendada' | 'realizada' | 'cancelada' | 'faltou';
  observacoes?: string;
  valor?: number;
}

export const Consultas = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('consultas')
        .select(`
          *,
          pacientes!inner(nome)
        `)
        .eq('nutricionista_id', user.id)
        .gte('data_hora', selectedDate + 'T00:00:00')
        .lt('data_hora', selectedDate + 'T23:59:59')
        .order('data_hora', { ascending: true });

      if (error) {
        console.error('Erro ao buscar consultas:', error);
        toast({
          title: "Erro ao carregar consultas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const formattedAppointments = (data || []).map(appointment => ({
        id: appointment.id,
        paciente_id: appointment.paciente_id,
        paciente_nome: appointment.pacientes?.nome || 'Paciente não encontrado',
        data_hora: appointment.data_hora,
        tipo: appointment.tipo as 'presencial' | 'online',
        status: appointment.status as 'agendada' | 'realizada' | 'cancelada' | 'faltou',
        observacoes: appointment.observacoes,
        valor: appointment.valor
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar as consultas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('consultas')
        .update({ status: 'realizada' })
        .eq('id', appointmentId);

      if (error) {
        toast({
          title: "Erro ao iniciar consulta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Consulta iniciada",
        description: "A consulta foi marcada como realizada.",
      });

      fetchAppointments();
    } catch (error) {
      console.error('Erro ao iniciar consulta:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao iniciar a consulta.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const getStatusBadge = (status: Appointment['status']) => {
    const variants = {
      agendada: 'bg-blue-100 text-blue-700',
      realizada: 'bg-emerald-100 text-emerald-700',
      cancelada: 'bg-red-100 text-red-700',
      faltou: 'bg-yellow-100 text-yellow-700',
    };

    const labels = {
      agendada: 'Agendada',
      realizada: 'Realizada',
      cancelada: 'Cancelada',
      faltou: 'Faltou',
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando consultas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600">Gerencie seus agendamentos e consultas</p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setShowNewAppointmentDialog(true)}
        >
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
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {appointment.paciente_nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.paciente_nome}
                      </h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(appointment.data_hora).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        {appointment.tipo === 'online' ? (
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
                      {appointment.valor && (
                        <span className="font-medium">
                          R$ {appointment.valor.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {appointment.status === 'agendada' && (
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => startAppointment(appointment.id)}
                      >
                        Iniciar Consulta
                      </Button>
                    )}
                    {appointment.status === 'realizada' && (
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
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowNewAppointmentDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <NovaConsultaDialog 
        open={showNewAppointmentDialog}
        onClose={() => setShowNewAppointmentDialog(false)}
        onSuccess={() => {
          setShowNewAppointmentDialog(false);
          fetchAppointments();
        }}
      />
    </div>
  );
};
