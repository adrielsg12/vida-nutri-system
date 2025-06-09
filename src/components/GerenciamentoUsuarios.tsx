
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Power, PowerOff, Eye, Users } from 'lucide-react';

interface Usuario {
  id: string;
  nome_completo: string;
  email?: string;
  crn?: string;
  telefone?: string;
  status: string;
  created_at: string;
}

export const GerenciamentoUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const carregarUsuarios = async () => {
    try {
      // Buscar perfis dos usuários
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome_completo, crn, telefone, status, created_at')
        .neq('status', 'admin')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (profilesData && profilesData.length > 0) {
        // Buscar os e-mails dos usuários da tabela auth (via RPC ou através de uma view)
        // Como não podemos acessar auth.users diretamente, vamos trabalhar só com os dados do profiles
        setUsuarios(profilesData.map(profile => ({
          ...profile,
          email: 'Email não disponível' // Placeholder, pois não podemos acessar auth.users
        })));
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const inativarUsuario = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('inativar_usuario', {
        usuario_id: userId,
        admin_id: user?.id
      });

      if (error) throw error;

      toast({
        title: "Usuário inativado",
        description: "O usuário foi inativado com sucesso.",
      });

      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao inativar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao inativar usuário.",
        variant: "destructive",
      });
    }
  };

  const reativarUsuario = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('reativar_usuario', {
        usuario_id: userId,
        admin_id: user?.id
      });

      if (error) throw error;

      toast({
        title: "Usuário reativado",
        description: "O usuário foi reativado com sucesso.",
      });

      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao reativar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao reativar usuário.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge variant="destructive">Rejeitado</Badge>;
      case 'inativo':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusActions = (usuario: Usuario) => {
    if (usuario.status === 'inativo') {
      return (
        <Button
          size="sm"
          onClick={() => reativarUsuario(usuario.id)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Power className="w-4 h-4 mr-1" />
          Reativar
        </Button>
      );
    } else if (usuario.status === 'aprovado') {
      return (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => inativarUsuario(usuario.id)}
        >
          <PowerOff className="w-4 h-4 mr-1" />
          Inativar
        </Button>
      );
    }
    return <span className="text-gray-500 text-sm">Sem ações</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Gerenciamento de Usuários
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CRN</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">{usuario.nome_completo}</TableCell>
                <TableCell>{usuario.crn || 'Não informado'}</TableCell>
                <TableCell>{usuario.telefone || 'Não informado'}</TableCell>
                <TableCell>
                  {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                <TableCell>
                  {getStatusActions(usuario)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {usuarios.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum usuário encontrado.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
