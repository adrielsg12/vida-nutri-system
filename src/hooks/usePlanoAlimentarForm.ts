
import { useState } from "react";
import { PlanoFull, ItemPlano } from "@/components/PlanoAlimentarFormDialog"; // Reusing existing types for now

export const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
export const REFEICOES = [
  "Café da manhã",
  "Lanche da manhã",
  "Almoço",
  "Lanche da tarde", 
  "Jantar",
  "Ceia",
  "Lanche da noite",
  "Pré-treino",
  "Pós-treino",
  "Colação"
];

export function usePlanoAlimentarForm(plano: PlanoFull) {
  const [formData, setFormData] = useState<PlanoFull>({
    ...plano,
    itens_plano_alimentar: plano.itens_plano_alimentar.map(i => ({ ...i }))
  });

  const [saving, setSaving] = useState(false);

  const updateFormValue = (key: keyof PlanoFull, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  };

  const handleItemChange = (idx: number, field: keyof ItemPlano, value: any) => {
    setFormData(prev => ({
      ...prev,
      itens_plano_alimentar: prev.itens_plano_alimentar.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddItem = (itemDefault: Partial<ItemPlano> = {}) => {
    setFormData(prev => ({
      ...prev,
      itens_plano_alimentar: [
        ...prev.itens_plano_alimentar,
        {
          dia_semana: 0,
          refeicao: REFEICOES[0],
          quantidade: 100,
          unidade_medida: 'g',
          alimento_id: "",
          horario_recomendado: "",
          observacoes: "",
          ...itemDefault,
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

  const getItemsByDay = (dayIdx: number) =>
    formData.itens_plano_alimentar.filter(item => item.dia_semana === dayIdx);

  return {
    formData,
    setFormData,
    saving,
    setSaving,
    updateFormValue,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    getItemsByDay,
  };
}
