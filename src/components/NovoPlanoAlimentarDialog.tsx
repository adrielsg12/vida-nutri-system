
import React, { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Paciente {
  id: string;
  nome: string;
  email?: string;
}

interface NovoPlanoAlimentarDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pacientes: Paciente[];
  pacienteSelecionado?: string;
}

export const NovoPlanoAlimentarDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  pacientes,
  pacienteSelecionado 
}: NovoPlanoAlimentarDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    paciente_id: pacienteSelecionado || '',
    data_inicio: '',
    data_fim: '',
    status: 'ativo'
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.titulo || !formData.paciente_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      console.log('Criando plano com dados:', formData);
      
      const { data, error } = await supabase
        .from('planos_alimentares')
        .insert({
          titulo: formData.titulo,
          descricao: formData.descricao,
          paciente_id: formData.paciente_id,
          nutricionista_id: user.id,
          data_inicio: formData.data_inicio || null,
          data_fim: formData.data_fim || null,
          status: formData.status
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar plano:', error);
        throw error;
      }

      console.log('Plano criado com sucesso:', data);

      toast({
        title: "Sucesso",
        description: "Plano alimentar criado com sucesso!",
      });

      // Reset form
      setFormData({
        titulo: '',
        descricao: '',
        paciente_id: pacienteSelecionado || '',
        data_inicio: '',
        data_fim: '',
        status: 'ativo'
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar plano alimentar. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Plano Alimentar</DialogTitle>
          <DialogDescription>
            Crie um novo plano alimentar para o paciente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Plano *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleInputChange('titulo', e.target.value)}
              placeholder="Ex: Plano para emagrecimento"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paciente">Paciente *</Label>
            <Select 
              value={formData.paciente_id} 
              onValueChange={(value) => handleInputChange('paciente_id', value)}
              disabled={!!pacienteSelecionado}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((paciente) => (
                  <SelectItem key={paciente.id} value={paciente.id}>
                    {paciente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descreva os objetivos do plano..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => handleInputChange('data_inicio', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) => handleInputChange('data_fim', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Criando...' : 'Criar Plano'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
