
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download,
  TrendingUp,
  Calendar,
  CreditCard
} from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NovoPagamentoDialog } from '@/components/NovoPagamentoDialog';

interface Payment {
  id: string;
  paciente_nome: string;
  valor: number;
  data_pagamento: string;
  forma_pagamento: string;
  status: 'pago' | 'pendente' | 'cancelado';
  observacoes?: string;
}

export const Financeiro = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showNewPaymentDialog, setShowNewPaymentDialog] = useState(false);
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('pagamentos')
        .select(`
          *,
          pacientes!inner(nome)
        `)
        .eq('nutricionista_id', user.id)
        .order('data_pagamento', { ascending: false });

      if (error) {
        console.error('Erro ao buscar pagamentos:', error);
        toast({
          title: "Erro ao carregar pagamentos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const formattedPayments = (data || []).map(payment => ({
        id: payment.id,
        paciente_nome: payment.pacientes?.nome || 'Paciente não encontrado',
        valor: payment.valor,
        data_pagamento: payment.data_pagamento,
        forma_pagamento: payment.forma_pagamento,
        status: payment.status as 'pago' | 'pendente' | 'cancelado',
        observacoes: payment.observacoes
      }));

      setPayments(formattedPayments);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao carregar os pagamentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('pagamentos')
        .delete()
        .eq('id', paymentId);

      if (error) {
        console.error('Erro ao excluir pagamento:', error);
        toast({
          title: "Erro ao excluir pagamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Pagamento excluído",
        description: "O pagamento foi removido com sucesso.",
      });

      setPayments(payments.filter(p => p.id !== paymentId));
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir o pagamento.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.forma_pagamento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Payment['status']) => {
    const variants = {
      pago: 'bg-emerald-100 text-emerald-700',
      pendente: 'bg-yellow-100 text-yellow-700',
      cancelado: 'bg-red-100 text-red-700',
    };

    const labels = {
      pago: 'Pago',
      pendente: 'Pendente',
      cancelado: 'Cancelado',
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      dinheiro: 'Dinheiro',
      pix: 'PIX',
      cartao_credito: 'Cartão de Crédito',
      cartao_debito: 'Cartão de Débito',
      boleto: 'Boleto',
    };
    return labels[method] || method;
  };

  const totalReceived = payments
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + p.valor, 0);

  const totalPending = payments
    .filter(p => p.status === 'pendente')
    .reduce((sum, p) => sum + p.valor, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle de pagamentos e receitas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowNewPaymentDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Pagamento
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Recebido"
          value={`R$ ${totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="emerald"
        />
        <StatsCard
          title="Pendente"
          value={`R$ ${totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={Calendar}
          color="orange"
        />
        <StatsCard
          title="Total de Pagamentos"
          value={payments.length.toString()}
          icon={CreditCard}
          color="blue"
        />
        <StatsCard
          title="Média por Pagamento"
          value={`R$ ${payments.length > 0 ? (totalReceived / payments.filter(p => p.status === 'pago').length || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pagamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {payment.paciente_nome}
                      </h3>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          R$ {payment.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(payment.data_pagamento).toLocaleDateString('pt-BR')}</span>
                          <span>{getPaymentMethodLabel(payment.forma_pagamento)}</span>
                        </div>
                        {payment.observacoes && (
                          <p className="text-sm text-gray-600 mt-1">{payment.observacoes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(payment.status)}
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este pagamento?')) {
                              deletePayment(payment.id);
                            }
                          }}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum pagamento encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'todos' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Comece registrando seu primeiro pagamento'
                }
              </p>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowNewPaymentDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Pagamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <NovoPagamentoDialog 
        open={showNewPaymentDialog}
        onClose={() => setShowNewPaymentDialog(false)}
        onSuccess={() => {
          setShowNewPaymentDialog(false);
          fetchPayments();
        }}
      />
    </div>
  );
};
