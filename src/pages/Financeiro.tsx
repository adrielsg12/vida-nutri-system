
import React, { useState } from 'react';
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

interface Transaction {
  id: string;
  patient: string;
  description: string;
  amount: number;
  date: string;
  status: 'pago' | 'pendente' | 'vencido';
  paymentMethod: 'dinheiro' | 'pix' | 'cartao' | 'boleto';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    patient: 'Maria Santos',
    description: 'Consulta nutricional - Maio/2024',
    amount: 150,
    date: '2024-05-28',
    status: 'pago',
    paymentMethod: 'pix'
  },
  {
    id: '2',
    patient: 'João Silva',
    description: 'Plano alimentar personalizado',
    amount: 200,
    date: '2024-05-25',
    status: 'pago',
    paymentMethod: 'cartao'
  },
  {
    id: '3',
    patient: 'Ana Costa',
    description: 'Consulta de retorno',
    amount: 120,
    date: '2024-06-05',
    status: 'pendente',
    paymentMethod: 'boleto'
  },
  {
    id: '4',
    patient: 'Carlos Oliveira',
    description: 'Consulta nutricional',
    amount: 150,
    date: '2024-05-20',
    status: 'vencido',
    paymentMethod: 'dinheiro'
  },
];

export const Financeiro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      pago: 'bg-emerald-100 text-emerald-700',
      pendente: 'bg-yellow-100 text-yellow-700',
      vencido: 'bg-red-100 text-red-700',
    };

    const labels = {
      pago: 'Pago',
      pendente: 'Pendente',
      vencido: 'Vencido',
    };

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: Transaction['paymentMethod']) => {
    const labels = {
      dinheiro: 'Dinheiro',
      pix: 'PIX',
      cartao: 'Cartão',
      boleto: 'Boleto',
    };
    return labels[method];
  };

  const totalReceived = mockTransactions
    .filter(t => t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = mockTransactions
    .filter(t => t.status === 'pendente')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOverdue = mockTransactions
    .filter(t => t.status === 'vencido')
    .reduce((sum, t) => sum + t.amount, 0);

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
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cobrança
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Recebido"
          value={`R$ ${totalReceived.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          color="emerald"
        />
        <StatsCard
          title="Pendente"
          value={`R$ ${totalPending.toLocaleString('pt-BR')}`}
          icon={Calendar}
          color="orange"
        />
        <StatsCard
          title="Vencido"
          value={`R$ ${totalOverdue.toLocaleString('pt-BR')}`}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Meta Mensal"
          value="R$ 15.000"
          icon={CreditCard}
          trend={{ value: 8, isPositive: true }}
          color="blue"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar transações..."
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
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {transaction.patient}
                    </h3>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        R$ {transaction.amount.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                        <span>{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(transaction.status)}
                      {transaction.status === 'pendente' && (
                        <Button size="sm" variant="outline">
                          Cobrar
                        </Button>
                      )}
                      {transaction.status === 'pago' && (
                        <Button size="sm" variant="outline">
                          Recibo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
