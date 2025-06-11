
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Users, Search, Filter } from 'lucide-react';
import { FichaUsuarioDialog } from './FichaUsuarioDialog';

interface Usuario {
  id: string;
  nome_completo: string;
  email?: string;
  crn?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  clinica?: string;
  status: string;
  created_at: string;
}

export const GerenciamentoUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const { toast } = useToast();
  const { user } = useAuth();

  const carregarUsuarios = async () => {
    try {
      // Buscar todos os perfis de usuários
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome_completo, email, crn, telefone, endereco, cidade, estado, clinica, status, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      setUsuarios(profilesData || []);
      setUsuariosFiltrados(profilesData || []);
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

  useEffect(() => {
    // Aplicar filtros
    let usuariosFiltrados = usuarios;

    // Filtro por busca (nome ou email)
    if (busca) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario =>
        usuario.nome_completo.toLowerCase().includes(busca.toLowerCase()) ||
        (usuario.email && usuario.email.toLowerCase().includes(busca.toLowerCase()))
      );
    }

    // Filtro por status
    if (filtroStatus !== 'todos') {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.status === filtroStatus);
    }

    setUsuariosFiltrados(usuariosFiltrados);
  }, [busca, filtroStatus, usuarios]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'rejeitado':
        return <Badge variant="destructive">Rejeitado</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Administrador</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusCount = (status: string) => {
    return usuarios.filter(u => u.status === status).length;
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
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pendente')}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{getStatusCount('aprovado')}</p>
              <p className="text-sm text-gray-600">Ativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{getStatusCount('inativo')}</p>
              <p className="text-sm text-gray-600">Inativos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{getStatusCount('rejeitado')}</p>
              <p className="text-sm text-gray-600">Rejeitados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Gerenciamento Completo de Usuários
          </CardTitle>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Completo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome_completo}</TableCell>
                  <TableCell>{usuario.email || 'Não informado'}</TableCell>
                  <TableCell>{getStatusBadge(usuario.status)}</TableCell>
                  <TableCell>
                    {new Date(usuario.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <FichaUsuarioDialog 
                      usuario={usuario} 
                      onUsuarioAtualizado={carregarUsuarios}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {busca || filtroStatus !== 'todos' 
                ? 'Nenhum usuário encontrado com os filtros aplicados.'
                : 'Nenhum usuário encontrado.'
              }
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
