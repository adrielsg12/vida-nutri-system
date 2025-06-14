
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Paciente {
  id: string;
  nome: string;
  email?: string;
}

interface EditarPlanoAlimentarDialogProps {
  open: boolean;
  onClose: () => void;
  plano: {
    id: string;
    titulo: string;
    descricao?: string;
    paciente_id: string;
    data_inicio?: string;
    data_fim?: string;
    status: string;
  };
  pacientes: Paciente[];
  onSuccess: () => void;
}

export const EditarPlanoAlimentarDialog = ({
  open,
  onClose,
  plano,
  pacientes,
  onSuccess,
}: EditarPlanoAlimentarDialogProps) => {
  const [formData, setFormData] = useState({ ...plano });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) setFormData({ ...plano });
  }, [open, plano]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.titulo || !formData.paciente_id) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("planos_alimentares")
        .update({
          titulo: formData.titulo,
          descricao: formData.descricao,
          paciente_id: formData.paciente_id,
          data_inicio: formData.data_inicio || null,
          data_fim: formData.data_fim || null,
          status: formData.status,
        })
        .eq("id", plano.id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Plano atualizado com sucesso!" });
      onClose();
      onSuccess();
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o plano.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Plano Alimentar</DialogTitle>
          <DialogDescription>Altere as informações do plano alimentar</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => handleInputChange("titulo", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paciente">Paciente *</Label>
            <Select
              value={formData.paciente_id}
              onValueChange={(v) => handleInputChange("paciente_id", v)}
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
              value={formData.descricao || ""}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio || ""}
                onChange={(e) => handleInputChange("data_inicio", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim || ""}
                onChange={(e) => handleInputChange("data_fim", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => handleInputChange("status", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="pausado">Pausado</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
