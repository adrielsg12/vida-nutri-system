
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, Play, FileText, Calendar } from 'lucide-react';
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

interface ConsultasTableProps {
  consultas: Consulta[];
  onIniciarConsulta: (consulta: Consulta) => void;
  onVerRelatorio: (consulta: Consulta) => void;
}

export const ConsultasTable = ({ consultas, onIniciarConsulta, onVerRelatorio }: ConsultasTableProps) => {
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

  if (consultas.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">Nenhuma consulta agendada</p>
        <p>Agende sua primeira consulta para começar.</p>
      </div>
    );
  }

  return (
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
              <div className="flex gap-2">
                {consulta.status === 'agendada' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onIniciarConsulta(consulta)}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Iniciar Consulta
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onVerRelatorio(consulta)}
                  className="flex items-center gap-1"
                >
                  <FileText className="h-3 w-3" />
                  Relatório
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
