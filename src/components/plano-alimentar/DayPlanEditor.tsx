import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { ItemPlano } from '@/components/PlanoAlimentarFormDialog';
import { Alimento } from '@/hooks/useAlimentosList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REFEICOES } from '@/hooks/usePlanoAlimentarForm';

interface DayPlanEditorProps {
  dia: string;
  diaIdx: number;
  items: ItemPlano[];
  alimentos: Alimento[];
  onItemChange: (idx: number, field: keyof ItemPlano, value: any) => void;
  onAddItem: (itemDefault: Partial<ItemPlano>) => void;
  onRemoveItem: (idx: number) => void;
  itens_plano_alimentar: ItemPlano[];
}

export const DayPlanEditor: React.FC<DayPlanEditorProps> = ({
  dia,
  diaIdx,
  items,
  alimentos,
  onItemChange,
  onAddItem,
  onRemoveItem,
  itens_plano_alimentar,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleAddRefeicao = () => {
    onAddItem({ dia_semana: diaIdx });
  };

  const getItemIndex = (item: ItemPlano) => {
    return itens_plano_alimentar.findIndex(i => i === item);
  };

  if (!isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{dia}</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhuma refeição cadastrada para este dia.</p>
          ) : (
            <div className="space-y-2">
              {REFEICOES.map((refeicao) => {
                const refeicaoItems = items.filter(item => item.refeicao === refeicao);
                if (refeicaoItems.length === 0) return null;
                
                return (
                  <div key={refeicao} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2">{refeicao}</h4>
                    <div className="space-y-1">
                      {refeicaoItems.map((item) => {
                        const alimento = alimentos.find(a => a.id === item.alimento_id);
                        return (
                          <div key={getItemIndex(item)} className="flex items-center justify-between text-sm">
                            <span>
                              {alimento?.nome || 'Alimento não encontrado'} - {item.quantidade}{item.unidade_medida}
                            </span>
                            {item.horario_recomendado && (
                              <Badge variant="outline" className="text-xs">
                                {item.horario_recomendado}
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{dia}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm mb-3">Nenhuma refeição cadastrada para este dia.</p>
            <Button onClick={handleAddRefeicao} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Refeição
            </Button>
          </div>
        ) : (
          <>
            {items.map((item) => {
              const idx = getItemIndex(item);
              const alimento = alimentos.find(a => a.id === item.alimento_id);
              
              return (
                <div key={idx} className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`refeicao-${idx}`} className="text-sm font-medium">
                        Refeição
                      </Label>
                      <Select
                        value={item.refeicao}
                        onValueChange={v => onItemChange(idx, "refeicao", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a refeição" />
                        </SelectTrigger>
                        <SelectContent>
                          {REFEICOES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`alimento-${idx}`} className="text-sm font-medium">
                        Alimento
                      </Label>
                      <Select
                        value={item.alimento_id}
                        onValueChange={v => onItemChange(idx, "alimento_id", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o alimento" />
                        </SelectTrigger>
                        <SelectContent>
                          {alimentos.map(alimento => (
                            <SelectItem key={alimento.id} value={alimento.id}>
                              {alimento.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor={`quantidade-${idx}`} className="text-sm font-medium">
                        Quantidade
                      </Label>
                      <Input
                        id={`quantidade-${idx}`}
                        type="number"
                        value={item.quantidade}
                        min={0}
                        onChange={e => onItemChange(idx, "quantidade", Number(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`unidade-${idx}`} className="text-sm font-medium">
                        Unidade
                      </Label>
                      <Input
                        id={`unidade-${idx}`}
                        value={item.unidade_medida}
                        onChange={e => onItemChange(idx, "unidade_medida", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`horario-${idx}`} className="text-sm font-medium">
                        Horário
                      </Label>
                      <Input
                        id={`horario-${idx}`}
                        type="time"
                        value={item.horario_recomendado || ""}
                        onChange={e => onItemChange(idx, "horario_recomendado", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`observacoes-${idx}`} className="text-sm font-medium">
                      Observações
                    </Label>
                    <Textarea
                      id={`observacoes-${idx}`}
                      value={item.observacoes || ""}
                      onChange={e => onItemChange(idx, "observacoes", e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemoveItem(idx)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              );
            })}
            
            <div className="text-center pt-2">
              <Button onClick={handleAddRefeicao} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Refeição
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};