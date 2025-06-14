
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NovaConsultaDialog } from '@/components/NovaConsultaDialog';
import { RegistroConsultaDialog } from '@/components/RegistroConsultaDialog';
import { RelatorioEvolucaoDialog } from '@/components/RelatorioEvolucaoDialog';
import { ConsultasHeader } from '@/components/Consultas/ConsultasHeader';
import { ConsultasTable } from '@/components/Consultas/ConsultasTable';
import { useConsultas } from '@/hooks/useConsultas';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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

  // Função para encerrar consulta (finalizar)
  const handleEncerrarConsulta = async (consulta: Consulta) => {
    const ok = window.confirm("Deseja realmente encerrar/finalizar esta consulta?");
    if (!ok) return;

    const { error } = await supabase
      .from('consultas')
      .update({ status: 'finalizada' })
      .eq('id', consulta.id);

    if (error) {
      toast({
        title: "Erro ao encerrar consulta",
        description: "Não foi possível encerrar a consulta.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Consulta encerrada!",
        description: "A consulta foi finalizada com sucesso.",
      });
      fetchConsultas();
    }
  };

  // Função para excluir consulta
  const handleExcluirConsulta = async (consulta: Consulta) => {
    const { error } = await supabase
      .from('consultas')
      .delete()
      .eq('id', consulta.id);

    if (error) {
      toast({
        title: "Erro ao excluir consulta",
        description: "Não foi possível excluir a consulta.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Consulta excluída!",
        description: "A consulta foi removida com sucesso.",
      });
      fetchConsultas();
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
            onEncerrarConsulta={handleEncerrarConsulta}
            onExcluirConsulta={handleExcluirConsulta}
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
