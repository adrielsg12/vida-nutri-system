
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
  email?: string;
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
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
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
      <TableCell className="font-medium">{aprovacao.nome_completo || 'N/A'}</TableCell>
      <TableCell>{aprovacao.email || 'N/A'}</TableCell>
      <TableCell>
        {new Date(aprovacao.data_solicitacao).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
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
              className="w-full min-h-[60px]"
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
