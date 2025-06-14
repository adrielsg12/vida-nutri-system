import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Paciente {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
}
interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida: string;
}
interface ItemPlano {
  id?: string;
  dia_semana: number;
  refeicao: string;
  quantidade: number;
  unidade_medida: string;
  alimento_id: string;
  horario_recomendado?: string;
  observacoes?: string;
}
interface PlanoFull {
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

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const REFEICOES = [
  "Café da manhã",
  "Lanche da manhã",
  "Almoço",
  "Lanche da tarde",
  "Jantar",
  "Ceia"
];

export const PlanoAlimentarFormDialog = ({
  open,
  onClose,
  plano,
  pacientes,
  onSuccess,
}: PlanoAlimentarFormDialogProps) => {
  const [formData, setFormData] = useState({
    ...plano,
    itens_plano_alimentar: plano.itens_plano_alimentar.map(i => ({...i}))
  });
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // NEW: Add filter state for alimento search
  const [alimentoSearch, setAlimentoSearch] = useState<string[]>(DIAS.map(() => ""));

  useEffect(() => {
    if (open) {
      setFormData({
        ...plano,
        itens_plano_alimentar: plano.itens_plano_alimentar.map(i => ({...i}))
      });
      carregarAlimentos();
    }
    // eslint-disable-next-line
  }, [open, plano]);

  const carregarAlimentos = async () => {
    const { data, error } = await supabase
      .from('alimentos')
      .select('id, nome, categoria, unidade_medida')
      .order('nome');
    if (!error && data) setAlimentos(data);
  };

  // NEW: helper to get items for a day
  const getItemsByDay = (dayIdx: number) => {
    return formData.itens_plano_alimentar.filter(item => item.dia_semana === dayIdx);
  };

  const updateFormValue = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  };

  const handleItemChange = (
    idx: number,
    field: keyof ItemPlano,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      itens_plano_alimentar: prev.itens_plano_alimentar.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      itens_plano_alimentar: [
        ...prev.itens_plano_alimentar,
        {
          dia_semana: 0,
          refeicao: REFEICOES[0],
          quantidade: 100,
          unidade_medida: 'g',
          alimento_id: alimentos[0]?.id || "",
          horario_recomendado: "",
          observacoes: "",
        }
      ]
    }));
  };

  const handleRemoveItem = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      itens_plano_alimentar: prev.itens_plano_alimentar.filter((_, i) => i !== idx)
    }));
  };

  // Helper to show only alimentos matching search
  const filterAlimentos = (search: string) => {
    return !search
      ? alimentos
      : alimentos.filter(a => a.nome.toLowerCase().includes(search.toLowerCase()));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // 1. Atualizar cabeçalho do plano
    const { error: planoError } = await supabase
      .from('planos_alimentares')
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

    // 2. Apagar todos itens existentes e criar de novo (mais simples e seguro)
    const { error: removeError } = await supabase
        .from("itens_plano_alimentar")
        .delete()
        .eq("plano_id", plano.id);
    if (removeError) {
      toast({ title: "Erro", description: "Erro ao atualizar os itens do plano.", variant: "destructive" });
      setSaving(false); return;
    }

    // 3. Inserir os itens (alimentos)
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

  // Helper para buscar paciente selecionado
  const paciente = pacientes.find(p => p.id === formData.paciente_id);

  // Função para formatar o plano alimentar como texto para WhatsApp
  const formatPlanoToWhatsapp = () => {
    let texto = `🍎 *Seu Plano Alimentar*\n\n`;
    if (formData.titulo) texto += `*${formData.titulo}*\n`;
    if (formData.descricao) texto += `${formData.descricao}\n\n`;

    // Se possível, organizar por dia
    texto += DIAS.map((dia, diaIdx) => {
      const items = formData.itens_plano_alimentar.filter(i => i.dia_semana === diaIdx);
      if (items.length === 0) return '';
      let str = `*${dia}:*\n`;
      str += items.map(item => {
        const alimento = alimentos.find(a => a.id === item.alimento_id);
        const alimentoNome = alimento ? alimento.nome : "Alimento";
        return `- ${item.refeicao}: ${item.quantidade} ${item.unidade_medida} de ${alimentoNome}${item.horario_recomendado ? ` às ${item.horario_recomendado}` : ''}${item.observacoes ? ` (${item.observacoes})` : ''}`;
      }).join('\n');
      return str + '\n';
    }).join('\n');
    return texto.trim();
  };

  // Função para abrir o WhatsApp do paciente com o plano
  const handleEnviarWhatsApp = () => {
    if (!paciente || !paciente.telefone) {
      toast({
        title: "Telefone não encontrado",
        description: "O paciente não possui número de telefone cadastrado.",
        variant: "destructive",
      });
      return;
    }
    const telefone = paciente.telefone.replace(/\D/g, '');
    const mensagem = encodeURIComponent(formatPlanoToWhatsapp());
    const url = `https://wa.me/55${telefone}?text=${mensagem}`;
    window.open(url, '_blank');
    toast({
      title: "WhatsApp Aberto",
      description: "O WhatsApp Web foi aberto em uma nova aba.",
    });
  };

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
              <Button
                type="button"
                variant="secondary"
                onClick={handleEnviarWhatsApp}
                disabled={!paciente || !paciente.telefone || formData.itens_plano_alimentar.length === 0}
              >
                Enviar via WhatsApp
              </Button>
              <Button type="button" variant="outline" onClick={handleAddItem}>
                + Adicionar Alimento
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dia</TableHead>
                  <TableHead>Refeição</TableHead>
                  <TableHead>Alimento</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Obs.</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DIAS.map((dia, diaIdx) => {
                  // Para cada dia, mostra uma linha "adicionar" se não houver item, senão mostra todos do dia
                  const items = getItemsByDay(diaIdx);
                  return (
                    <React.Fragment key={diaIdx}>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-400">
                            <span className="mr-2 font-semibold">{dia}</span>
                            Nenhum item cadastrado para este dia.
                            <Button
                              type="button"
                              variant="ghost"
                              className="ml-2 text-blue-600"
                              onClick={() =>
                                setFormData(prev => ({
                                  ...prev,
                                  itens_plano_alimentar: [
                                    ...prev.itens_plano_alimentar,
                                    {
                                      dia_semana: diaIdx,
                                      refeicao: REFEICOES[0],
                                      quantidade: 100,
                                      unidade_medida: 'g',
                                      alimento_id: alimentos[0]?.id || "",
                                      horario_recomendado: "",
                                      observacoes: "",
                                    }
                                  ]
                                }))
                              }
                            >
                              + Adicionar Alimento nesse dia
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((item, idxItem) => {
                          // Indice global para atualizar/remover corretamente
                          const idx = formData.itens_plano_alimentar.findIndex(i => i === item);
                          return (
                            <TableRow key={idx}>
                              <TableCell>
                                <span className="font-semibold">{dia}</span>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={item.refeicao}
                                  onValueChange={v => handleItemChange(idx, "refeicao", v)}
                                >
                                  <SelectTrigger><SelectValue placeholder="Refeição" /></SelectTrigger>
                                  <SelectContent>
                                    {REFEICOES.map((r) =>
                                      <SelectItem key={r} value={r}>{r}</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <div>
                                  {/* Campo de busca dentro do dropdown */}
                                  <Select
                                    value={item.alimento_id}
                                    onValueChange={v => handleItemChange(idx, "alimento_id", v)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Alimento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <div className="px-2 py-1 sticky top-0 z-10 bg-white">
                                        <input
                                          type="text"
                                          placeholder="Buscar alimento..."
                                          className="w-full border rounded px-2 py-1 mb-2 text-sm bg-white"
                                          value={alimentoSearch[diaIdx] || ""}
                                          onChange={e => {
                                            const newArr = [...alimentoSearch];
                                            newArr[diaIdx] = e.target.value;
                                            setAlimentoSearch(newArr);
                                          }}
                                          // Impede click fechar dropdown
                                          onClick={e => e.stopPropagation()}
                                        />
                                      </div>
                                      {filterAlimentos(alimentoSearch[diaIdx]).map(alimento =>
                                        <SelectItem key={alimento.id} value={alimento.id}>
                                          {alimento.nome}
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  value={item.quantidade}
                                  min={0}
                                  onChange={e => handleItemChange(idx, "quantidade", Number(e.target.value))}
                                  className="w-20"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.unidade_medida}
                                  onChange={e => handleItemChange(idx, "unidade_medida", e.target.value)}
                                  className="w-16"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="time"
                                  value={item.horario_recomendado || ""}
                                  onChange={e => handleItemChange(idx, "horario_recomendado", e.target.value)}
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={item.observacoes || ""}
                                  onChange={e => handleItemChange(idx, "observacoes", e.target.value)}
                                  className="w-24"
                                />
                              </TableCell>
                              <TableCell>
                                <Button type="button" variant="destructive" size="sm"
                                  onClick={() => handleRemoveItem(idx)}>
                                  Remover
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
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
