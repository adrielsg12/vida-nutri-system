import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserX, ChefHat } from 'lucide-react';
import { NovoPlanoAlimentarDialog } from '@/components/NovoPlanoAlimentarDialog';

interface Patient {
  id: string;
  nome: string;
  cpf?: string;
  data_nascimento?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  sexo?: string;
  profissao?: string;
  objetivo?: string;
  historico_clinico?: string;
  habitos_alimentares?: string;
  alergias_intolerancia?: string;
  medicamentos?: string;
  rotina?: string;
  anotacoes_privadas?: string;
  status: string;
}

interface FichaPacienteDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  onSuccess: () => void;
}

export const FichaPacienteDialog = ({ open, onClose, patientId, onSuccess }: FichaPacienteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showNovoPlano, setShowNovoPlano] = useState(false);
  const { toast } = useToast();

  const fetchPatient = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Erro ao buscar paciente:', error);
        toast({
          title: "Erro ao carregar paciente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setPatient(data);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar o paciente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('pacientes')
        .update({
          nome: patient.nome,
          cpf: patient.cpf,
          data_nascimento: patient.data_nascimento,
          telefone: patient.telefone,
          email: patient.email,
          endereco: patient.endereco,
          sexo: patient.sexo,
          profissao: patient.profissao,
          objetivo: patient.objetivo,
          historico_clinico: patient.historico_clinico,
          habitos_alimentares: patient.habitos_alimentares,
          alergias_intolerancia: patient.alergias_intolerancia,
          medicamentos: patient.medicamentos,
          rotina: patient.rotina,
          anotacoes_privadas: patient.anotacoes_privadas,
          updated_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (error) {
        console.error('Erro ao atualizar paciente:', error);
        toast({
          title: "Erro ao atualizar paciente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Paciente atualizado",
        description: "Os dados do paciente foram atualizados com sucesso.",
      });

      setEditing(false);
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar o paciente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      const newStatus = patient.status === 'ativo' ? 'inativo' : 'ativo';
      
      const { error } = await supabase
        .from('pacientes')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (error) {
        console.error('Erro ao alterar status:', error);
        toast({
          title: "Erro ao alterar status",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setPatient({ ...patient, status: newStatus });
      toast({
        title: "Status alterado",
        description: `Paciente ${newStatus === 'ativo' ? 'ativado' : 'inativado'} com sucesso.`,
      });

      setShowStatusDialog(false);
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao alterar o status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && patientId) {
      fetchPatient();
      setEditing(false);
    }
  }, [open, patientId]);

  if (!patient) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Ficha do Paciente - {patient.nome}</DialogTitle>
                <DialogDescription>
                  {editing ? 'Editando informações do paciente' : 'Visualizando informações do paciente'}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge 
                  variant={patient.status === 'ativo' ? 'default' : 'secondary'}
                  className={patient.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}
                >
                  {patient.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNovoPlano(true)}
                  className="flex items-center gap-2"
                >
                  <ChefHat className="h-4 w-4" />
                  Plano Alimentar
                </Button>
                <Button
                  variant={patient.status === 'ativo' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={() => setShowStatusDialog(true)}
                  className="flex items-center gap-2"
                >
                  {patient.status === 'ativo' ? (
                    <>
                      <UserX className="h-4 w-4" />
                      Inativar
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Ativar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue="pessoais" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="clinicos">Dados Clínicos</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoais" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={patient.nome || ''}
                    onChange={(e) => setPatient({...patient, nome: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={patient.cpf || ''}
                    onChange={(e) => setPatient({...patient, cpf: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={patient.data_nascimento || ''}
                    onChange={(e) => setPatient({...patient, data_nascimento: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select 
                    value={patient.sexo || ''} 
                    onValueChange={(value) => setPatient({...patient, sexo: value})}
                    disabled={!editing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={patient.telefone || ''}
                    onChange={(e) => setPatient({...patient, telefone: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patient.email || ''}
                    onChange={(e) => setPatient({...patient, email: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={patient.endereco || ''}
                    onChange={(e) => setPatient({...patient, endereco: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={patient.profissao || ''}
                    onChange={(e) => setPatient({...patient, profissao: e.target.value})}
                    disabled={!editing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objetivo">Objetivo</Label>
                  <Input
                    id="objetivo"
                    value={patient.objetivo || ''}
                    onChange={(e) => setPatient({...patient, objetivo: e.target.value})}
                    disabled={!editing}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clinicos" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="historico_clinico">Histórico Clínico</Label>
                  <Textarea
                    id="historico_clinico"
                    value={patient.historico_clinico || ''}
                    onChange={(e) => setPatient({...patient, historico_clinico: e.target.value})}
                    disabled={!editing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="habitos_alimentares">Hábitos Alimentares</Label>
                  <Textarea
                    id="habitos_alimentares"
                    value={patient.habitos_alimentares || ''}
                    onChange={(e) => setPatient({...patient, habitos_alimentares: e.target.value})}
                    disabled={!editing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alergias_intolerancia">Alergias e Intolerâncias</Label>
                  <Textarea
                    id="alergias_intolerancia"
                    value={patient.alergias_intolerancia || ''}
                    onChange={(e) => setPatient({...patient, alergias_intolerancia: e.target.value})}
                    disabled={!editing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicamentos">Medicamentos em Uso</Label>
                  <Textarea
                    id="medicamentos"
                    value={patient.medicamentos || ''}
                    onChange={(e) => setPatient({...patient, medicamentos: e.target.value})}
                    disabled={!editing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rotina">Rotina Diária</Label>
                  <Textarea
                    id="rotina"
                    value={patient.rotina || ''}
                    onChange={(e) => setPatient({...patient, rotina: e.target.value})}
                    disabled={!editing}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="observacoes" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="anotacoes_privadas">Anotações Privadas</Label>
                <Textarea
                  id="anotacoes_privadas"
                  value={patient.anotacoes_privadas || ''}
                  onChange={(e) => setPatient({...patient, anotacoes_privadas: e.target.value})}
                  disabled={!editing}
                  rows={10}
                  placeholder="Anotações privadas sobre o paciente..."
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Fechar
            </Button>
            {!editing ? (
              <Button 
                onClick={() => setEditing(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Editar
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {patient.status === 'ativo' ? 'Inativar Paciente' : 'Ativar Paciente'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {patient.status === 'ativo' 
                ? 'Tem certeza que deseja inativar este paciente? Ele não poderá mais agendar consultas.'
                : 'Tem certeza que deseja ativar este paciente? Ele poderá voltar a agendar consultas.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleStatus}
              disabled={loading}
              className={patient.status === 'ativo' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {loading ? 'Processando...' : (patient.status === 'ativo' ? 'Inativar' : 'Ativar')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showNovoPlano && (
        <NovoPlanoAlimentarDialog 
          open={showNovoPlano}
          onClose={() => setShowNovoPlano(false)}
          onSuccess={() => {
            setShowNovoPlano(false);
            toast({
              title: "Plano criado",
              description: "Plano alimentar criado com sucesso!",
            });
          }}
          pacientes={[{ id: patient.id, nome: patient.nome, email: patient.email }]}
          pacienteSelecionado={patient.id}
        />
      )}
    </>
  );
};
