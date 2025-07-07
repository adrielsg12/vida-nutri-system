import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { FiltroAlimentosForm } from "./FiltroAlimentosForm";
import { TabelaAlimentosTaco } from "./TabelaAlimentosTaco";
import { usePesquisaAlimentos } from "@/hooks/usePesquisaAlimentos";

export const PesquisaAlimentosPage = () => {
  const {
    alimentosFiltrados,
    filtros,
    loading,
    limparFiltros,
    handleFiltroChange,
    categorias,
    ordenarPor,
    setOrdenarPor,
    ordemAsc,
    setOrdemAsc,
    aplicarFiltros,
  } = usePesquisaAlimentos();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ChefHat className="w-8 h-8 mr-3" />
          Pesquisa de Alimentos (Base TACO Completa)
        </h1>
        <p className="text-gray-600">
          Pesquise alimentos, filtre e organize pela informação nutricional da tabela TACO.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Filtros e Ordenação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FiltroAlimentosForm
            filtros={filtros}
            categorias={categorias}
            ordenarPor={ordenarPor}
            ordemAsc={ordemAsc}
            onFiltroChange={handleFiltroChange}
            onLimparFiltros={limparFiltros}
            onOrdenarPor={setOrdenarPor}
            onOrdemAsc={() => setOrdemAsc(!ordemAsc)}
            onAplicarFiltros={aplicarFiltros}
          />
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