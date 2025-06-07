
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { XCircle } from 'lucide-react';

export const AcessoRejeitado = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-gray-900 mt-4">
              Acesso Negado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-gray-600">
              <p className="mb-4">
                Seu acesso a esta plataforma foi negado pelo administrador.
              </p>
              <p className="mb-4">
                Entre em contato com o suporte para mais informações sobre esta decisão.
              </p>
            </div>
            
            <div className="pt-4">
              <Button
                onClick={signOut}
                variant="destructive"
                className="w-full"
              >
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer fixo na parte inferior */}
      <div className="mt-auto py-4 px-4 text-center">
        <p className="text-sm text-gray-600">
          Sistema desenvolvido pela{' '}
          <span className="font-semibold text-gray-900">Brainstorm Agência de Marketing</span>
          {' '}- Contato: (32) 9 9166-5327
        </p>
      </div>
    </div>
  );
};
