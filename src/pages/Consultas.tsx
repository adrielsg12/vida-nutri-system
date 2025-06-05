import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NovaConsultaDialog } from '@/components/NovaConsultaDialog';
import { Calendar, Plus, Clock, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Consulta {
  id: string;
  paciente_id: string;
  data_consulta: string;
  hora_consulta: string;
  status: 'agendada' | 'finalizada' | 'cancelada';
  observacoes?: string;
  pacientes: {
    nome: string;
  };
}

export const Consultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [showNovaConsulta, setShowNovaConsulta] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultas();
  }, []);

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultas')
        .select(`
          *,
          pacientes (nome)
        `)
        .order('data_consulta', { ascending: true });

      if (error) throw error;
      setConsultas(data || []);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as consultas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarConsulta = async (consultaId: string) => {
    try {
      const { error } = await supabase
        .from('consultas')
        .update({ status: 'finalizada' })
        .eq('id', consultaId);

      if (error) throw error;

      await fetchConsultas();
      toast({
        title: 'Sucesso',
        description: 'Consulta finalizada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao finalizar consulta:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível finalizar a consulta.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'default';
      case 'finalizada':
        return 'secondary';
      case 'cancelada':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 lg:px-6 py-6">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600">Gerencie suas consultas agendadas</p>
        </div>
        <Button onClick={() => setShowNovaConsulta(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agendar Nova Consulta
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Consultas Agendadas ({consultas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consultas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhuma consulta agendada</p>
              <p>Agende sua primeira consulta para começar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultas.map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell className="font-medium">
                      {consulta.pacientes?.nome || 'Paciente não encontrado'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(consulta.data_consulta), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {consulta.hora_consulta}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(consulta.status)}>
                        {consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {consulta.status === 'agendada' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleIniciarConsulta(consulta.id)}
                          className="flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Iniciar Consulta
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NovaConsultaDialog
        isOpen={showNovaConsulta}
        onClose={() => setShowNovaConsulta(false)}
        onSave={() => {
          setShowNovaConsulta(false);
          fetchConsultas();
        }}
      />
    </div>
  );
};
