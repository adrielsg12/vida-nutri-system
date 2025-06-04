
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NovoPatientFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (patient: any) => void;
}

interface PatientFormData {
  nome: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  sexo: string;
  profissao: string;
  objetivo: string;
  historico_clinico: string;
  habitos_alimentares: string;
  alergias_intolerancia: string;
  medicamentos: string;
  rotina: string;
  anotacoes_privadas: string;
}

export const NovoPatientForm = ({ open, onClose, onSuccess }: NovoPatientFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>({
    nome: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    endereco: '',
    sexo: '',
    profissao: '',
    objetivo: '',
    historico_clinico: '',
    habitos_alimentares: '',
    alergias_intolerancia: '',
    medicamentos: '',
    rotina: '',
    anotacoes_privadas: '',
  });
  const { toast } = useToast();

  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do paciente é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.email && !formData.email.includes('@')) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para cadastrar pacientes.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('pacientes')
        .insert([{
          ...formData,
          nutricionista_id: user.id,
          status: 'ativo'
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao cadastrar paciente:', error);
        toast({
          title: "Erro ao cadastrar paciente",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      onSuccess(data);
      
      // Limpar formulário
      setFormData({
        nome: '',
        cpf: '',
        data_nascimento: '',
        telefone: '',
        email: '',
        endereco: '',
        sexo: '',
        profissao: '',
        objetivo: '',
        historico_clinico: '',
        habitos_alimentares: '',
        alergias_intolerancia: '',
        medicamentos: '',
        rotina: '',
        anotacoes_privadas: '',
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao cadastrar o paciente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Novo Paciente</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Nome completo do paciente"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sexo">Sexo</Label>
                  <Select onValueChange={(value) => handleInputChange('sexo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => handleInputChange('telefone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  placeholder="Endereço completo"
                />
              </div>
            </div>

            {/* Informações Profissionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informações Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profissao">Profissão</Label>
                  <Input
                    id="profissao"
                    value={formData.profissao}
                    onChange={(e) => handleInputChange('profissao', e.target.value)}
                    placeholder="Profissão do paciente"
                  />
                </div>
                <div>
                  <Label htmlFor="objetivo">Objetivo</Label>
                  <Input
                    id="objetivo"
                    value={formData.objetivo}
                    onChange={(e) => handleInputChange('objetivo', e.target.value)}
                    placeholder="Ex: Emagrecimento, ganho de massa..."
                  />
                </div>
              </div>
            </div>

            {/* Informações de Saúde */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Informações de Saúde</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="historico_clinico">Histórico Clínico</Label>
                  <Textarea
                    id="historico_clinico"
                    value={formData.historico_clinico}
                    onChange={(e) => handleInputChange('historico_clinico', e.target.value)}
                    placeholder="Doenças, cirurgias, condições médicas..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="alergias_intolerancia">Alergias e Intolerâncias</Label>
                  <Textarea
                    id="alergias_intolerancia"
                    value={formData.alergias_intolerancia}
                    onChange={(e) => handleInputChange('alergias_intolerancia', e.target.value)}
                    placeholder="Alergias alimentares, intolerâncias..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="medicamentos">Medicamentos</Label>
                  <Textarea
                    id="medicamentos"
                    value={formData.medicamentos}
                    onChange={(e) => handleInputChange('medicamentos', e.target.value)}
                    placeholder="Medicamentos em uso..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Estilo de Vida */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Estilo de Vida</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="habitos_alimentares">Hábitos Alimentares</Label>
                  <Textarea
                    id="habitos_alimentares"
                    value={formData.habitos_alimentares}
                    onChange={(e) => handleInputChange('habitos_alimentares', e.target.value)}
                    placeholder="Preferências, restrições, horários de refeição..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="rotina">Rotina</Label>
                  <Textarea
                    id="rotina"
                    value={formData.rotina}
                    onChange={(e) => handleInputChange('rotina', e.target.value)}
                    placeholder="Horários de trabalho, exercícios, sono..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="anotacoes_privadas">Anotações Privadas</Label>
                  <Textarea
                    id="anotacoes_privadas"
                    value={formData.anotacoes_privadas}
                    onChange={(e) => handleInputChange('anotacoes_privadas', e.target.value)}
                    placeholder="Observações internas..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? 'Salvando...' : 'Salvar Paciente'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
