import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Scale } from "lucide-react";
import { useEquivalenciasAlimentos, EquivalenciaAlimento } from "@/hooks/useEquivalenciasAlimentos";

export function EquivalenciasAlimentos() {
  const {
    equivalencias,
    loading,
    alimentoBusca,
    buscarAlimento
  } = useEquivalenciasAlimentos();

  const handleBuscaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    buscarAlimento(valor);
  };

  const renderEquivalenciaRow = (equivalencia: EquivalenciaAlimento) => (
    <TableRow key={equivalencia.id}>
      <TableCell className="font-medium">{equivalencia.nome}</TableCell>
      <TableCell>
        <Badge variant="outline">{equivalencia.categoria_taco}</Badge>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center">
          <Scale className="w-4 h-4 mr-1 text-emerald-600" />
          <strong className="text-emerald-600">{equivalencia.quantidadeEquivalente}g</strong>
        </div>
      </TableCell>
      <TableCell className="text-center">{equivalencia.energia_kcal}</TableCell>
      <TableCell className="text-center">{equivalencia.proteina?.toFixed(1) || '-'}</TableCell>
      <TableCell className="text-center">{equivalencia.carboidrato?.toFixed(1) || '-'}</TableCell>
      <TableCell className="text-center">{equivalencia.lipideos?.toFixed(1) || '-'}</TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Scale className="w-8 h-8 mr-3 text-emerald-600" />
          Equivalências Alimentares
        </h1>
        <p className="text-gray-600">
          Digite o nome de um alimento para ver as equivalências nutricionais. 
          Ex: "arroz" mostra batata, mandioca e outros do mesmo grupo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Buscar Alimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="busca-alimento">Nome do Alimento</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="busca-alimento"
                placeholder="Digite: arroz, batata, frango..."
                value={alimentoBusca}
                onChange={handleBuscaChange}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {alimentoBusca && (
        <Card>
          <CardHeader>
            <CardTitle>
              Equivalências para "{alimentoBusca}" (base: 100g)
            </CardTitle>
            <p className="text-sm text-gray-600">
              Alimentos do mesmo grupo nutricional com quantidades equivalentes em calorias
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Calculando equivalências...</p>
                </div>
              </div>
            ) : equivalencias.length === 0 ? (
              <div className="text-center py-8">
                <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {alimentoBusca ? 
                    "Nenhuma equivalência encontrada para este alimento." :
                    "Digite o nome de um alimento para ver as equivalências."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alimento</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-center">Quantidade Equivalente</TableHead>
                      <TableHead className="text-center">Calorias (100g)</TableHead>
                      <TableHead className="text-center">Proteína (g)</TableHead>
                      <TableHead className="text-center">Carboidrato (g)</TableHead>
                      <TableHead className="text-center">Lipídeos (g)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equivalencias.map(renderEquivalenciaRow)}
                  </TableBody>
                </Table>
                
                <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-800 mb-2">Como interpretar:</h4>
                  <p className="text-sm text-emerald-700">
                    As quantidades mostradas têm o mesmo valor calórico que 100g do alimento pesquisado. 
                    Por exemplo: 100g de arroz = 60g de batata inglesa (valores aproximados baseados nas calorias).
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}