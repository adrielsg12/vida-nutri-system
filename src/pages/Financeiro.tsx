import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NovoPagamentoDialog } from '@/components/NovoPagamentoDialog';
import { DollarSign, Plus, TrendingUp, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Pagamento {
  id: string;
  paciente_id: string;
  valor: number;
  data_pagamento: string;
  forma_pagamento: string;
  pacientes: {
    nome: string;
  };
}

export const Financeiro = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [showNovoPagamento, setShowNovoPagamento] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPagamentos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pagamentos')
        .select(`
          *,
          pacientes (nome)
        `)
        .order('data_pagamento', { ascending: false });

      if (error) throw error;
      setPagamentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pagamentos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const totalRecebido = pagamentos.reduce((total, pagamento) => total + pagamento.valor, 0);

  if (loading) {
    return (
      <div className="w-full px-4 lg:px-6 py-6">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle financeiro da sua clínica</p>
        </div>
        <Button onClick={() => setShowNovoPagamento(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Pagamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRecebido.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagamentos.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Transação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pagamentos.length > 0
                ? (totalRecebido / pagamentos.length).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })
                : 'R$ 0,00'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Histórico de Pagamentos ({pagamentos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pagamentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhum pagamento registrado</p>
              <p>Comece adicionando seu primeiro pagamento.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentos.map((pagamento) => (
                  <TableRow key={pagamento.id}>
                    <TableCell className="font-medium">
                      {pagamento.pacientes?.nome || 'Paciente não encontrado'}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {pagamento.valor.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>{pagamento.forma_pagamento}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NovoPagamentoDialog
        isOpen={showNovoPagamento}
        onClose={() => setShowNovoPagamento(false)}
        onSave={() => {
          setShowNovoPagamento(false);
          fetchPagamentos();
        }}
      />
    </div>
  );
};
