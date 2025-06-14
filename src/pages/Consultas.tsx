
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NovaConsultaDialog } from '@/components/NovaConsultaDialog';
import { RegistroConsultaDialog } from '@/components/RegistroConsultaDialog';
import { RelatorioEvolucaoDialog } from '@/components/RelatorioEvolucaoDialog';
import { ConsultasHeader } from '@/components/Consultas/ConsultasHeader';
import { ConsultasTable } from '@/components/Consultas/ConsultasTable';
import { useConsultas } from '@/hooks/useConsultas';
import { Calendar } from 'lucide-react';

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
  const { consultas, loading, fetchConsultas } = useConsultas();
  const [showNovaConsulta, setShowNovaConsulta] = useState(false);
  const [showRegistroConsulta, setShowRegistroConsulta] = useState(false);
  const [showRelatorioEvolucao, setShowRelatorioEvolucao] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<{id: string; nome: string} | null>(null);

  const handleIniciarConsulta = (consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setShowRegistroConsulta(true);
  };

  const handleVerRelatorio = (consulta: Consulta) => {
    setPacienteSelecionado({
      id: consulta.paciente_id,
      nome: consulta.pacientes?.nome || 'Paciente não encontrado'
    });
    setShowRelatorioEvolucao(true);
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
      <ConsultasHeader 
        onNovaConsulta={() => setShowNovaConsulta(true)}
        totalConsultas={consultas.length}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Consultas Agendadas ({consultas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultasTable 
            consultas={consultas}
            onIniciarConsulta={handleIniciarConsulta}
            onVerRelatorio={handleVerRelatorio}
          />
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

      {pacienteSelecionado && (
        <RelatorioEvolucaoDialog
          open={showRelatorioEvolucao}
          onClose={() => {
            setShowRelatorioEvolucao(false);
            setPacienteSelecionado(null);
          }}
          paciente={pacienteSelecionado}
        />
      )}
    </div>
  );
};
