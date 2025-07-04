import React from 'react';
import { DayPlanEditor } from './DayPlanEditor';
import { ItemPlano } from '@/components/PlanoAlimentarFormDialog';
import { Alimento } from '@/hooks/useAlimentosList';
import { DIAS } from '@/hooks/usePlanoAlimentarForm';

interface DayBasedPlanoEditorProps {
  alimentos: Alimento[];
  itens_plano_alimentar: ItemPlano[];
  getItemsByDay: (dayIdx: number) => ItemPlano[];
  handleItemChange: (idx: number, field: keyof ItemPlano, value: any) => void;
  handleAddItem: (itemDefault: Partial<ItemPlano>) => void;
  handleRemoveItem: (idx: number) => void;
}

export const DayBasedPlanoEditor: React.FC<DayBasedPlanoEditorProps> = ({
  alimentos,
  itens_plano_alimentar,
  getItemsByDay,
  handleItemChange,
  handleAddItem,
  handleRemoveItem,
}) => {
  return (
    <div className="space-y-4">
      {DIAS.map((dia, diaIdx) => {
        const items = getItemsByDay(diaIdx);
        
        return (
          <DayPlanEditor
            key={diaIdx}
            dia={dia}
            diaIdx={diaIdx}
            items={items}
            alimentos={alimentos}
            onItemChange={handleItemChange}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            itens_plano_alimentar={itens_plano_alimentar}
          />
        );
      })}
    </div>
  );
};