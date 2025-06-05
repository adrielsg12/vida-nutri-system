
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

interface NovoPagamentoDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NovoPagamentoDialog = ({ open, onClose, onSuccess }: NovoPagamentoDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    paciente_id: '',
    valor: '',
    data_pagamento: new Date().toISOString().split('T')[0],
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
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para registrar pagamentos.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.paciente_id || !formData.valor || !formData.forma_pagamento) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha paciente, valor e forma de pagamento.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('pagamentos')
        .insert({
          nutricionista_id: user.id,
          paciente_id: formData.paciente_id,
          valor: parseFloat(formData.valor),
          data_pagamento: formData.data_pagamento,
          forma_pagamento: formData.forma_pagamento,
          status: formData.status,
          observacoes: formData.observacoes || null
        });

      if (error) {
        console.error('Erro ao registrar pagamento:', error);
        toast({
          title: "Erro ao registrar pagamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Pagamento registrado",
        description: "O pagamento foi registrado com sucesso.",
      });

      setFormData({
        paciente_id: '',
        valor: '',
        data_pagamento: new Date().toISOString().split('T')[0],
        forma_pagamento: '',
        status: 'pago',
        observacoes: ''
      });

      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao registrar o pagamento.",
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
          <DialogTitle>Registrar Novo Pagamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar um novo pagamento.
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
              {loading ? 'Registrando...' : 'Registrar Pagamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
