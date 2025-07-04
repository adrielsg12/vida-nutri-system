
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Minus, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SimpleEvolutionChart } from '@/components/Reports/SimpleEvolutionChart';

interface RelatorioEvolucaoDialogProps {
  open: boolean;
  onClose: () => void;
  paciente: {
    id: string;
    nome: string;
  };
}

interface RegistroConsulta {
  id: string;
  peso: number | null;
  altura: number | null;
  circunferencia_cintura: number | null;
  circunferencia_quadril: number | null;
  circunferencia_peito: number | null;
  circunferencia_panturrilha: number | null;
  circunferencia_coxa: number | null;
  circunferencia_biceps: number | null;
  percentual_gordura: number | null;
  massa_muscular: number | null;
  created_at: string;
}

export const RelatorioEvolucaoDialog = ({ 
  open, 
  onClose, 
  paciente 
}: RelatorioEvolucaoDialogProps) => {
  const [registros, setRegistros] = useState<RegistroConsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && paciente.id) {
      fetchRegistros();
    }
  }, [open, paciente.id]);

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('registros_consulta')
        .select('*')
        .eq('paciente_id', paciente.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setRegistros(data || []);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os registros do paciente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calcularTendencia = (valores: (number | null)[]) => {
    const valoresValidos = valores.filter((v): v is number => v !== null);
    if (valoresValidos.length < 2) return null;
    
    const primeiro = valoresValidos[0];
    const ultimo = valoresValidos[valoresValidos.length - 1];
    const diferenca = ultimo - primeiro;
    
    if (Math.abs(diferenca) < 0.1) return 'estavel';
    return diferenca > 0 ? 'subindo' : 'descendo';
  };

  const formatarDiferenca = (valores: (number | null)[]) => {
    const valoresValidos = valores.filter((v): v is number => v !== null);
    if (valoresValidos.length < 2) return null;
    
    const primeiro = valoresValidos[0];
    const ultimo = valoresValidos[valoresValidos.length - 1];
    const diferenca = ultimo - primeiro;
    
    return diferenca > 0 ? `+${diferenca.toFixed(1)}` : diferenca.toFixed(1);
  };

  const getTendenciaIcon = (tendencia: string | null) => {
    switch (tendencia) {
      case 'subindo':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'descendo':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'estavel':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTendenciaColor = (tendencia: string | null) => {
    switch (tendencia) {
      case 'subindo':
        return 'text-green-600';
      case 'descendo':
        return 'text-red-600';
      case 'estavel':
        return 'text-gray-600';
      default:
        return 'text-gray-400';
    }
  };

  const campos = [
    { key: 'peso', label: 'Peso (kg)', unit: 'kg' },
    { key: 'circunferencia_cintura', label: 'Cintura (cm)', unit: 'cm' },
    { key: 'circunferencia_quadril', label: 'Quadril (cm)', unit: 'cm' },
    { key: 'circunferencia_peito', label: 'Peito (cm)', unit: 'cm' },
    { key: 'circunferencia_panturrilha', label: 'Panturrilha (cm)', unit: 'cm' },
    { key: 'circunferencia_coxa', label: 'Coxa (cm)', unit: 'cm' },
    { key: 'circunferencia_biceps', label: 'Bíceps (cm)', unit: 'cm' },
    { key: 'percentual_gordura', label: 'Gordura (%)', unit: '%' },
    { key: 'massa_muscular', label: 'Massa Muscular (kg)', unit: 'kg' },
  ];

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="text-center py-8">Carregando relatório...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatório de Evolução
          </DialogTitle>
          <DialogDescription>
            Paciente: {paciente.nome} | {registros.length} consultas registradas
          </DialogDescription>
        </DialogHeader>

        {registros.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Nenhum registro encontrado</p>
            <p>Este paciente ainda não possui consultas registradas.</p>
          </div>
        ) : (
          <Tabs defaultValue="resumo" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="graficos">Gráficos</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo da Evolução</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campos.map((campo) => {
                      const valores = registros.map(r => r[campo.key as keyof RegistroConsulta] as number | null);
                      const valoresValidos = valores.filter((v): v is number => v !== null);
                      const tendencia = calcularTendencia(valores);
                      const diferenca = formatarDiferenca(valores);
                      
                      if (valoresValidos.length === 0) return null;

                      const valorAtual = valoresValidos[valoresValidos.length - 1];

                      return (
                        <div key={campo.key} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{campo.label}</span>
                            {getTendenciaIcon(tendencia)}
                          </div>
                          <div className="mt-1">
                            <span className="text-lg font-bold">{valorAtual.toFixed(1)}</span>
                            <span className="text-sm text-gray-500 ml-1">{campo.unit}</span>
                          </div>
                          {diferenca && (
                            <div className={`text-sm ${getTendenciaColor(tendencia)}`}>
                              {diferenca} {campo.unit}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="graficos" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <SimpleEvolutionChart
                      registros={registros}
                      metrica="percentual_gordura"
                      titulo="Percentual de Gordura"
                      unidade="%"
                      cor="#ef4444"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <SimpleEvolutionChart
                      registros={registros}
                      metrica="peso"
                      titulo="Peso"
                      unidade="kg"
                      cor="#3b82f6"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <SimpleEvolutionChart
                      registros={registros}
                      metrica="massa_muscular"
                      titulo="Massa Muscular"
                      unidade="kg"
                      cor="#10b981"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="historico" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico de Consultas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {registros.slice().reverse().map((registro, index) => (
                      <div key={registro.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">
                            Consulta {registros.length - index}
                          </h4>
                          <Badge variant="outline">
                            {format(new Date(registro.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                          {campos.map((campo) => {
                            const valor = registro[campo.key as keyof RegistroConsulta] as number | null;
                            if (valor === null) return null;
                            
                            return (
                              <div key={campo.key}>
                                <span className="text-gray-600">{campo.label}:</span>
                                <span className="ml-2 font-medium">
                                  {valor.toFixed(1)} {campo.unit}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
