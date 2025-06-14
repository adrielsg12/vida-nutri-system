
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemPlano } from "@/components/PlanoAlimentarFormDialog";
import { Alimento } from "@/hooks/useAlimentosList";
import { DIAS, REFEICOES } from "@/hooks/usePlanoAlimentarForm";

interface PlanoAlimentarTableProps {
  alimentos: Alimento[];
  alimentoSearch: string[];
  setAlimentoSearch: (arr: string[]) => void;
  itens_plano_alimentar: ItemPlano[];
  getItemsByDay: (dayIdx: number) => ItemPlano[];
  handleItemChange: (idx: number, field: keyof ItemPlano, value: any) => void;
  handleAddItem: (itemDefault: Partial<ItemPlano>) => void;
  handleRemoveItem: (idx: number) => void;
}

const filterAlimentos = (alimentos: Alimento[], search: string) => {
  return !search
    ? alimentos
    : alimentos.filter(a => a.nome.toLowerCase().includes(search.toLowerCase()));
};

export const PlanoAlimentarTable: React.FC<PlanoAlimentarTableProps> = ({
  alimentos,
  alimentoSearch,
  setAlimentoSearch,
  itens_plano_alimentar,
  getItemsByDay,
  handleItemChange,
  handleAddItem,
  handleRemoveItem,
}) => (
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
                      onClick={() => handleAddItem({ dia_semana: diaIdx })}
                    >
                      + Adicionar Alimento nesse dia
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, idxItem) => {
                  const idx = itens_plano_alimentar.findIndex(i => i === item);
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
                                  const next = [...alimentoSearch];
                                  next[diaIdx] = e.target.value;
                                  setAlimentoSearch(next);
                                }}
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                            {filterAlimentos(alimentos, alimentoSearch[diaIdx]).map(alimento =>
                              <SelectItem key={alimento.id} value={alimento.id}>
                                {alimento.nome}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
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
);
