
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import { Dashboard } from '@/pages/Dashboard';
import { Pacientes } from '@/pages/Pacientes';
import { Consultas } from '@/pages/Consultas';
import { PlanosAlimentares } from '@/pages/PlanosAlimentares';
import { Financeiro } from '@/pages/Financeiro';
import { Comunicacao } from '@/pages/Comunicacao';
import { Configuracoes } from '@/pages/Configuracoes';
import NotFound from '@/pages/NotFound';
import { AcessoNegado } from '@/pages/AcessoNegado';
import { AcessoRejeitado } from '@/pages/AcessoRejeitado';
import { Layout } from '@/components/Layout/Layout';
import { PesquisaAlimentos } from '@/pages/PesquisaAlimentos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        <Route path="/acesso-rejeitado" element={<AcessoRejeitado />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/planos-alimentares" element={<PlanosAlimentares />} />
        <Route path="/pesquisa-alimentos" element={<PesquisaAlimentos />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/comunicacao" element={<Comunicacao />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
