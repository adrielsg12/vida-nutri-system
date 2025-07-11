
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search, ArrowUp, ArrowDown } from "lucide-react";
import { OrderableField, FiltrosAlimento } from "@/hooks/usePesquisaAlimentos";

interface FiltroAlimentosFormProps {
  filtros: FiltrosAlimento;
  categorias: string[];
  ordenarPor: OrderableField;
  ordemAsc: boolean;
  onFiltroChange: (field: keyof FiltrosAlimento, value: string) => void;
  onLimparFiltros: () => void;
  onOrdenarPor: (value: OrderableField) => void;
  onOrdemAsc: () => void;
  onAplicarFiltros: () => void;
}

export function FiltroAlimentosForm({
  filtros,
  categorias,
  ordenarPor,
  ordemAsc,
  onFiltroChange,
  onLimparFiltros,
  onOrdenarPor,
  onOrdemAsc,
  onAplicarFiltros,
}: FiltroAlimentosFormProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="descricao">Descrição do Alimento</Label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="descricao"
              placeholder="Buscar por descrição..."
              value={filtros.descricao}
              onChange={(e) => onFiltroChange('descricao', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select value={filtros.categoria} onValueChange={(v) => onFiltroChange('categoria', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as categorias</SelectItem>
              {categorias.map((c) =>
                c ? (
                  <SelectItem value={c} key={c}>
                    {c}
                  </SelectItem>
                ) : null
              )}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="saturadosMin">Saturados (g) Mín</Label>
          <Input
            id="saturadosMin"
            type="number"
            value={filtros.saturadosMin}
            onChange={(e) => onFiltroChange('saturadosMin', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="saturadosMax">Saturados (g) Máx</Label>
          <Input
            id="saturadosMax"
            type="number"
            value={filtros.saturadosMax}
            onChange={(e) => onFiltroChange('saturadosMax', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label>Mono-insaturados (g)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filtros.monoinsaturadosMin}
              onChange={(e) => onFiltroChange('monoinsaturadosMin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={filtros.monoinsaturadosMax}
              onChange={(e) => onFiltroChange('monoinsaturadosMax', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Poli-insaturados (g)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filtros.poliinsaturadosMin}
              onChange={(e) => onFiltroChange('poliinsaturadosMin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={filtros.poliinsaturadosMax}
              onChange={(e) => onFiltroChange('poliinsaturadosMax', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Ordenar por</Label>
          <div className="flex gap-2 items-center">
            <Select value={ordenarPor} onValueChange={(v: any) => onOrdenarPor(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Descrição dos alimentos">Descrição</SelectItem>
                <SelectItem value="Categoria do alimento">Categoria</SelectItem>
                <SelectItem value="Saturados (g)">Saturados</SelectItem>
                <SelectItem value="Mono-insaturados (g)">Mono-insaturados</SelectItem>
                <SelectItem value="Poli-insaturados (g)">Poli-insaturados</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOrdemAsc}
              className="ml-2"
              title="Alternar ordem"
            >
              {ordemAsc ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onAplicarFiltros} className="bg-emerald-600 hover:bg-emerald-700">
          Aplicar Filtros
        </Button>
        <Button onClick={onLimparFiltros} variant="outline">
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}
