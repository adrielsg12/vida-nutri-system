
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

interface NovaConsultaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NovaConsultaDialog = ({ open, onClose, onSuccess }: NovaConsultaDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState({
    paciente_id: '',
    data: '',
    hora: '',
    tipo: 'presencial' as 'presencial' | 'online',
    valor: '',
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
          description: "Você precisa estar logado para agendar consultas.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.paciente_id || !formData.data || !formData.hora) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha paciente, data e hora da consulta.",
          variant: "destructive",
        });
        return;
      }

      const dataHora = `${formData.data}T${formData.hora}:00`;

      const { error } = await supabase
        .from('consultas')
        .insert({
          nutricionista_id: user.id,
          paciente_id: formData.paciente_id,
          data_hora: dataHora,
          tipo: formData.tipo,
          valor: formData.valor ? parseFloat(formData.valor) : null,
          observacoes: formData.observacoes || null,
          status: 'agendada'
        });

      if (error) {
        console.error('Erro ao agendar consulta:', error);
        toast({
          title: "Erro ao agendar consulta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Consulta agendada",
        description: "A consulta foi agendada com sucesso.",
      });

      setFormData({
        paciente_id: '',
        data: '',
        hora: '',
        tipo: 'presencial',
        valor: '',
        observacoes: ''
      });

      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao agendar a consulta.",
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
          <DialogTitle>Agendar Nova Consulta</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar uma nova consulta.
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
              <Label htmlFor="data">Data *</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora *</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({...formData, hora: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Consulta</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value: 'presencial' | 'online') => setFormData({...formData, tipo: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presencial">Presencial</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
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
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações sobre a consulta..."
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
              {loading ? 'Agendando...' : 'Agendar Consulta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
