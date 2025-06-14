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
  email?: string; // Added email
  telefone?: string;
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
        .select('id, nome, email, telefone') // Now fetch email too
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

  // Função para envio do email por Edge Function
  const sendConfirmationEmail = async () => {
    // Busca o paciente selecionado
    const selectedPatient = patients.find(p => p.id === formData.paciente_id);
    if (!selectedPatient) {
      toast({ title: "Erro", description: "Selecione o paciente antes de enviar.", variant: "destructive" });
      return;
    }
    if (!formData.data || !formData.hora) {
      toast({ title: "Erro", description: "Informe data e horário.", variant: "destructive" });
      return;
    }
    if (!selectedPatient.email) {
      toast({ title: "Erro", description: "Paciente não possui e-mail cadastrado.", variant: "destructive" });
      return;
    }

    // Monta os dados
    const dataToSend = {
      to: selectedPatient.email,
      name: selectedPatient.nome,
      date: new Date(formData.data).toLocaleDateString("pt-BR"),
      time: formData.hora,
      type: formData.tipo,
      value: formData.valor,
      notes: formData.observacoes || ""
    };

    try {
      toast({ title: "Enviando...", description: "Enviando confirmação para o paciente..." });

      // Utilize o método do supabase client
      const { data, error } = await supabase.functions.invoke('send-consultation-confirmation', {
        body: dataToSend,
      });

      if (error) {
        throw new Error(error.message || "Não foi possível enviar o e-mail.");
      }

      // Sucesso (o backend sempre retorna {success: true} em caso de sucesso)
      if (data && data.success) {
        toast({ title: "Confirmação enviada!", description: "Paciente recebeu o e-mail de confirmação." });
      } else {
        throw new Error((data && data.error) || "Não foi possível enviar o e-mail.");
      }

    } catch (err: any) {
      toast({ title: "Erro!", description: err.message || "Não foi possível enviar o e-mail.", variant: "destructive" });
    }
  };

  // Buscar paciente selecionado com telefone
  const selectedPatient = patients.find(p => p.id === formData.paciente_id);

  // Função para formatar o texto da confirmação
  const formatConsultaToWhatsapp = () => {
    const dataBR = formData.data ? new Date(formData.data).toLocaleDateString("pt-BR") : '';
    let txt = `Olá${selectedPatient ? `, ${selectedPatient.nome}` : ''}! Sua consulta está confirmada para ${dataBR} às ${formData.hora}.`;
    txt += `\nTipo: ${formData.tipo === 'presencial' ? 'Presencial' : 'Online'}`;
    if (formData.valor) txt += `\nValor: R$ ${formData.valor}`;
    if (formData.observacoes) txt += `\nObs: ${formData.observacoes}`;
    txt += "\nQualquer dúvida, estou à disposição!";
    return txt;
  };

  // Função para abrir whatsapp com mensagem de confirmação
  const handleEnviarConfirmacaoWhatsapp = () => {
    if (!selectedPatient || !selectedPatient.telefone) {
      toast({
        title: "Telefone não encontrado",
        description: "Selecione o paciente e cadastre um telefone válido.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.data || !formData.hora) {
      toast({
        title: "Data/hora faltando",
        description: "Informe a data e hora da consulta.",
        variant: "destructive",
      });
      return;
    }
    const telefone = selectedPatient.telefone.replace(/\D/g, '');
    const mensagem = encodeURIComponent(formatConsultaToWhatsapp());
    const url = `https://wa.me/55${telefone}?text=${mensagem}`;
    window.open(url, '_blank');
    toast({
      title: "WhatsApp Aberto",
      description: "O WhatsApp Web foi aberto em uma nova aba.",
    });
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
            <Button 
              type="button"
              variant="secondary"
              onClick={sendConfirmationEmail}
              disabled={!formData.paciente_id || !formData.data || !formData.hora}
            >
              Enviar Confirmação ao Paciente (E-mail)
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleEnviarConfirmacaoWhatsapp}
              disabled={!formData.paciente_id || !formData.data || !formData.hora}
            >
              Enviar Confirmação via WhatsApp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
