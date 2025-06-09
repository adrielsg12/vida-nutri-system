
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AprovacaoRow } from './AprovacaoRow';

interface AprovacaoAcesso {
  id: string;
  user_id: string;
  status: string;
  data_solicitacao: string;
  observacoes?: string;
  nome_completo?: string;
}

interface AprovacoesTableProps {
  aprovacoes: AprovacaoAcesso[];
  observacoes: { [key: string]: string };
  onObservacoesChange: (aprovacaoId: string, observacoes: string) => void;
  onAprovar: (userId: string, aprovacaoId: string) => void;
  onRejeitar: (userId: string, aprovacaoId: string) => void;
}

export const AprovacoesTable = ({
  aprovacoes,
  observacoes,
  onObservacoesChange,
  onAprovar,
  onRejeitar
}: AprovacoesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Data da Solicitação</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Observações</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {aprovacoes.map((aprovacao) => (
          <AprovacaoRow
            key={aprovacao.id}
            aprovacao={aprovacao}
            observacoes={observacoes[aprovacao.id] || ''}
            onObservacoesChange={(obs) => onObservacoesChange(aprovacao.id, obs)}
            onAprovar={() => onAprovar(aprovacao.user_id, aprovacao.id)}
            onRejeitar={() => onRejeitar(aprovacao.user_id, aprovacao.id)}
          />
        ))}
      </TableBody>
    </Table>
  );
};
