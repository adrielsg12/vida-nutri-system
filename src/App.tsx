
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import { Auth } from '@/pages/Auth';
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
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout/Layout';
import { PesquisaAlimentos } from '@/pages/PesquisaAlimentos';

import { AuthProvider } from '@/hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/acesso-negado" element={<AcessoNegado />} />
          <Route path="/acesso-rejeitado" element={<AcessoRejeitado />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pacientes" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Pacientes />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/consultas" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Consultas />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/planos-alimentares" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PlanosAlimentares />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pesquisa-alimentos" 
            element={
              <ProtectedRoute>
                <Layout>
                  <PesquisaAlimentos />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/financeiro" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Financeiro />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/comunicacao" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Comunicacao />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/configuracoes" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Configuracoes />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

