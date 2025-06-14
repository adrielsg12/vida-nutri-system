
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida?: string | null;
  proteina?: number | null;
  lipideos?: number | null;
  carboidrato?: number | null;
  energia_kcal?: number | null;
  fibra_alimentar?: number | null;
  colesterol?: number | null;
  // Outros campos TACO
  umidade?: number | null;
  energia_kj?: number | null;
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
  calorias_por_100g?: number | null;
  proteinas_por_100g?: number | null;
  carboidratos_por_100g?: number | null;
  gorduras_por_100g?: number | null;
  fibras_por_100g?: number | null;
}

interface Props {
  alimentos: Alimento[];
}

const renderMicronutrientes = (alimento: Alimento) => (
  <tr className="bg-gray-50">
    <TableCell colSpan={3} className="font-semibold text-gray-700">Micronutrientes (por 100g)</TableCell>
    <TableCell title="Cálcio">{alimento.calcio ?? '-'}</TableCell>
    <TableCell title="Ferro">{alimento.ferro ?? '-'}</TableCell>
    <TableCell title="Magnésio">{alimento.magnesio ?? '-'}</TableCell>
    <TableCell title="Sódio">{alimento.sodio ?? '-'}</TableCell>
    <TableCell title="Potássio">{alimento.potassio ?? '-'}</TableCell>
    <TableCell title="Zinco">{alimento.zinco ?? '-'}</TableCell>
  </tr>
);

const renderVitamins = (alimento: Alimento) => (
  <tr className="bg-gray-50">
    <TableCell colSpan={3} className="font-semibold text-gray-700">Vitaminas (por 100g)</TableCell>
    <TableCell title="Vitamina C">{alimento.vitamina_c ?? '-'}</TableCell>
    <TableCell title="Tiamina">{alimento.tiamina ?? '-'}</TableCell>
    <TableCell title="Riboflavina">{alimento.riboflavina ?? '-'}</TableCell>
    <TableCell title="Piridoxina">{alimento.piridoxina ?? '-'}</TableCell>
    <TableCell title="Niacina">{alimento.niacina ?? '-'}</TableCell>
    <TableCell title="Vitamina A (RE)">{alimento.re ?? '-'}</TableCell>
  </tr>
);

export function TabelaAlimentosTaco({ alimentos }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Proteína</TableHead>
            <TableHead>Lipídeos</TableHead>
            <TableHead>Carboidrato</TableHead>
            <TableHead>Energia (kcal)</TableHead>
            <TableHead>Fibra</TableHead>
            <TableHead>Colesterol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alimentos.map(alimento => (
            <React.Fragment key={alimento.id}>
              <TableRow>
                <TableCell className="font-medium">{alimento.nome}</TableCell>
                <TableCell>
                  <Badge variant="outline">{alimento.categoria}</Badge>
                </TableCell>
                <TableCell>{alimento.unidade_medida || 'g'}</TableCell>
                <TableCell>{alimento.proteina ?? alimento.proteinas_por_100g ?? '-'}</TableCell>
                <TableCell>{alimento.lipideos ?? alimento.gorduras_por_100g ?? '-'}</TableCell>
                <TableCell>{alimento.carboidrato ?? alimento.carboidratos_por_100g ?? '-'}</TableCell>
                <TableCell>{alimento.energia_kcal ?? alimento.calorias_por_100g ?? '-'}</TableCell>
                <TableCell>{alimento.fibra_alimentar ?? alimento.fibras_por_100g ?? '-'}</TableCell>
                <TableCell>{alimento.colesterol ?? '-'}</TableCell>
              </TableRow>
              {renderMicronutrientes(alimento)}
              {renderVitamins(alimento)}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div className="text-xs text-gray-400 mt-1">
        * Exibindo macro, micronutrientes e vitaminas segundo a Tabela TACO.
      </div>
    </div>
  );
}
