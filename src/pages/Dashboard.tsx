
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
      <div className="w-full px-4 lg:px-6 py-6 space-y-6 relative z-10">
        <div className="glow-card rounded-lg p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-slate-300">Bem-vinda de volta ao NutriSync! Aqui está um resumo do seu dia.</p>
        </div>

        {/* Loading skeleton for stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glow-card rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-8 w-16 bg-white/10" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading skeleton for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glow-card rounded-lg p-6">
            <Skeleton className="h-6 w-40 mb-4 bg-white/10" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32 bg-white/10" />
                    <Skeleton className="h-3 w-24 bg-white/10" />
                  </div>
                  <Skeleton className="h-3 w-16 bg-white/10" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="glow-card rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4 bg-white/10" />
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-6 relative z-10">
      {/* Header */}
      <div className="glow-card rounded-lg p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-slate-300">Bem-vinda de volta ao NutriSync! Aqui está um resumo do seu dia.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glow-card rounded-lg p-6 cursor-pointer hover:scale-105 transition-all duration-300 group" onClick={() => handleCardClick('pacientes')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Pacientes Ativos</p>
              <p className="text-3xl font-bold text-white">{stats.totalPacientes}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-lg flex items-center justify-center group-hover:shadow-emerald-500/25 group-hover:shadow-lg transition-all">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glow-card rounded-lg p-6 cursor-pointer hover:scale-105 transition-all duration-300 group" onClick={() => handleCardClick('consultas')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Consultas Hoje</p>
              <p className="text-3xl font-bold text-white">{stats.consultasHoje}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-lg flex items-center justify-center group-hover:shadow-cyan-500/25 group-hover:shadow-lg transition-all">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glow-card rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Consultas Finalizadas</p>
              <p className="text-3xl font-bold text-white">{stats.consultasConcluidas}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="glow-card rounded-lg p-6 cursor-pointer hover:scale-105 transition-all duration-300 group" onClick={() => handleCardClick('financeiro')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Receita Mensal</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(stats.recebimentosMes)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg flex items-center justify-center group-hover:shadow-orange-500/25 group-hover:shadow-lg transition-all">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <div className="glow-card rounded-lg p-6">
          <ProximasConsultas 
            consultas={proximasConsultas} 
            loading={false}
          />
        </div>

        {/* Placeholder for future charts */}
        <div className="glow-card rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-white">Resumo Semanal</h3>
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-slate-500" />
              <p>Gráficos em desenvolvimento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
