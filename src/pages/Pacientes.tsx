
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
  Eye, 
  UserCheck, 
  UserX, 
  ChefHat,
  Calculator 
} from 'lucide-react';
import { NovoPatientForm } from '@/components/NovoPatientForm';
import { FichaPacienteDialog } from '@/components/FichaPacienteDialog';
import { NovoPlanoAlimentarDialog } from '@/components/NovoPlanoAlimentarDialog';
import { VisualizarPlanoDialog } from '@/components/VisualizarPlanoDialog';

interface Patient {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  status: string;
  created_at: string;
  planosCount?: number;
}

interface PlanoAlimentar {
  id: string;
  titulo: string;
  status: string;
  created_at: string;
}

export const Pacientes = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showFichaDialog, setShowFichaDialog] = useState(false);
  const [showNovoPlano, setShowNovoPlano] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);
  const [showVisualizarPlano, setShowVisualizarPlano] = useState(false);
  const [pacientePlanos, setPacientePlanos] = useState<{[key: string]: PlanoAlimentar[]}>({});
  
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPatients = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar pacientes
      const { data: patientsData, error: patientsError } = await supabase
        .from('pacientes')
        .select('*')
        .eq('nutricionista_id', user.id)
        .order('created_at', { ascending: false });

      if (patientsError) throw patientsError;

      // Buscar planos para cada paciente
      const { data: planosData, error: planosError } = await supabase
        .from('planos_alimentares')
        .select('id, titulo, status, created_at, paciente_id')
        .eq('nutricionista_id', user.id);

      if (planosError) throw planosError;

      // Organizar planos por paciente
      const planosPorPaciente: {[key: string]: PlanoAlimentar[]} = {};
      planosData?.forEach(plano => {
        if (!planosPorPaciente[plano.paciente_id]) {
          planosPorPaciente[plano.paciente_id] = [];
        }
        planosPorPaciente[plano.paciente_id].push(plano);
      });

      // Adicionar contagem de planos aos pacientes
      const patientsWithPlanos = patientsData?.map(patient => ({
        ...patient,
        planosCount: planosPorPaciente[patient.id]?.length || 0
      })) || [];

      console.log('Pacientes carregados:', patientsWithPlanos);
      console.log('Planos por paciente:', planosPorPaciente);

      setPatients(patientsWithPlanos);
      setFilteredPatients(patientsWithPlanos);
      setPacientePlanos(planosPorPaciente);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de pacientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  useEffect(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cpf?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    setFilteredPatients(filtered);
  }, [searchTerm, statusFilter, patients]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowFichaDialog(true);
  };

  const handleCreatePlano = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowNovoPlano(true);
  };

  const handleViewPlano = (planoId: string) => {
    setPlanoSelecionado(planoId);
    setShowVisualizarPlano(true);
  };

  const handlePlanoSuccess = () => {
    setShowNovoPlano(false);
    fetchPatients(); // Recarregar para atualizar contagem de planos
    toast({
      title: "Plano criado",
      description: "Plano alimentar criado com sucesso!",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gerencie os dados dos seus pacientes</p>
        </div>
        <Button
          onClick={() => setShowNewPatientForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-emerald-600">{patients.filter(p => p.status === 'ativo').length}</p>
              <p className="text-sm text-gray-600">Pacientes Ativos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <UserX className="w-8 h-8 mx-auto text-red-600 mb-2" />
              <p className="text-2xl font-bold text-red-600">{patients.filter(p => p.status === 'inativo').length}</p>
              <p className="text-sm text-gray-600">Pacientes Inativos</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <ChefHat className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-600">
                {Object.values(pacientePlanos).reduce((total, planos) => total + planos.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Planos Alimentares</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Lista de Pacientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Lista de Pacientes
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Planos</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.nome}</TableCell>
                  <TableCell>{patient.email || '-'}</TableCell>
                  <TableCell>{patient.telefone || '-'}</TableCell>
                  <TableCell>{getStatusBadge(patient.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{patient.planosCount || 0} planos</Badge>
                      {pacientePlanos[patient.id] && pacientePlanos[patient.id].length > 0 && (
                        <div className="flex gap-1">
                          {pacientePlanos[patient.id].slice(0, 2).map((plano) => (
                            <Button
                              key={plano.id}
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewPlano(plano.id)}
                              className="text-xs"
                            >
                              <Calculator className="w-3 h-3 mr-1" />
                              {plano.titulo.substring(0, 10)}...
                            </Button>
                          ))}
                          {pacientePlanos[patient.id].length > 2 && (
                            <Badge variant="secondary">+{pacientePlanos[patient.id].length - 2}</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPatient(patient.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreatePlano(patient.id)}
                        className="bg-emerald-50 hover:bg-emerald-100"
                      >
                        <ChefHat className="w-4 h-4 mr-1" />
                        Plano
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || statusFilter !== 'todos' 
                ? 'Nenhum paciente encontrado com os filtros aplicados.'
                : 'Nenhum paciente cadastrado ainda. Clique em "Novo Paciente" para começar.'
              }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {showNewPatientForm && (
        <NovoPatientForm 
          onClose={() => setShowNewPatientForm(false)}
          onSuccess={() => {
            setShowNewPatientForm(false);
            fetchPatients();
          }}
        />
      )}

      {selectedPatientId && showFichaDialog && (
        <FichaPacienteDialog
          open={showFichaDialog}
          onClose={() => {
            setShowFichaDialog(false);
            setSelectedPatientId(null);
          }}
          patientId={selectedPatientId}
          onSuccess={fetchPatients}
        />
      )}

      {selectedPatientId && showNovoPlano && (
        <NovoPlanoAlimentarDialog
          open={showNovoPlano}
          onClose={() => {
            setShowNovoPlano(false);
            setSelectedPatientId(null);
          }}
          onSuccess={handlePlanoSuccess}
          pacientes={patients.map(p => ({ id: p.id, nome: p.nome, email: p.email }))}
          pacienteSelecionado={selectedPatientId}
        />
      )}

      {planoSelecionado && (
        <VisualizarPlanoDialog
          open={showVisualizarPlano}
          onClose={() => {
            setShowVisualizarPlano(false);
            setPlanoSelecionado(null);
          }}
          planoId={planoSelecionado}
        />
      )}
    </div>
  );
};
