
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

interface AprovacaoAcesso {
  id: string;
  user_id: string;
  status: string;
  data_solicitacao: string;
  observacoes?: string;
  nome_completo?: string;
}

export const GerenciamentoAprovacoes = () => {
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

  useEffect(() => {
    carregarAprovacoes();
  }, []);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline">Pendente</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando aprovações...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Aprovações de Acesso</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aprovacoes.map((aprovacao) => (
              <TableRow key={aprovacao.id}>
                <TableCell>{aprovacao.nome_completo || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(aprovacao.data_solicitacao).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{getStatusBadge(aprovacao.status)}</TableCell>
                <TableCell>
                  {aprovacao.status === 'pendente' ? (
                    <div className="space-y-2">
                      <Label htmlFor={`obs-${aprovacao.id}`}>Observações (opcional)</Label>
                      <Textarea
                        id={`obs-${aprovacao.id}`}
                        placeholder="Adicione observações sobre a aprovação..."
                        value={observacoes[aprovacao.id] || ''}
                        onChange={(e) => 
                          setObservacoes(prev => ({
                            ...prev,
                            [aprovacao.id]: e.target.value
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-600">{aprovacao.observacoes || 'Sem observações'}</span>
                  )}
                </TableCell>
                <TableCell>
                  {aprovacao.status === 'pendente' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => aprovarUsuario(aprovacao.user_id, aprovacao.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejeitarUsuario(aprovacao.user_id, aprovacao.id)}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {aprovacoes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma solicitação de acesso encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
