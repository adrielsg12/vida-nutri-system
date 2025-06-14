
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAlimentosList } from "@/hooks/useAlimentosList";
import { useToast } from "@/hooks/use-toast";
import { usePlanoAlimentarForm, DIAS } from "@/hooks/usePlanoAlimentarForm";
import { PlanoAlimentarTable } from "./plano-alimentar/PlanoAlimentarTable";
import { WhatsappButton } from "./plano-alimentar/WhatsappButton";
import { supabase } from "@/integrations/supabase/client";

// Types
export interface Paciente {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
}
export interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida: string;
}
export interface ItemPlano {
  id?: string;
  dia_semana: number;
  refeicao: string;
  quantidade: number;
  unidade_medida: string;
  alimento_id: string;
  horario_recomendado?: string;
  observacoes?: string;
}
export interface PlanoFull {
  id: string;
  titulo: string;
  descricao?: string;
  paciente_id: string;
  data_inicio?: string;
  data_fim?: string;
  status: string;
  itens_plano_alimentar: ItemPlano[];
}

interface PlanoAlimentarFormDialogProps {
  open: boolean;
  onClose: () => void;
  plano: PlanoFull;
  pacientes: Paciente[];
  onSuccess: () => void;
}

export const PlanoAlimentarFormDialog = ({
  open,
  onClose,
  plano,
  pacientes,
  onSuccess,
}: PlanoAlimentarFormDialogProps) => {
  // Alimentos fetch
  const { alimentos } = useAlimentosList(open);
  const { formData, setFormData, saving, setSaving, updateFormValue, handleItemChange, handleAddItem, handleRemoveItem, getItemsByDay } = usePlanoAlimentarForm(plano);
  const [alimentoSearch, setAlimentoSearch] = useState<string[]>(DIAS.map(() => ""));
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setFormData({
        ...plano,
        itens_plano_alimentar: plano.itens_plano_alimentar.map(i => ({ ...i })),
      });
      setAlimentoSearch(DIAS.map(() => ""));
    }
    // eslint-disable-next-line
  }, [open, plano]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error: planoError } = await supabase
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

    if (planoError) {
      toast({ title: "Erro", description: "Erro ao salvar plano.", variant: "destructive" });
      setSaving(false); return;
    }

    // Remove e re-insere todos os itens
    const { error: removeError } = await supabase
      .from("itens_plano_alimentar")
      .delete()
      .eq("plano_id", plano.id);

    if (removeError) {
      toast({ title: "Erro", description: "Erro ao atualizar os itens do plano.", variant: "destructive" });
      setSaving(false); return;
    }
    const itensToInsert = formData.itens_plano_alimentar.map(item => ({
      ...item,
      plano_id: plano.id
    }));

    if (itensToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("itens_plano_alimentar")
        .insert(itensToInsert);

      if (insertError) {
        toast({ title: "Erro", description: "Erro ao inserir novos itens.", variant: "destructive" });
        setSaving(false); return;
      }
    }
    toast({ title: "Sucesso", description: "Plano alimentar atualizado!" });
    setSaving(false);
    onSuccess();
    onClose();
  };

  const paciente = pacientes.find(p => p.id === formData.paciente_id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Plano Alimentar Completo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={e => updateFormValue("titulo", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="paciente">Paciente *</Label>
              <Select
                value={formData.paciente_id}
                onValueChange={v => updateFormValue("paciente_id", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((p) =>
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao || ""}
              onChange={e => updateFormValue("descricao", e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio || ""}
                onChange={e => updateFormValue("data_inicio", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim || ""}
                onChange={e => updateFormValue("data_fim", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={v => updateFormValue("status", v)}
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
          <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
            <h3 className="font-bold">Itens do Plano Alimentar</h3>
            <div className="flex gap-2">
              <WhatsappButton
                paciente={paciente}
                formData={formData}
                alimentos={alimentos}
              />
              <Button type="button" variant="outline" onClick={() => handleAddItem()}>
                + Adicionar Alimento
              </Button>
            </div>
          </div>
          <PlanoAlimentarTable
            alimentos={alimentos}
            alimentoSearch={alimentoSearch}
            setAlimentoSearch={setAlimentoSearch}
            itens_plano_alimentar={formData.itens_plano_alimentar}
            getItemsByDay={getItemsByDay}
            handleItemChange={handleItemChange}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
