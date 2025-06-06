
import React from 'react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ProximasConsultas } from '@/components/Dashboard/ProximasConsultas';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { stats, proximasConsultas, loading } = useDashboardData();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleCardClick = (type: string) => {
    switch (type) {
      case 'pacientes':
        navigate('/pacientes');
        break;
      case 'consultas':
        navigate('/consultas');
        break;
      case 'financeiro':
        navigate('/financeiro');
        break;
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 lg:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vinda de volta ao NutriSync! Aqui está um resumo do seu dia.</p>
        </div>

        {/* Loading skeleton for stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading skeleton for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vinda de volta ao NutriSync! Aqui está um resumo do seu dia.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pacientes Ativos"
          value={stats.totalPacientes.toString()}
          icon={Users}
          color="emerald"
          onClick={() => handleCardClick('pacientes')}
          clickable
        />
        <StatsCard
          title="Consultas Hoje"
          value={stats.consultasHoje.toString()}
          icon={Calendar}
          color="blue"
          onClick={() => handleCardClick('consultas')}
          clickable
        />
        <StatsCard
          title="Consultas Finalizadas"
          value={stats.consultasConcluidas.toString()}
          icon={TrendingUp}
          color="purple"
          clickable={false}
        />
        <StatsCard
          title="Receita Mensal"
          value={formatCurrency(stats.recebimentosMes)}
          icon={DollarSign}
          color="orange"
          onClick={() => handleCardClick('financeiro')}
          clickable
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <ProximasConsultas 
          consultas={proximasConsultas} 
          loading={false}
        />

        {/* Placeholder for future charts */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Resumo Semanal</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Gráficos em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
