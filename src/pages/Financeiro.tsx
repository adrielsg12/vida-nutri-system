
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NovoPagamentoDialog } from '@/components/NovoPagamentoDialog';
import { EditarPagamentoDialog } from '@/components/EditarPagamentoDialog';
import { DollarSign, Plus, TrendingUp, CreditCard, MoreHorizontal, Edit, CheckCircle, AlertCircle, Download, Filter, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';

interface Pagamento {
  id: string;
  paciente_id: string;
  valor: number;
  data_pagamento: string;
  forma_pagamento: string;
  status: 'pago' | 'pendente' | 'cancelado';
  observacoes: string;
  pacientes: {
    nome: string;
  };
}

export const Financeiro = () => {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [filteredPagamentos, setFilteredPagamentos] = useState<Pagamento[]>([]);
  const [showNovoPagamento, setShowNovoPagamento] = useState(false);
  const [showEditarPagamento, setShowEditarPagamento] = useState(false);
  const [selectedPagamento, setSelectedPagamento] = useState<Pagamento | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
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
      
      const typedPagamentos = (data || []).map(item => ({
        ...item,
        status: item.status as 'pago' | 'pendente' | 'cancelado'
      }));
      
      setPagamentos(typedPagamentos);
      setFilteredPagamentos(typedPagamentos);
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

  useEffect(() => {
    let filtered = pagamentos.filter(pagamento => {
      const matchesSearch = pagamento.pacientes?.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'todos' || pagamento.status === statusFilter;
      const pagamentoDate = new Date(pagamento.data_pagamento);
      const matchesDataInicio = !dataInicio || pagamentoDate >= new Date(dataInicio);
      const matchesDataFim = !dataFim || pagamentoDate <= new Date(dataFim);

      return matchesSearch && matchesStatus && matchesDataInicio && matchesDataFim;
    });

    setFilteredPagamentos(filtered);
  }, [pagamentos, searchTerm, statusFilter, dataInicio, dataFim]);

  const exportToExcel = () => {
    const exportData = filteredPagamentos.map(pagamento => ({
      'Paciente': pagamento.pacientes?.nome || 'Não informado',
      'Valor': pagamento.valor,
      'Data': format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy', { locale: ptBR }),
      'Forma de Pagamento': pagamento.forma_pagamento,
      'Status': pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1),
      'Observações': pagamento.observacoes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Financeiro');

    const fileName = `relatorio_financeiro_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: 'Exportação realizada',
      description: 'Relatório exportado com sucesso.',
    });
  };

  const handleDarBaixa = async (pagamento: Pagamento) => {
    if (pagamento.status === 'pago') {
      toast({
        title: 'Pagamento já pago',
        description: 'Este pagamento já foi marcado como pago.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pagamentos')
        .update({ status: 'pago' })
        .eq('id', pagamento.id);

      if (error) {
        console.error('Erro ao dar baixa no pagamento:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível dar baixa no pagamento.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Baixa realizada',
        description: 'Pagamento marcado como pago com sucesso.',
      });

      fetchPagamentos();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao processar a solicitação.',
        variant: 'destructive',
      });
    }
  };

  const handleEditarPagamento = (pagamento: Pagamento) => {
    setSelectedPagamento(pagamento);
    setShowEditarPagamento(true);
  };

  const totalRecebido = filteredPagamentos.reduce((total, pagamento) => total + pagamento.valor, 0);
  const pagamentosPagos = filteredPagamentos.filter(p => p.status === 'pago');
  const totalPago = pagamentosPagos.reduce((total, pagamento) => total + pagamento.valor, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelado':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'text-green-600 bg-green-50';
      case 'pendente':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelado':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-2">Controle financeiro da sua clínica</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar XLS
          </Button>
          <Button onClick={() => setShowNovoPagamento(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Pagamento
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar por nome</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome do paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="data-inicio">Data início</Label>
              <Input
                id="data-inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="data-fim">Data fim</Label>
              <Input
                id="data-fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registrado</CardTitle>
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

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalPago.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPagamentos.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Transação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPagamentos.length > 0
                ? (totalRecebido / filteredPagamentos.length).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })
                : 'R$ 0,00'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Histórico de Pagamentos ({filteredPagamentos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPagamentos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhum pagamento encontrado</p>
              <p>Ajuste os filtros ou adicione um novo pagamento.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Forma de Pagamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPagamentos.map((pagamento) => (
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
                    <TableCell>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pagamento.status)}`}>
                        {getStatusIcon(pagamento.status)}
                        {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditarPagamento(pagamento)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          {pagamento.status !== 'pago' && (
                            <DropdownMenuItem 
                              onClick={() => handleDarBaixa(pagamento)}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Dar Baixa
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NovoPagamentoDialog
        open={showNovoPagamento}
        onClose={() => setShowNovoPagamento(false)}
        onSuccess={() => {
          setShowNovoPagamento(false);
          fetchPagamentos();
        }}
      />

      <EditarPagamentoDialog
        open={showEditarPagamento}
        onClose={() => {
          setShowEditarPagamento(false);
          setSelectedPagamento(null);
        }}
        onSuccess={() => {
          setShowEditarPagamento(false);
          setSelectedPagamento(null);
          fetchPagamentos();
        }}
        pagamento={selectedPagamento}
      />
    </div>
  );
};
