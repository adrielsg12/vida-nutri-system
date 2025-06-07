
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStatus } from '@/hooks/useUserStatus';
import { GerenciamentoAprovacoes } from '@/components/GerenciamentoAprovacoes';

export const Configuracoes = () => {
  const { isAdmin } = useUserStatus();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
      </div>

      {isAdmin && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Painel Administrativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Como administrador, você tem acesso às seguintes funcionalidades:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Gerenciar aprovações de novos usuários</li>
                <li>Visualizar e controlar acesso ao sistema</li>
                <li>Acompanhar logs de aprovações</li>
              </ul>
            </CardContent>
          </Card>

          <GerenciamentoAprovacoes />
        </div>
      )}

      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Configurações básicas da sua conta. Funcionalidades adicionais serão adicionadas em breve.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
