
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
import { NovoPatientForm } from '@/components/NovoPatientForm';
import { FichaPacienteDialog } from '@/components/FichaPacienteDialog';
import { Users, Plus, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Paciente {
  id: string;
  nome: string;
  data_nascimento?: string;
  telefone?: string;
  objetivo?: string;
  created_at: string;
}

export const Pacientes = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [showFicha, setShowFicha] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPacientes();
  }, []);

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

  const handleNovoPaciente = (novoPaciente: Paciente) => {
    setPacientes(prev => [novoPaciente, ...prev]);
    setShowForm(false);
    toast({
      title: 'Sucesso',
      description: 'Paciente cadastrado com sucesso!',
    });
  };

  const handleVerFicha = (paciente: Paciente) => {
    setSelectedPaciente(paciente);
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
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Pacientes ({pacientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pacientes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhum paciente cadastrado</p>
              <p>Comece adicionando seu primeiro paciente.</p>
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
                {pacientes.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell className="font-medium">{paciente.nome}</TableCell>
                    <TableCell>{calculateAge(paciente.data_nascimento)}</TableCell>
                    <TableCell>{paciente.telefone || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{paciente.objetivo || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Ativo</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerFicha(paciente)}
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

      {showFicha && selectedPaciente && (
        <FichaPacienteDialog
          open={showFicha}
          onClose={() => {
            setShowFicha(false);
            setSelectedPaciente(null);
          }}
          onUpdate={fetchPacientes}
          selectedPaciente={selectedPaciente}
        />
      )}
    </div>
  );
};
