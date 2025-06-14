
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, ChefHat } from 'lucide-react';

interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carboidratos_por_100g: number;
  gorduras_por_100g: number;
  fibras_por_100g: number;
}

export const PesquisaAlimentos = () => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    nome: '',
    categoria: '',
    caloriasMin: '',
    caloriasMax: '',
    proteinasMin: '',
    proteinasMax: '',
    carboidratosMin: '',
    carboidratosMax: '',
    gordurasMin: '',
    gordurasMax: '',
    fibrasMin: '',
    fibrasMax: ''
  });

  const { toast } = useToast();

  const carregarAlimentos = async () => {
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .select('*')
        .order('nome');

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

  const aplicarFiltros = () => {
    let alimentosFiltrados = alimentos;

    // Filtro por nome
    if (filtros.nome) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.nome.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filtros.categoria) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.categoria === filtros.categoria
      );
    }

    // Filtros por nutrientes
    if (filtros.caloriasMin) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.calorias_por_100g >= Number(filtros.caloriasMin)
      );
    }
    if (filtros.caloriasMax) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.calorias_por_100g <= Number(filtros.caloriasMax)
      );
    }

    if (filtros.proteinasMin) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.proteinas_por_100g >= Number(filtros.proteinasMin)
      );
    }
    if (filtros.proteinasMax) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.proteinas_por_100g <= Number(filtros.proteinasMax)
      );
    }

    if (filtros.carboidratosMin) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.carboidratos_por_100g >= Number(filtros.carboidratosMin)
      );
    }
    if (filtros.carboidratosMax) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.carboidratos_por_100g <= Number(filtros.carboidratosMax)
      );
    }

    if (filtros.gordurasMin) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.gorduras_por_100g >= Number(filtros.gordurasMin)
      );
    }
    if (filtros.gordurasMax) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.gorduras_por_100g <= Number(filtros.gordurasMax)
      );
    }

    if (filtros.fibrasMin) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.fibras_por_100g >= Number(filtros.fibrasMin)
      );
    }
    if (filtros.fibrasMax) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.fibras_por_100g <= Number(filtros.fibrasMax)
      );
    }

    setAlimentosFiltrados(alimentosFiltrados);
  };

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      categoria: '',
      caloriasMin: '',
      caloriasMax: '',
      proteinasMin: '',
      proteinasMax: '',
      carboidratosMin: '',
      carboidratosMax: '',
      gordurasMin: '',
      gordurasMax: '',
      fibrasMin: '',
      fibrasMax: ''
    });
    setAlimentosFiltrados(alimentos);
  };

  const categorias = [...new Set(alimentos.map(a => a.categoria))].sort();

  const handleFiltroChange = (field: string, value: string) => {
    setFiltros(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando alimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ChefHat className="w-8 h-8 mr-3" />
          Pesquisa de Alimentos
        </h1>
        <p className="text-gray-600">Pesquise alimentos por nutrientes e categoria</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {/* Nome */}
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

            {/* Categoria */}
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={filtros.categoria} onValueChange={(value) => handleFiltroChange('categoria', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria} value={categoria}>
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros por nutrientes */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Calorias */}
            <div className="space-y-2">
              <Label>Calorias (kcal/100g)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filtros.caloriasMin}
                  onChange={(e) => handleFiltroChange('caloriasMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.caloriasMax}
                  onChange={(e) => handleFiltroChange('caloriasMax', e.target.value)}
                />
              </div>
            </div>

            {/* Proteínas */}
            <div className="space-y-2">
              <Label>Proteínas (g/100g)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filtros.proteinasMin}
                  onChange={(e) => handleFiltroChange('proteinasMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.proteinasMax}
                  onChange={(e) => handleFiltroChange('proteinasMax', e.target.value)}
                />
              </div>
            </div>

            {/* Carboidratos */}
            <div className="space-y-2">
              <Label>Carboidratos (g/100g)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filtros.carboidratosMin}
                  onChange={(e) => handleFiltroChange('carboidratosMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.carboidratosMax}
                  onChange={(e) => handleFiltroChange('carboidratosMax', e.target.value)}
                />
              </div>
            </div>

            {/* Gorduras */}
            <div className="space-y-2">
              <Label>Gorduras (g/100g)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filtros.gordurasMin}
                  onChange={(e) => handleFiltroChange('gordurasMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.gordurasMax}
                  onChange={(e) => handleFiltroChange('gordurasMax', e.target.value)}
                />
              </div>
            </div>

            {/* Fibras */}
            <div className="space-y-2">
              <Label>Fibras (g/100g)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={filtros.fibrasMin}
                  onChange={(e) => handleFiltroChange('fibrasMin', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={filtros.fibrasMax}
                  onChange={(e) => handleFiltroChange('fibrasMax', e.target.value)}
                />
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

      {/* Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados ({alimentosFiltrados.length} alimentos)</CardTitle>
        </CardHeader>
        <CardContent>
          {alimentosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum alimento encontrado com os filtros aplicados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Calorias/100g</TableHead>
                  <TableHead>Proteínas/100g</TableHead>
                  <TableHead>Carboidratos/100g</TableHead>
                  <TableHead>Gorduras/100g</TableHead>
                  <TableHead>Fibras/100g</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alimentosFiltrados.map((alimento) => (
                  <TableRow key={alimento.id}>
                    <TableCell className="font-medium">{alimento.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{alimento.categoria}</Badge>
                    </TableCell>
                    <TableCell>{alimento.calorias_por_100g}</TableCell>
                    <TableCell>{alimento.proteinas_por_100g}g</TableCell>
                    <TableCell>{alimento.carboidratos_por_100g}g</TableCell>
                    <TableCell>{alimento.gorduras_por_100g}g</TableCell>
                    <TableCell>{alimento.fibras_por_100g}g</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
