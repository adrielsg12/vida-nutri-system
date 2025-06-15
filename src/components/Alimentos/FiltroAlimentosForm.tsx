
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
          <Label htmlFor="nome">Nome do Alimento</Label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="nome"
              placeholder="Buscar por nome..."
              value={filtros.nome}
              onChange={(e) => onFiltroChange('nome', e.target.value)}
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
          <Label htmlFor="proteinaMin">Proteína (g) Mín</Label>
          <Input
            id="proteinaMin"
            type="number"
            value={filtros.proteinaMin}
            onChange={(e) => onFiltroChange('proteinaMin', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="proteinaMax">Proteína (g) Máx</Label>
          <Input
            id="proteinaMax"
            type="number"
            value={filtros.proteinaMax}
            onChange={(e) => onFiltroChange('proteinaMax', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label>Lipídeos (g)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filtros.lipideosMin}
              onChange={(e) => onFiltroChange('lipideosMin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={filtros.lipideosMax}
              onChange={(e) => onFiltroChange('lipideosMax', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Carboidrato (g)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filtros.carboidratoMin}
              onChange={(e) => onFiltroChange('carboidratoMin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={filtros.carboidratoMax}
              onChange={(e) => onFiltroChange('carboidratoMax', e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Energia (kcal)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filtros.energiaKcalMin}
              onChange={(e) => onFiltroChange('energiaKcalMin', e.target.value)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={filtros.energiaKcalMax}
              onChange={(e) => onFiltroChange('energiaKcalMax', e.target.value)}
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
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="proteina">Mais Proteína</SelectItem>
                <SelectItem value="lipideos">Mais Gordura</SelectItem>
                <SelectItem value="carboidrato">Mais Carboidrato</SelectItem>
                <SelectItem value="energia_kcal">Mais Calorias</SelectItem>
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
