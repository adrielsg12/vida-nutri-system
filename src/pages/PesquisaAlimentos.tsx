import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, ChefHat, ArrowUp, ArrowDown } from 'lucide-react';
import { TabelaAlimentosTaco } from '@/components/Alimentos/TabelaAlimentosTaco';

interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida?: string | null;
  // Campos principais TACO
  umidade?: number | null;
  energia_kcal?: number | null;
  energia_kj?: number | null;
  proteina?: number | null;
  lipideos?: number | null;
  colesterol?: number | null;
  carboidrato?: number | null;
  fibra_alimentar?: number | null;
  cinzas?: number | null;
  calcio?: number | null;
  magnesio?: number | null;
  manganes?: number | null;
  fosforo?: number | null;
  ferro?: number | null;
  sodio?: number | null;
  potassio?: number | null;
  cobre?: number | null;
  zinco?: number | null;
  retinol?: number | null;
  re?: number | null;
  rae?: number | null;
  tiamina?: number | null;
  riboflavina?: number | null;
  piridoxina?: number | null;
  niacina?: number | null;
  vitamina_c?: number | null;
  categoria_taco?: string | null;
  codigo_taco?: string | null;

  calorias_por_100g?: number | null;
  proteinas_por_100g?: number | null;
  carboidratos_por_100g?: number | null;
  gorduras_por_100g?: number | null;
  fibras_por_100g?: number | null;
}

type OrderableField =
  | 'nome'
  | 'proteina'
  | 'lipideos'
  | 'carboidrato'
  | 'energia_kcal'
  | 'fibras_por_100g'
  | 'calorias_por_100g'
  | 'colesterol';

export const PesquisaAlimentos = () => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: '',
    proteinaMin: '',
    proteinaMax: '',
    lipideosMin: '',
    lipideosMax: '',
    carboidratoMin: '',
    carboidratoMax: '',
    energiaKcalMin: '',
    energiaKcalMax: '',
  });
  const [ordenarPor, setOrdenarPor] = useState<OrderableField>('nome');
  const [ordemAsc, setOrdemAsc] = useState(true);

  const { toast } = useToast();

  const carregarAlimentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alimentos')
        .select(`
          *
        `).order('nome');

      if (error) throw error;
      setAlimentos(data || []);
      setAlimentosFiltrados(data || []);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alimentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlimentos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line
  }, [alimentos, filtros, ordenarPor, ordemAsc]);

  const aplicarFiltros = () => {
    let filtrados = alimentos;

    // Busca por nome
    if (filtros.nome) {
      filtrados = filtrados.filter(a =>
        a.nome.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }
    // Categoria
    if (filtros.categoria) {
      filtrados = filtrados.filter(a =>
        a.categoria === filtros.categoria
      );
    }
    // Proteína
    if (filtros.proteinaMin) {
      filtrados = filtrados.filter(a =>
        (a.proteina ?? 0) >= Number(filtros.proteinaMin)
      );
    }
    if (filtros.proteinaMax) {
      filtrados = filtrados.filter(a =>
        (a.proteina ?? 0) <= Number(filtros.proteinaMax)
      );
    }
    // Lipídeos
    if (filtros.lipideosMin) {
      filtrados = filtrados.filter(a =>
        (a.lipideos ?? 0) >= Number(filtros.lipideosMin)
      );
    }
    if (filtros.lipideosMax) {
      filtrados = filtrados.filter(a =>
        (a.lipideos ?? 0) <= Number(filtros.lipideosMax)
      );
    }
    // Carboidrato
    if (filtros.carboidratoMin) {
      filtrados = filtrados.filter(a =>
        (a.carboidrato ?? 0) >= Number(filtros.carboidratoMin)
      );
    }
    if (filtros.carboidratoMax) {
      filtrados = filtrados.filter(a =>
        (a.carboidrato ?? 0) <= Number(filtros.carboidratoMax)
      );
    }
    // Energia kcal
    if (filtros.energiaKcalMin) {
      filtrados = filtrados.filter(a =>
        (a.energia_kcal ?? 0) >= Number(filtros.energiaKcalMin)
      );
    }
    if (filtros.energiaKcalMax) {
      filtrados = filtrados.filter(a =>
        (a.energia_kcal ?? 0) <= Number(filtros.energiaKcalMax)
      );
    }

    // Ordenação
    filtrados = [...filtrados].sort((a, b) => {
      const fieldA = (a[ordenarPor] ?? 0) as number;
      const fieldB = (b[ordenarPor] ?? 0) as number;
      return ordemAsc ? fieldA - fieldB : fieldB - fieldA;
    });

    setAlimentosFiltrados(filtrados);
  };

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      categoria: '',
      proteinaMin: '',
      proteinaMax: '',
      lipideosMin: '',
      lipideosMax: '',
      carboidratoMin: '',
      carboidratoMax: '',
      energiaKcalMin: '',
      energiaKcalMax: '',
    });
  };

  const handleFiltroChange = (field: string, value: string) => {
    setFiltros(prev => ({ ...prev, [field]: value }));
  };

  // Adaptação: bloco para exibir micronutrientes
  const renderMicronutrientes = (alimento: Alimento) => (
    <tr className="bg-gray-50">
      <TableCell colSpan={3} className="font-semibold text-gray-700">Micronutrientes (por 100g)</TableCell>
      <TableCell>
        <span title="Cálcio">{(alimento.calcio ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Ferro">{(alimento.ferro ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Magnésio">{(alimento.magnesio ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Sódio">{(alimento.sodio ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Potássio">{(alimento.potassio ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Zinco">{(alimento.zinco ?? '-')}</span>
      </TableCell>
    </tr>
  );

  const renderVitamins = (alimento: Alimento) => (
    <tr className="bg-gray-50">
      <TableCell colSpan={3} className="font-semibold text-gray-700">Vitaminas (por 100g)</TableCell>
      <TableCell>
        <span title="Vitamina C">{(alimento.vitamina_c ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Tiamina">{(alimento.tiamina ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Riboflavina">{(alimento.riboflavina ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Piridoxina">{(alimento.piridoxina ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Niacina">{(alimento.niacina ?? '-')}</span>
      </TableCell>
      <TableCell>
        <span title="Vitamina A (RE)">{(alimento.re ?? '-')}</span>
      </TableCell>
    </tr>
  );

  // Sanitize categorias: only use non-empty, non-falsy, unique categories for SelectItem options
  const categorias = [
    ...new Set(
      alimentos
        .map(a => a.categoria)
        .filter((c): c is string => typeof c === "string" && c.trim() !== "")
    )
  ].sort();

  // Render

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ChefHat className="w-8 h-8 mr-3" />
          Pesquisa de Alimentos (Base TACO Completa)
        </h1>
        <p className="text-gray-600">Pesquise alimentos, filtre e organize pela informação nutricional da tabela TACO.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros e Ordenação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="nome">Nome do Alimento</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  id="nome"
                  placeholder="Buscar por nome..."
                  value={filtros.nome}
                  onChange={(e) => handleFiltroChange('nome', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={filtros.categoria} onValueChange={(v) => handleFiltroChange('categoria', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categorias.map(c => (
                    <SelectItem value={c} key={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="proteinaMin">Proteína (g) Mín</Label>
              <Input
                id="proteinaMin"
                type="number"
                value={filtros.proteinaMin}
                onChange={(e) => handleFiltroChange('proteinaMin', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="proteinaMax">Proteína (g) Máx</Label>
              <Input
                id="proteinaMax"
                type="number"
                value={filtros.proteinaMax}
                onChange={(e) => handleFiltroChange('proteinaMax', e.target.value)}
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
                  onChange={(e) => handleFiltroChange('lipideosMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.lipideosMax}
                  onChange={(e) => handleFiltroChange('lipideosMax', e.target.value)}
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
                  onChange={(e) => handleFiltroChange('carboidratoMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.carboidratoMax}
                  onChange={(e) => handleFiltroChange('carboidratoMax', e.target.value)}
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
                  onChange={(e) => handleFiltroChange('energiaKcalMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.energiaKcalMax}
                  onChange={(e) => handleFiltroChange('energiaKcalMax', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Ordenar por</Label>
              <div className="flex gap-2 items-center">
                <Select value={ordenarPor} onValueChange={(v: OrderableField) => setOrdenarPor(v)}>
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
                  onClick={() => setOrdemAsc(!ordemAsc)}
                  className="ml-2"
                  title="Alternar ordem"
                >
                  {ordemAsc ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={aplicarFiltros} className="bg-emerald-600 hover:bg-emerald-700">
              Aplicar Filtros
            </Button>
            <Button onClick={limparFiltros} variant="outline">
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Resultados ({alimentosFiltrados.length} alimentos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando alimentos...</p>
              </div>
            </div>
          ) : alimentosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum alimento encontrado com os filtros aplicados.
            </div>
          ) : (
            <TabelaAlimentosTaco alimentos={alimentosFiltrados} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
