
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalPacientes: number;
  consultasHoje: number;
  consultasConcluidas: number;
  recebimentosMes: number;
}

interface ProximaConsulta {
  id: string;
  paciente_nome: string;
  data_hora: string;
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPacientes: 0,
    consultasHoje: 0,
    consultasConcluidas: 0,
    recebimentosMes: 0,
  });
  const [proximasConsultas, setProximasConsultas] = useState<ProximaConsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Data atual para filtros
      const hoje = new Date();
      const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);

      // Buscar total de pacientes
      const { count: totalPacientes, error: errorPacientes } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true });

      if (errorPacientes) throw errorPacientes;

      // Buscar consultas de hoje
      const { count: consultasHoje, error: errorConsultasHoje } = await supabase
        .from('consultas')
        .select('*', { count: 'exact', head: true })
        .gte('data_hora', inicioHoje.toISOString())
        .lte('data_hora', fimHoje.toISOString());

      if (errorConsultasHoje) throw errorConsultasHoje;

      // Buscar consultas concluídas do mês
      const { count: consultasConcluidas, error: errorConsultasConcluidas } = await supabase
        .from('consultas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'finalizada')
        .gte('data_hora', inicioMes.toISOString())
        .lte('data_hora', fimMes.toISOString());

      if (errorConsultasConcluidas) throw errorConsultasConcluidas;

      // Buscar recebimentos do mês
      const { data: pagamentos, error: errorPagamentos } = await supabase
        .from('pagamentos')
        .select('valor')
        .gte('data_pagamento', inicioMes.toISOString().split('T')[0])
        .lte('data_pagamento', fimMes.toISOString().split('T')[0]);

      if (errorPagamentos) throw errorPagamentos;

      const recebimentosMes = pagamentos?.reduce((total, pagamento) => total + Number(pagamento.valor), 0) || 0;

      // Buscar próximas consultas
      const { data: proximasConsultasData, error: errorProximasConsultas } = await supabase
        .from('consultas')
        .select(`
          id,
          data_hora,
          pacientes (nome)
        `)
        .eq('status', 'agendada')
        .gte('data_hora', new Date().toISOString())
        .order('data_hora', { ascending: true })
        .limit(5);

      if (errorProximasConsultas) throw errorProximasConsultas;

      const proximasConsultasFormatted = proximasConsultasData?.map(consulta => ({
        id: consulta.id,
        paciente_nome: consulta.pacientes?.nome || 'Paciente não encontrado',
        data_hora: consulta.data_hora,
      })) || [];

      setStats({
        totalPacientes: totalPacientes || 0,
        consultasHoje: consultasHoje || 0,
        consultasConcluidas: consultasConcluidas || 0,
        recebimentosMes,
      });

      setProximasConsultas(proximasConsultasFormatted);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do dashboard.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    proximasConsultas,
    loading,
    refetch: fetchDashboardData,
  };
};
