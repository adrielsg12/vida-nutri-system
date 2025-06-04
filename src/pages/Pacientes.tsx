
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, MoreHorizontal, Phone, Mail, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { NovoPatientForm } from '@/components/NovoPatientForm';

interface Patient {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  data_nascimento: string;
  objetivo: string;
  status: 'ativo' | 'inativo' | 'pendente';
  created_at: string;
  cpf?: string;
  endereco?: string;
  sexo?: string;
}

export const Pacientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para ver os pacientes.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('nutricionista_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pacientes:', error);
        toast({
          title: "Erro ao carregar pacientes",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os pacientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (patientId: string) => {
    try {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', patientId);

      if (error) {
        console.error('Erro ao excluir paciente:', error);
        toast({
          title: "Erro ao excluir paciente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Paciente excluído",
        description: "O paciente foi removido com sucesso.",
      });

      // Atualizar a lista de pacientes
      setPatients(patients.filter(p => p.id !== patientId));
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir o paciente.",
        variant: "destructive",
      });
    }
  };

  const togglePatientStatus = async (patientId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
    
    try {
      const { error } = await supabase
        .from('pacientes')
        .update({ status: newStatus })
        .eq('id', patientId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro ao atualizar status",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Status atualizado",
        description: `Paciente ${newStatus === 'ativo' ? 'ativado' : 'inativado'} com sucesso.`,
      });

      // Atualizar a lista de pacientes
      setPatients(patients.map(p => 
        p.id === patientId ? { ...p, status: newStatus as 'ativo' | 'inativo' | 'pendente' } : p
      ));
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar o status.",
        variant: "destructive",
      });
    }
  };

  const handlePatientAdded = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
    setShowNewPatientForm(false);
    toast({
      title: "Paciente cadastrado",
      description: "O paciente foi adicionado com sucesso.",
    });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: Patient['status']) => {
    const variants = {
      ativo: 'bg-emerald-100 text-emerald-700',
      inativo: 'bg-gray-100 text-gray-700',
      pendente: 'bg-yellow-100 text-yellow-700',
    };

    const labels = {
      ativo: 'Ativo',
      inativo: 'Inativo',
      pendente: 'Pendente',
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      {/* Header - layout ajustado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Gerencie seus pacientes e acompanhe o progresso</p>
        </div>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setShowNewPatientForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Filters - layout centralizado */}
      <Card className="mx-auto">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid - layout ajustado */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                        {patient.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{patient.nome}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {patient.data_nascimento ? `${calculateAge(patient.data_nascimento)} anos` : ''}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Ver ficha</DropdownMenuItem>
                      <DropdownMenuItem>Agendar consulta</DropdownMenuItem>
                      <DropdownMenuItem>Enviar plano</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => togglePatientStatus(patient.id, patient.status)}>
                        {patient.status === 'ativo' ? 'Inativar' : 'Ativar'}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o paciente {patient.nome}? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePatient(patient.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.objetivo && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Objetivo:</span>
                    <span className="text-sm text-gray-600">{patient.objetivo}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  {getStatusBadge(patient.status)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Cadastrado em:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {patient.telefone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Phone className="h-4 w-4" />
                      {patient.telefone}
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {patient.email}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    Ver Ficha
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Contatar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-md">
          <CardContent className="p-12 text-center">
            <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece adicionando seu primeiro paciente'}
            </p>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => setShowNewPatientForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Paciente
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de novo paciente */}
      <NovoPatientForm 
        open={showNewPatientForm}
        onClose={() => setShowNewPatientForm(false)}
        onSuccess={handlePatientAdded}
      />
    </div>
  );
};
