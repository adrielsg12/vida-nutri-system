
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AlimentoPesquisa {
  "Número do Alimento"?: number | null;
  "Categoria do alimento"?: string | null;
  "Descrição dos alimentos"?: string | null;
  "Saturados (g)"?: string | null;
  "Mono-insaturados (g)"?: string | null;
  "Poli-insaturados (g)"?: string | null;
  "12:0 (g)"?: string | null;
  "14:0 (g)"?: string | null;
  "16:0 (g)"?: string | null;
  "18:0 (g)"?: string | null;
  "20:0 (g)"?: string | null;
  "22:0 (g)"?: string | null;
  "24:0 (g)"?: string | null;
  "14:1 (g)"?: string | null;
  "16:1 (g)"?: string | null;
  "18:1 (g)"?: string | null;
  "20:1 (g)"?: string | null;
  "18:2 n-6 (g)"?: string | null;
  "18:3 n-3 (g)"?: string | null;
  "20:4 (g)"?: string | null;
  "20:5 (g)"?: string | null;
  "22:5 (g)"?: string | null;
  "22:6 (g)"?: string | null;
  "18:1t (g)"?: string | null;
  "18:2t (g)"?: string | null;
}

interface Props {
  alimentos: AlimentoPesquisa[];
}

const renderAcidosGraxos = (alimento: AlimentoPesquisa) => (
  <tr className="bg-gray-50">
    <TableCell colSpan={2} className="font-semibold text-gray-700">Ácidos Graxos Saturados (g)</TableCell>
    <TableCell title="12:0">{alimento["12:0 (g)"] ?? '-'}</TableCell>
    <TableCell title="14:0">{alimento["14:0 (g)"] ?? '-'}</TableCell>
    <TableCell title="16:0">{alimento["16:0 (g)"] ?? '-'}</TableCell>
    <TableCell title="18:0">{alimento["18:0 (g)"] ?? '-'}</TableCell>
    <TableCell title="20:0">{alimento["20:0 (g)"] ?? '-'}</TableCell>
    <TableCell title="22:0">{alimento["22:0 (g)"] ?? '-'}</TableCell>
  </tr>
);

const renderAcidosInsaturados = (alimento: AlimentoPesquisa) => (
  <tr className="bg-gray-100">
    <TableCell colSpan={2} className="font-semibold text-gray-700">Ácidos Graxos Insaturados (g)</TableCell>
    <TableCell title="14:1">{alimento["14:1 (g)"] ?? '-'}</TableCell>
    <TableCell title="16:1">{alimento["16:1 (g)"] ?? '-'}</TableCell>
    <TableCell title="18:1">{alimento["18:1 (g)"] ?? '-'}</TableCell>
    <TableCell title="20:1">{alimento["20:1 (g)"] ?? '-'}</TableCell>
    <TableCell title="18:2 n-6">{alimento["18:2 n-6 (g)"] ?? '-'}</TableCell>
    <TableCell title="18:3 n-3">{alimento["18:3 n-3 (g)"] ?? '-'}</TableCell>
  </tr>
);

export function TabelaAlimentosTaco({ alimentos }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Saturados (g)</TableHead>
            <TableHead>Mono-insaturados (g)</TableHead>
            <TableHead>Poli-insaturados (g)</TableHead>
            <TableHead>18:1t (g)</TableHead>
            <TableHead>18:2t (g)</TableHead>
            <TableHead>Número</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alimentos.map((alimento, idx) => (
            <React.Fragment key={idx}>
              <TableRow>
                <TableCell className="font-medium">{alimento["Descrição dos alimentos"] || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline">{alimento["Categoria do alimento"] || '-'}</Badge>
                </TableCell>
                <TableCell>{alimento["Saturados (g)"] || '-'}</TableCell>
                <TableCell>{alimento["Mono-insaturados (g)"] || '-'}</TableCell>
                <TableCell>{alimento["Poli-insaturados (g)"] || '-'}</TableCell>
                <TableCell>{alimento["18:1t (g)"] || '-'}</TableCell>
                <TableCell>{alimento["18:2t (g)"] || '-'}</TableCell>
                <TableCell>{alimento["Número do Alimento"] || '-'}</TableCell>
              </TableRow>
              {renderAcidosGraxos(alimento)}
              {renderAcidosInsaturados(alimento)}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <div className="text-xs text-gray-400 mt-1">
        * Exibindo perfil de ácidos graxos segundo a Tabela de Pesquisa de Alimentos.
      </div>
    </div>
  );
}
