
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  nome: string;
}

interface Pagamento {
  id: string;
  paciente_id: string;
  valor: number;
  data_pagamento: string;
  forma_pagamento: string;
  status: 'pago' | 'pendente' | 'cancelado';
  observacoes: string;
}

interface EditarPagamentoDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pagamento: Pagamento | null;
}

export const EditarPagamentoDialog = ({ open, onClose, onSuccess, pagamento }: EditarPagamentoDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    paciente_id: '',
    valor: '',
    data_pagamento: '',
    forma_pagamento: '',
    status: 'pago' as 'pago' | 'pendente' | 'cancelado',
    observacoes: ''
  });
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome')
        .eq('nutricionista_id', user.id)
        .eq('status', 'ativo')
        .order('nome');

      if (error) {
        console.error('Erro ao buscar pacientes:', error);
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPatients();
      if (pagamento) {
        setFormData({
          paciente_id: pagamento.paciente_id,
          valor: pagamento.valor.toString(),
          data_pagamento: pagamento.data_pagamento,
          forma_pagamento: pagamento.forma_pagamento,
          status: pagamento.status,
          observacoes: pagamento.observacoes || ''
        });
      }
    }
  }, [open, pagamento]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!pagamento || !formData.paciente_id || !formData.valor || !formData.forma_pagamento) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha paciente, valor e forma de pagamento.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('pagamentos')
        .update({
          paciente_id: formData.paciente_id,
          valor: parseFloat(formData.valor),
          data_pagamento: formData.data_pagamento,
          forma_pagamento: formData.forma_pagamento,
          status: formData.status,
          observacoes: formData.observacoes || null
        })
        .eq('id', pagamento.id);

      if (error) {
        console.error('Erro ao editar pagamento:', error);
        toast({
          title: "Erro ao editar pagamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Pagamento editado",
        description: "O pagamento foi editado com sucesso.",
      });

      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao editar o pagamento.",
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
          <DialogTitle>Editar Pagamento</DialogTitle>
          <DialogDescription>
            Edite as informações do pagamento.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data do Pagamento</Label>
              <Input
                id="data"
                type="date"
                value={formData.data_pagamento}
                onChange={(e) => setFormData({...formData, data_pagamento: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
            <Select 
              value={formData.forma_pagamento} 
              onValueChange={(value) => setFormData({...formData, forma_pagamento: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'pago' | 'pendente' | 'cancelado') => setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações sobre o pagamento..."
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
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
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
