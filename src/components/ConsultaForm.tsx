
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { usePacientesList, Paciente } from "@/hooks/usePacientesList";
import { useSendWhatsappConfirmation } from "@/hooks/useSendWhatsappConfirmation";
import { useSendEmailConfirmation } from "@/hooks/useSendEmailConfirmation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConsultaFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export const ConsultaForm = ({ open, onClose, onSuccess }: ConsultaFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paciente_id: '',
    data: '',
    hora: '',
    tipo: 'presencial' as 'presencial' | 'online',
    valor: '',
    observacoes: ''
  });
  const { patients } = usePacientesList(open);
  const { toast } = useToast();
  const sendWhatsapp = useSendWhatsappConfirmation();
  const sendEmail = useSendEmailConfirmation();

  const selectedPatient = patients.find(p => p.id === formData.paciente_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: "Erro de autenticação", description: "Você precisa estar logado para agendar consultas.", variant: "destructive" });
        return;
      }
      if (!formData.paciente_id || !formData.data || !formData.hora) {
        toast({ title: "Campos obrigatórios", description: "Preencha paciente, data e hora da consulta.", variant: "destructive" });
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
        toast({ title: "Erro ao agendar consulta", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Consulta agendada", description: "A consulta foi agendada com sucesso." });
      setFormData({ paciente_id: '', data: '', hora: '', tipo: 'presencial', valor: '', observacoes: '' });
      onSuccess();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({ title: "Erro inesperado", description: "Ocorreu um erro ao agendar a consulta.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Paciente *</Label>
        <Select
          value={formData.paciente_id}
          onValueChange={(value) => setFormData({ ...formData, paciente_id: value })}
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
          <Label>Data *</Label>
          <Input
            type="date"
            value={formData.data}
            onChange={e => setFormData({ ...formData, data: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="space-y-2">
          <Label>Hora *</Label>
          <Input
            type="time"
            value={formData.hora}
            onChange={e => setFormData({ ...formData, hora: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tipo de Consulta</Label>
        <Select
          value={formData.tipo}
          onValueChange={(value: 'presencial' | 'online') => setFormData({ ...formData, tipo: value })}
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
        <Label>Valor (R$)</Label>
        <Input
          type="number"
          step="0.01"
          placeholder="0,00"
          value={formData.valor}
          onChange={e => setFormData({ ...formData, valor: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Observações</Label>
        <Textarea
          placeholder="Observações sobre a consulta..."
          value={formData.observacoes}
          onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
          {loading ? "Agendando..." : "Agendar Consulta"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            sendEmail({
              paciente: selectedPatient,
              data: formData.data,
              hora: formData.hora,
              tipo: formData.tipo,
              valor: formData.valor,
              observacoes: formData.observacoes
            })
          }
          disabled={!formData.paciente_id || !formData.data || !formData.hora}
        >
          Enviar Confirmação ao Paciente (E-mail)
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            sendWhatsapp({
              paciente: selectedPatient,
              data: formData.data,
              hora: formData.hora,
              tipo: formData.tipo,
              valor: formData.valor,
              observacoes: formData.observacoes
            })
          }
          disabled={!formData.paciente_id || !formData.data || !formData.hora}
        >
          Enviar Confirmação via WhatsApp
        </Button>
      </div>
    </form>
  );
};
