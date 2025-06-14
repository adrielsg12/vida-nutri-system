
import { useState, useEffect } from 'react';
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

export const useConsultas = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  useEffect(() => {
    fetchConsultas();
  }, []);

  return {
    consultas,
    loading,
    fetchConsultas
  };
};
