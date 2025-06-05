
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Pacientes } from "@/pages/Pacientes";
import { Consultas } from "@/pages/Consultas";
import { Financeiro } from "@/pages/Financeiro";
import { Comunicacao } from "@/pages/Comunicacao";
import { Configuracoes } from "@/pages/Configuracoes";
import { Auth } from "@/pages/Auth";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/pacientes" element={
              <ProtectedRoute>
                <Layout>
                  <Pacientes />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/consultas" element={
              <ProtectedRoute>
                <Layout>
                  <Consultas />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/financeiro" element={
              <ProtectedRoute>
                <Layout>
                  <Financeiro />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/comunicacao" element={
              <ProtectedRoute>
                <Layout>
                  <Comunicacao />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Layout>
                  <Configuracoes />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
