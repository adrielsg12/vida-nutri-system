
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
        {/* Rotas principais dentro do Layout (menu topo) */}
        <Route element={<Layout><Dashboard /></Layout>} path="/" />
        <Route element={<Layout><Dashboard /></Layout>} path="/dashboard" />
        <Route element={<Layout><Pacientes /></Layout>} path="/pacientes" />
        <Route element={<Layout><Consultas /></Layout>} path="/consultas" />
        <Route element={<Layout><PlanosAlimentares /></Layout>} path="/planos-alimentares" />
        <Route element={<Layout><PesquisaAlimentos /></Layout>} path="/pesquisa-alimentos" />
        <Route element={<Layout><Financeiro /></Layout>} path="/financeiro" />
        <Route element={<Layout><Comunicacao /></Layout>} path="/comunicacao" />
        <Route element={<Layout><Configuracoes /></Layout>} path="/configuracoes" />

        {/* Páginas especiais SEM o menu topo */}
        <Route path="/acesso-negado" element={<AcessoNegado />} />
        <Route path="/acesso-rejeitado" element={<AcessoRejeitado />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
