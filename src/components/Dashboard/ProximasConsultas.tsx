
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ProximaConsulta {
  id: string;
  paciente_nome: string;
  data_hora: string;
}

interface ProximasConsultasProps {
  consultas: ProximaConsulta[];
  loading: boolean;
}

export const ProximasConsultas = ({ consultas, loading }: ProximasConsultasProps) => {
  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximas Consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {consultas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma informação registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultas.map((consulta) => (
              <div
                key={consulta.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{consulta.paciente_nome}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(consulta.data_hora), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  {format(new Date(consulta.data_hora), 'HH:mm', { locale: ptBR })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
