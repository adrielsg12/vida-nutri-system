
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserStatus } from '@/hooks/useUserStatus';
import { GerenciamentoAprovacoes } from '@/components/GerenciamentoAprovacoes';
import { GerenciamentoUsuarios } from '@/components/GerenciamentoUsuarios';
import { MinhaContaForm } from '@/components/MinhaContaForm';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, CheckCircle, XCircle, Clock, User, Settings } from 'lucide-react';

export const Configuracoes = () => {
  const { isAdmin, userProfile } = useUserStatus();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        {isAdmin && (
          <Badge className="bg-blue-100 text-blue-800">
            <Shield className="w-4 h-4 mr-1" />
            Administrador
          </Badge>
        )}
      </div>

      {isAdmin ? (
        <Tabs defaultValue="aprovacoes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aprovacoes" className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovações
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="minha-conta" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Minha Conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aprovacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Painel Administrativo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Como administrador, você tem controle total sobre o sistema:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-green-800">Aprovar Usuários</p>
                      <p className="text-sm text-green-600">Liberar acesso ao sistema</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <p className="font-semibold text-red-800">Rejeitar Usuários</p>
                      <p className="text-sm text-red-600">Negar acesso não autorizado</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <Clock className="w-8 h-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="font-semibold text-yellow-800">Monitorar Solicitações</p>
                      <p className="text-sm text-yellow-600">Acompanhar novas solicitações</p>
                    </div>
                  </div>
                </div>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Controlar quem pode acessar o sistema</li>
                  <li>Visualizar histórico de aprovações e rejeições</li>
                  <li>Adicionar observações nas decisões de aprovação</li>
                  <li>Proteger o sistema contra acessos não autorizados</li>
                </ul>
              </CardContent>
            </Card>

            <GerenciamentoAprovacoes />
          </TabsContent>

          <TabsContent value="usuarios" className="space-y-6">
            <GerenciamentoUsuarios />
          </TabsContent>

          <TabsContent value="minha-conta" className="space-y-6">
            <MinhaContaForm />
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="minha-conta" className="space-y-6">
          <TabsList>
            <TabsTrigger value="minha-conta" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Minha Conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="minha-conta" className="space-y-6">
            <MinhaContaForm />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
