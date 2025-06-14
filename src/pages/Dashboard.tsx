import React from 'react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { ProximasConsultas } from '@/components/Dashboard/ProximasConsultas';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { AniversariantesMes } from '@/components/Dashboard/AniversariantesMes';

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
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vinda de volta ao NutriSync! Aqui está um resumo do seu dia.</p>
        </div>

        {/* Loading skeleton for stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-6 border shadow-sm">
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
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 border shadow-sm">
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
      <div className="bg-card rounded-lg p-6 border shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vinda de volta ao NutriSync! Aqui está um resumo do seu dia.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border shadow-sm cursor-pointer hover:shadow-md transition-all duration-300" onClick={() => handleCardClick('pacientes')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Pacientes Ativos</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalPacientes}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border shadow-sm cursor-pointer hover:shadow-md transition-all duration-300" onClick={() => handleCardClick('consultas')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Consultas Hoje</p>
              <p className="text-3xl font-bold text-foreground">{stats.consultasHoje}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Consultas Finalizadas</p>
              <p className="text-3xl font-bold text-foreground">{stats.consultasConcluidas}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border shadow-sm cursor-pointer hover:shadow-md transition-all duration-300" onClick={() => handleCardClick('financeiro')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Receita Mensal</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(stats.recebimentosMes)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <ProximasConsultas 
            consultas={proximasConsultas} 
            loading={false}
          />
        </div>

        {/* Aba de aniversariantes */}
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <AniversariantesMes />
        </div>
      </div>

      {/* Gráficos etc. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for future charts */}
        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Resumo Semanal</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>Gráficos em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
