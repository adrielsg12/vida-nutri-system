
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAprovacoes } from '@/hooks/useAprovacoes';
import { AprovacoesTable } from './AprovacoesTable';

export const GerenciamentoAprovacoes = () => {
  const {
    aprovacoes,
    loading,
    observacoes,
    aprovarUsuario,
    rejeitarUsuario,
    updateObservacoes
  } = useAprovacoes();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando aprovações...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Aprovações de Acesso</CardTitle>
      </CardHeader>
      <CardContent>
        <AprovacoesTable
          aprovacoes={aprovacoes}
          observacoes={observacoes}
          onObservacoesChange={updateObservacoes}
          onAprovar={aprovarUsuario}
          onRejeitar={rejeitarUsuario}
        />
        
        {aprovacoes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma solicitação de acesso encontrada.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
