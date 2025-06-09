
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AprovacaoAcesso {
  id: string;
  user_id: string;
  status: string;
  data_solicitacao: string;
  observacoes?: string;
  nome_completo?: string;
}

export const useAprovacoes = () => {
  const [aprovacoes, setAprovacoes] = useState<AprovacaoAcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const [observacoes, setObservacoes] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const { user } = useAuth();

  const carregarAprovacoes = async () => {
    try {
      // Buscar aprovações e nomes dos usuários separadamente
      const { data: aprovacoesData, error: aprovacoesError } = await supabase
        .from('aprovacoes_acesso')
        .select('*')
        .order('data_solicitacao', { ascending: false });

      if (aprovacoesError) throw aprovacoesError;

      if (aprovacoesData && aprovacoesData.length > 0) {
        // Buscar os perfis dos usuários
        const userIds = aprovacoesData.map(a => a.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, nome_completo')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        // Combinar os dados
        const aprovacoesComNomes = aprovacoesData.map(aprovacao => {
          const profile = profilesData?.find(p => p.id === aprovacao.user_id);
          return {
            ...aprovacao,
            nome_completo: profile?.nome_completo || 'Nome não encontrado'
          };
        });

        setAprovacoes(aprovacoesComNomes);
      } else {
        setAprovacoes([]);
      }
    } catch (error) {
      console.error('Erro ao carregar aprovações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar aprovações de acesso.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const aprovarUsuario = async (userId: string, aprovacaoId: string) => {
    try {
      const { error } = await supabase.rpc('aprovar_usuario', {
        usuario_id: userId,
        aprovador_id: user?.id,
        observacoes_param: observacoes[aprovacaoId] || null
      });

      if (error) throw error;

      toast({
        title: "Usuário aprovado",
        description: "O usuário foi aprovado com sucesso.",
      });

      carregarAprovacoes();
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar usuário.",
        variant: "destructive",
      });
    }
  };

  const rejeitarUsuario = async (userId: string, aprovacaoId: string) => {
    try {
      const { error } = await supabase.rpc('rejeitar_usuario', {
        usuario_id: userId,
        aprovador_id: user?.id,
        observacoes_param: observacoes[aprovacaoId] || null
      });

      if (error) throw error;

      toast({
        title: "Usuário rejeitado",
        description: "O usuário foi rejeitado.",
      });

      carregarAprovacoes();
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao rejeitar usuário.",
        variant: "destructive",
      });
    }
  };

  const updateObservacoes = (aprovacaoId: string, novasObservacoes: string) => {
    setObservacoes(prev => ({
      ...prev,
      [aprovacaoId]: novasObservacoes
    }));
  };

  useEffect(() => {
    carregarAprovacoes();
  }, []);

  return {
    aprovacoes,
    loading,
    observacoes,
    aprovarUsuario,
    rejeitarUsuario,
    updateObservacoes,
    carregarAprovacoes
  };
};
