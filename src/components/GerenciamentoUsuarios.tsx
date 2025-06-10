
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Power, PowerOff, Users } from 'lucide-react';
import { EditarUsuarioDialog } from './EditarUsuarioDialog';

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
      // Buscar perfis dos usuários aprovados
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome_completo, email, crn, telefone, endereco, cidade, estado, clinica, status, created_at')
        .in('status', ['aprovado', 'inativo'])
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      setUsuarios(profilesData || []);
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
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusActions = (usuario: Usuario) => {
    if (usuario.status === 'inativo') {
      return (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => reativarUsuario(usuario.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Power className="w-4 h-4 mr-1" />
            Reativar
          </Button>
        </div>
      );
    } else if (usuario.status === 'aprovado') {
      return (
        <div className="flex space-x-2">
          <EditarUsuarioDialog 
            usuario={usuario} 
            onUsuarioAtualizado={carregarUsuarios}
          />
          <Button
            size="sm"
            variant="destructive"
            onClick={() => inativarUsuario(usuario.id)}
          >
            <PowerOff className="w-4 h-4 mr-1" />
            Inativar
          </Button>
        </div>
      );
    }
    return null;
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
              <TableHead>Email</TableHead>
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
                <TableCell>{usuario.email || 'Não informado'}</TableCell>
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
