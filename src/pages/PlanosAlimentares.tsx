
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  ChefHat, 
  History,
  Settings,
  FileText,
  Calculator
} from 'lucide-react';
import { NovoPlanoAlimentarDialog } from '@/components/NovoPlanoAlimentarDialog';
import { GerenciarAlimentosDialog } from '@/components/GerenciarAlimentosDialog';
import { GerenciarSubstituicoesDialog } from '@/components/GerenciarSubstituicoesDialog';
import { VisualizarPlanoDialog } from '@/components/VisualizarPlanoDialog';

interface Paciente {
  id: string;
  nome: string;
  email?: string;
}

interface PlanoAlimentar {
  id: string;
  titulo: string;
  paciente_id: string;
  data_inicio?: string;
  data_fim?: string;
  status: string;
  created_at: string;
  pacientes: {
    nome: string;
  };
}

export const PlanosAlimentares = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [planos, setPlanos] = useState<PlanoAlimentar[]>([]);
  const [filteredPlanos, setFilteredPlanos] = useState<PlanoAlimentar[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [novoPlanoOpen, setNovoPlanoOpen] = useState(false);
  const [alimentosOpen, setAlimentosOpen] = useState(false);
  const [substituicoesOpen, setSubstituicoesOpen] = useState(false);
  const [visualizarPlanoOpen, setVisualizarPlanoOpen] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const carregarDados = async () => {
    if (!user) return;

    try {
      // Carregar pacientes
      const { data: pacientesData, error: pacientesError } = await supabase
        .from('pacientes')
        .select('id, nome, email')
        .eq('nutricionista_id', user.id)
        .eq('status', 'ativo')
        .order('nome');

      if (pacientesError) throw pacientesError;

      // Carregar planos alimentares
      const { data: planosData, error: planosError } = await supabase
        .from('planos_alimentares')
        .select(`
          id,
          titulo,
          paciente_id,
          data_inicio,
          data_fim,
          status,
          created_at,
          pacientes!inner(nome)
        `)
        .eq('nutricionista_id', user.id)
        .order('created_at', { ascending: false });

      if (planosError) throw planosError;

      setPacientes(pacientesData || []);
      setPlanos(planosData || []);
      setFilteredPlanos(planosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos planos alimentares.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [user]);

  useEffect(() => {
    // Aplicar filtros
    let planosFiltrados = planos;

    if (busca) {
      planosFiltrados = planosFiltrados.filter(plano =>
        plano.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        plano.pacientes.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (filtroStatus !== 'todos') {
      planosFiltrados = planosFiltrados.filter(plano => plano.status === filtroStatus);
    }

    setFilteredPlanos(planosFiltrados);
  }, [busca, filtroStatus, planos]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pausado':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
      case 'finalizado':
        return <Badge variant="secondary">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const visualizarPlano = (planoId: string) => {
    setPlanoSelecionado(planoId);
    setVisualizarPlanoOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando planos alimentares...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planos Alimentares</h1>
          <p className="text-gray-600">Gerencie os planos alimentares dos seus pacientes</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setAlimentosOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChefHat className="w-4 h-4" />
            Biblioteca de Alimentos
          </Button>
          
          <Button
            onClick={() => setSubstituicoesOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Substituições
          </Button>
          
          <Button
            onClick={() => setNovoPlanoOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Plano
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <ChefHat className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-emerald-600">{planos.filter(p => p.status === 'ativo').length}</p>
              <p className="text-sm text-gray-600">Planos Ativos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">{pacientes.length}</p>
              <p className="text-sm text-gray-600">Pacientes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Calendar className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-purple-600">{planos.filter(p => p.status === 'pausado').length}</p>
              <p className="text-sm text-gray-600">Pausados</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <History className="w-8 h-8 mx-auto text-gray-600 mb-2" />
              <p className="text-2xl font-bold text-gray-600">{planos.filter(p => p.status === 'finalizado').length}</p>
              <p className="text-sm text-gray-600">Finalizados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Lista de Planos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Planos Alimentares
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar por plano ou paciente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlanos.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">{plano.titulo}</TableCell>
                  <TableCell>{plano.pacientes.nome}</TableCell>
                  <TableCell>{getStatusBadge(plano.status)}</TableCell>
                  <TableCell>
                    {plano.data_inicio 
                      ? new Date(plano.data_inicio).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    {plano.data_fim 
                      ? new Date(plano.data_fim).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => visualizarPlano(plano.id)}
                      >
                        <Calculator className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPlanos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {busca || filtroStatus !== 'todos' 
                ? 'Nenhum plano encontrado com os filtros aplicados.'
                : 'Nenhum plano alimentar criado ainda. Clique em "Novo Plano" para começar.'
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NovoPlanoAlimentarDialog 
        open={novoPlanoOpen}
        onClose={() => setNovoPlanoOpen(false)}
        onSuccess={carregarDados}
        pacientes={pacientes}
      />
      
      <GerenciarAlimentosDialog 
        open={alimentosOpen}
        onClose={() => setAlimentosOpen(false)}
      />
      
      <GerenciarSubstituicoesDialog 
        open={substituicoesOpen}
        onClose={() => setSubstituicoesOpen(false)}
      />
      
      {planoSelecionado && (
        <VisualizarPlanoDialog 
          open={visualizarPlanoOpen}
          onClose={() => {
            setVisualizarPlanoOpen(false);
            setPlanoSelecionado(null);
          }}
          planoId={planoSelecionado}
        />
      )}
    </div>
  );
};
