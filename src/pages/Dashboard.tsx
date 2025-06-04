
import React from 'react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { RecentActivity } from '@/components/Dashboard/RecentActivity';
import { AppointmentsToday } from '@/components/Dashboard/AppointmentsToday';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
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
          value="142"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          color="emerald"
        />
        <StatsCard
          title="Consultas Hoje"
          value="8"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Receita Mensal"
          value="R$ 12.450"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          color="purple"
        />
        <StatsCard
          title="Taxa de Sucesso"
          value="94%"
          icon={TrendingUp}
          trend={{ value: 3, isPositive: true }}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments Today - spans 2 columns on large screens */}
        <div className="lg:col-span-2">
          <AppointmentsToday />
        </div>

        {/* Recent Activity - spans 1 column */}
        <div>
          <RecentActivity />
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
              <p>Gráfico de evolução será implementado aqui</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>Gráfico de receitas será implementado aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
