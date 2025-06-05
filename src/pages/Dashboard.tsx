
import React from 'react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { Users, Calendar, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vinda de volta! Aqui está um resumo do seu dia.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pacientes Ativos"
          value="0"
          icon={Users}
          color="emerald"
        />
        <StatsCard
          title="Consultas Hoje"
          value="0"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Receita Mensal"
          value="R$ 0,00"
          icon={DollarSign}
          color="purple"
        />
        <StatsCard
          title="Taxa de Sucesso"
          value="0%"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Today - spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Consultas de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma consulta agendada para hoje</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - spans 1 column */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma atividade recente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Dados serão exibidos após o primeiro atendimento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Dados serão exibidos após o primeiro pagamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
