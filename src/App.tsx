
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/planos" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Planos Alimentares</h1><p className="text-gray-600 mt-2">Em desenvolvimento...</p></div>} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/comunicacao" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Comunicação</h1><p className="text-gray-600 mt-2">Em desenvolvimento...</p></div>} />
            <Route path="/configuracoes" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-gray-600 mt-2">Em desenvolvimento...</p></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
