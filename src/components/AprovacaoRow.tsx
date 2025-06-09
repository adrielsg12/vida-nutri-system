
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AprovacaoAcesso {
  id: string;
  user_id: string;
  status: string;
  data_solicitacao: string;
  observacoes?: string;
  nome_completo?: string;
}

interface AprovacaoRowProps {
  aprovacao: AprovacaoAcesso;
  observacoes: string;
  onObservacoesChange: (observacoes: string) => void;
  onAprovar: () => void;
  onRejeitar: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pendente':
      return <Badge variant="outline">Pendente</Badge>;
    case 'aprovado':
      return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
    case 'rejeitado':
      return <Badge variant="destructive">Rejeitado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const AprovacaoRow = ({ 
  aprovacao, 
  observacoes, 
  onObservacoesChange, 
  onAprovar, 
  onRejeitar 
}: AprovacaoRowProps) => {
  return (
    <TableRow>
      <TableCell>{aprovacao.nome_completo || 'N/A'}</TableCell>
      <TableCell>
        {new Date(aprovacao.data_solicitacao).toLocaleDateString('pt-BR')}
      </TableCell>
      <TableCell>{getStatusBadge(aprovacao.status)}</TableCell>
      <TableCell>
        {aprovacao.status === 'pendente' ? (
          <div className="space-y-2">
            <Label htmlFor={`obs-${aprovacao.id}`}>Observações (opcional)</Label>
            <Textarea
              id={`obs-${aprovacao.id}`}
              placeholder="Adicione observações sobre a aprovação..."
              value={observacoes}
              onChange={(e) => onObservacoesChange(e.target.value)}
              className="w-full"
            />
          </div>
        ) : (
          <span className="text-gray-600">{aprovacao.observacoes || 'Sem observações'}</span>
        )}
      </TableCell>
      <TableCell>
        {aprovacao.status === 'pendente' && (
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={onAprovar}
              className="bg-green-600 hover:bg-green-700"
            >
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onRejeitar}
            >
              Rejeitar
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
