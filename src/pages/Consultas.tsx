
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
import { RegistroConsultaDialog } from '@/components/RegistroConsultaDialog';
import { Calendar, Plus, Clock, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Consulta {
  id: string;
  paciente_id: string;
  data_hora: string;
  status: 'agendada' | 'finalizada' | 'cancelada';
  observacoes?: string;
  pacientes: {
    nome: string;
  };
}

export const Consultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [showNovaConsulta, setShowNovaConsulta] = useState(false);
  const [showRegistroConsulta, setShowRegistroConsulta] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
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
        .order('data_hora', { ascending: true });

      if (error) throw error;
      
      // Type cast the status to ensure it matches our interface
      const consultasWithTypedStatus = (data || []).map(consulta => ({
        ...consulta,
        status: consulta.status as 'agendada' | 'finalizada' | 'cancelada'
      }));
      
      setConsultas(consultasWithTypedStatus);
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

  const handleIniciarConsulta = (consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setShowRegistroConsulta(true);
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600 mt-2">Gerencie suas consultas agendadas</p>
        </div>
        <Button onClick={() => setShowNovaConsulta(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agendar Nova Consulta
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Consultas Agendadas ({consultas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {consultas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhuma consulta agendada</p>
              <p>Agende sua primeira consulta para começar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data e Hora</TableHead>
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
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(consulta.data_hora), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
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
                          onClick={() => handleIniciarConsulta(consulta)}
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
        open={showNovaConsulta}
        onClose={() => setShowNovaConsulta(false)}
        onSuccess={() => {
          setShowNovaConsulta(false);
          fetchConsultas();
        }}
      />

      {consultaSelecionada && (
        <RegistroConsultaDialog
          open={showRegistroConsulta}
          onClose={() => {
            setShowRegistroConsulta(false);
            setConsultaSelecionada(null);
          }}
          onSuccess={() => {
            fetchConsultas();
          }}
          consulta={consultaSelecionada}
        />
      )}
    </div>
  );
};
