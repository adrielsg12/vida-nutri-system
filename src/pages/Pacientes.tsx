
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NovoPatientForm } from '@/components/NovoPatientForm';
import { FichaPacienteDialog } from '@/components/FichaPacienteDialog';
import { Users, Plus, Eye, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Paciente {
  id: string;
  nome: string;
  data_nascimento?: string;
  telefone?: string;
  objetivo?: string;
  status: string;
  created_at: string;
}

export const Pacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(null);
  const [showFicha, setShowFicha] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const { toast } = useToast();

  useEffect(() => {
    fetchPacientes();
  }, []);

  useEffect(() => {
    filterPacientes();
  }, [pacientes, statusFilter]);

  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPacientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pacientes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPacientes = () => {
    if (statusFilter === 'todos') {
      setFilteredPacientes(pacientes);
    } else {
      setFilteredPacientes(pacientes.filter(p => p.status === statusFilter));
    }
  };

  const handleNovoPaciente = (novoPaciente: Paciente) => {
    setPacientes(prev => [novoPaciente, ...prev]);
    setShowForm(false);
    toast({
      title: 'Sucesso',
      description: 'Paciente cadastrado com sucesso!',
    });
  };

  const handleVerFicha = (pacienteId: string) => {
    setSelectedPacienteId(pacienteId);
    setShowFicha(true);
  };

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return `${age - 1} anos`;
    }
    return `${age} anos`;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'inativo') {
      return <Badge variant="secondary" className="bg-gray-200 text-gray-600">Inativo</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-100 text-green-800">Ativo</Badge>;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600 mt-2">Gerencie seus pacientes cadastrados</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Paciente
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Pacientes ({filteredPacientes.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPacientes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                {statusFilter === 'todos' ? 'Nenhum paciente cadastrado' : `Nenhum paciente ${statusFilter}`}
              </p>
              <p>
                {statusFilter === 'todos' 
                  ? 'Comece adicionando seu primeiro paciente.' 
                  : `Não há pacientes com status ${statusFilter}.`
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Objetivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPacientes.map((paciente) => (
                  <TableRow 
                    key={paciente.id}
                    className={paciente.status === 'inativo' ? 'opacity-60' : ''}
                  >
                    <TableCell className="font-medium">{paciente.nome}</TableCell>
                    <TableCell>{calculateAge(paciente.data_nascimento)}</TableCell>
                    <TableCell>{paciente.telefone || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{paciente.objetivo || 'N/A'}</TableCell>
                    <TableCell>
                      {getStatusBadge(paciente.status)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerFicha(paciente.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Ver ficha
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <NovoPatientForm 
          open={showForm}
          onClose={() => setShowForm(false)}
          onSuccess={handleNovoPaciente}
        />
      )}

      {showFicha && selectedPacienteId && (
        <FichaPacienteDialog
          open={showFicha}
          onClose={() => {
            setShowFicha(false);
            setSelectedPacienteId(null);
          }}
          patientId={selectedPacienteId}
          onSuccess={fetchPacientes}
        />
      )}
    </div>
  );
};
