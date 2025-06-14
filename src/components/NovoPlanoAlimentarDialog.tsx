
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
}

interface NovoPlanoAlimentarDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pacientes: Paciente[];
}

export const NovoPlanoAlimentarDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  pacientes 
}: NovoPlanoAlimentarDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    paciente_id: '',
    data_inicio: '',
    data_fim: '',
    descricao: ''
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      if (!formData.titulo || !formData.paciente_id) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha título e selecione um paciente.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('planos_alimentares')
        .insert({
          nutricionista_id: user.id,
          paciente_id: formData.paciente_id,
          titulo: formData.titulo,
          descricao: formData.descricao || null,
          data_inicio: formData.data_inicio || null,
          data_fim: formData.data_fim || null,
          status: 'ativo'
        });

      if (error) {
        console.error('Erro ao criar plano:', error);
        toast({
          title: "Erro ao criar plano",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Plano criado",
        description: "O plano alimentar foi criado com sucesso.",
      });

      setFormData({
        titulo: '',
        paciente_id: '',
        data_inicio: '',
        data_fim: '',
        descricao: ''
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar o plano alimentar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Plano Alimentar</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo plano alimentar.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Plano *</Label>
            <Input
              id="titulo"
              placeholder="Ex: Plano de Emagrecimento - Janeiro 2024"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paciente">Paciente *</Label>
            <Select 
              value={formData.paciente_id} 
              onValueChange={(value) => setFormData({...formData, paciente_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um paciente" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                min={formData.data_inicio}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição opcional do plano alimentar..."
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            />
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
