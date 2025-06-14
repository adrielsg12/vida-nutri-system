import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Calculator, Clock, ArrowRightLeft, Trash2, User } from 'lucide-react';
import { SubstituicaoAlimentoDialog } from './SubstituicaoAlimentoDialog';
import { EditarPlanoAlimentarDialog } from './EditarPlanoAlimentarDialog';
import { Edit } from "lucide-react";

interface PlanoAlimentar {
  id: string;
  titulo: string;
  descricao?: string;
  status: string;
  data_inicio?: string;
  data_fim?: string;
  pacientes: {
    id: string;
    nome: string;
  };
  itens_plano_alimentar: ItemPlano[];
}

interface ItemPlano {
  id: string;
  dia_semana: number;
  refeicao: string;
  quantidade: number;
  unidade_medida: string;
  observacoes?: string;
  horario_recomendado?: string;
  ordem: number;
  alimentos: {
    id: string;
    nome: string;
    categoria: string;
    calorias_por_100g: number;
    proteinas_por_100g: number;
    carboidratos_por_100g: number;
    gorduras_por_100g: number;
    fibras_por_100g: number;
  };
}

interface VisualizarPlanoDialogProps {
  open: boolean;
  onClose: () => void;
  planoId: string;
}

export const VisualizarPlanoDialog = ({ open, onClose, planoId }: VisualizarPlanoDialogProps) => {
  const [plano, setPlano] = useState<PlanoAlimentar | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSubstituicao, setShowSubstituicao] = useState(false);
  const [alimentoParaSubstituir, setAlimentoParaSubstituir] = useState<any>(null);
  const [itemParaSubstituir, setItemParaSubstituir] = useState<string | null>(null);
  const [showEditar, setShowEditar] = useState(false);
  const [pacientes, setPacientes] = useState<any[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const refeicoes = ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia'];

  const carregarPlano = async () => {
    if (!planoId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('planos_alimentares')
        .select(`
          id,
          titulo,
          descricao,
          status,
          data_inicio,
          data_fim,
          pacientes!inner(id, nome),
          itens_plano_alimentar(
            id,
            dia_semana,
            refeicao,
            quantidade,
            unidade_medida,
            observacoes,
            horario_recomendado,
            ordem,
            alimentos(
              id,
              nome,
              categoria,
              calorias_por_100g,
              proteinas_por_100g,
              carboidratos_por_100g,
              gorduras_por_100g,
              fibras_por_100g
            )
          )
        `)
        .eq('id', planoId)
        .single();

      if (error) throw error;

      setPlano(data);
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes do plano alimentar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const excluirPlano = async () => {
    if (!plano) return;

    try {
      const { error } = await supabase
        .from('planos_alimentares')
        .delete()
        .eq('id', plano.id)
        .eq('nutricionista_id', user?.id);

      if (error) throw error;

      toast({
        title: "Plano excluído",
        description: "O plano alimentar foi excluído com sucesso.",
      });

      onClose();
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir o plano alimentar.",
        variant: "destructive",
      });
    }
  };

  const abrirSubstituicao = (item: ItemPlano) => {
    setAlimentoParaSubstituir(item.alimentos);
    setItemParaSubstituir(item.id);
    setShowSubstituicao(true);
  };

  const handleSubstituicao = async (novoAlimento: any) => {
    if (!itemParaSubstituir) return;

    try {
      const { error } = await supabase
        .from('itens_plano_alimentar')
        .update({ alimento_id: novoAlimento.id })
        .eq('id', itemParaSubstituir);

      if (error) throw error;

      // Recarregar o plano para mostrar a substituição
      await carregarPlano();
      setShowSubstituicao(false);
      setAlimentoParaSubstituir(null);
      setItemParaSubstituir(null);
    } catch (error) {
      console.error('Erro ao substituir alimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao substituir alimento.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (open) {
      carregarPlano();
    }
  }, [open, planoId]);

  // Carregar lista de pacientes para usar no editar
  useEffect(() => {
    const loadPacientes = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome')
        .eq('nutricionista_id', user.id)
        .eq('status', 'ativo')
        .order('nome');
      if (!error) setPacientes(data || []);
    };
    if (open) {
      loadPacientes();
    }
  }, [open, user]);

  const calcularNutrientesPorItem = (item: ItemPlano) => {
    const fator = item.quantidade / 100;
    return {
      calorias: (item.alimentos.calorias_por_100g * fator).toFixed(1),
      proteinas: (item.alimentos.proteinas_por_100g * fator).toFixed(1),
      carboidratos: (item.alimentos.carboidratos_por_100g * fator).toFixed(1),
      gorduras: (item.alimentos.gorduras_por_100g * fator).toFixed(1),
      fibras: (item.alimentos.fibras_por_100g * fator).toFixed(1)
    };
  };

  const calcularTotalDiario = (dia: number) => {
    const itensDia = plano?.itens_plano_alimentar.filter(item => item.dia_semana === dia) || [];
    
    return itensDia.reduce((total, item) => {
      const fator = item.quantidade / 100;
      return {
        calorias: total.calorias + (item.alimentos.calorias_por_100g * fator),
        proteinas: total.proteinas + (item.alimentos.proteinas_por_100g * fator),
        carboidratos: total.carboidratos + (item.alimentos.carboidratos_por_100g * fator),
        gorduras: total.gorduras + (item.alimentos.gorduras_por_100g * fator),
        fibras: total.fibras + (item.alimentos.fibras_por_100g * fator)
      };
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0, fibras: 0 });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pausado':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pausado</Badge>;
      case 'finalizado':
        return <Badge variant="secondary">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando plano alimentar...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!plano) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl">
          <div className="text-center py-8">
            <p className="text-gray-500">Plano alimentar não encontrado.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="flex items-center text-xl">
                  <Calculator className="w-6 h-6 mr-2" />
                  {plano.titulo}
                </DialogTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {plano.pacientes.nome}
                  </div>
                  <div>{getStatusBadge(plano.status)}</div>
                  {plano.data_inicio && (
                    <div>
                      Início: {new Date(plano.data_inicio).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {plano.data_fim && (
                    <div>
                      Fim: {new Date(plano.data_fim).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
              
              <div className='flex gap-2'>
                {/* Edit Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                  onClick={() => setShowEditar(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                {/* Delete (Excluir) Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir Plano
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Plano Alimentar</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o plano "{plano.titulo}"? 
                        Esta ação não pode ser desfeita e todos os itens do plano serão removidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={excluirPlano} className="bg-red-600 hover:bg-red-700">
                        Sim, excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </DialogHeader>

          {plano.descricao && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{plano.descricao}</p>
            </div>
          )}

          <div className="space-y-6">
            {diasSemana.map((dia, diaIndex) => {
              const itensDia = plano.itens_plano_alimentar
                .filter(item => item.dia_semana === diaIndex)
                .sort((a, b) => {
                  const refeicaoOrder = refeicoes.indexOf(a.refeicao) - refeicoes.indexOf(b.refeicao);
                  return refeicaoOrder !== 0 ? refeicaoOrder : a.ordem - b.ordem;
                });

              const totalDiario = calcularTotalDiario(diaIndex);

              return (
                <Card key={diaIndex}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {dia}
                      <span className="ml-4 text-sm font-normal text-gray-600">
                        Total: {totalDiario.calorias.toFixed(0)} kcal | 
                        {totalDiario.proteinas.toFixed(1)}g prot | 
                        {totalDiario.carboidratos.toFixed(1)}g carb | 
                        {totalDiario.gorduras.toFixed(1)}g gord
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {itensDia.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhum alimento planejado para este dia.</p>
                    ) : (
                      <div className="space-y-4">
                        {refeicoes.map((refeicao) => {
                          const itensRefeicao = itensDia.filter(item => item.refeicao === refeicao);
                          
                          if (itensRefeicao.length === 0) return null;

                          return (
                            <div key={refeicao}>
                              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {refeicao}
                              </h4>
                              
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Alimento</TableHead>
                                    <TableHead>Quantidade</TableHead>
                                    <TableHead>Calorias</TableHead>
                                    <TableHead>Proteínas</TableHead>
                                    <TableHead>Carboidratos</TableHead>
                                    <TableHead>Gorduras</TableHead>
                                    <TableHead>Observações</TableHead>
                                    <TableHead>Ações</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {itensRefeicao.map((item) => {
                                    const nutrientes = calcularNutrientesPorItem(item);
                                    
                                    return (
                                      <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                          {item.alimentos.nome}
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            {item.alimentos.categoria}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>{item.quantidade} {item.unidade_medida}</TableCell>
                                        <TableCell>{nutrientes.calorias} kcal</TableCell>
                                        <TableCell>{nutrientes.proteinas}g</TableCell>
                                        <TableCell>{nutrientes.carboidratos}g</TableCell>
                                        <TableCell>{nutrientes.gorduras}g</TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                          {item.observacoes || '-'}
                                        </TableCell>
                                        <TableCell>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => abrirSubstituicao(item)}
                                            className="text-blue-600 hover:text-blue-700"
                                          >
                                            <ArrowRightLeft className="w-3 h-3 mr-1" />
                                            Substituir
                                          </Button>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog de Editar */}
      {plano && (
        <EditarPlanoAlimentarDialog
          open={showEditar}
          onClose={() => setShowEditar(false)}
          plano={{
            id: plano.id,
            titulo: plano.titulo,
            descricao: plano.descricao,
            paciente_id: plano.pacientes?.id || "",
            data_inicio: plano.data_inicio || "",
            data_fim: plano.data_fim || "",
            status: plano.status,
          }}
          pacientes={pacientes}
          onSuccess={() => {
            setShowEditar(false);
            carregarPlano();
          }}
        />
      )}

      {alimentoParaSubstituir && (
        <SubstituicaoAlimentoDialog
          open={showSubstituicao}
          onClose={() => {
            setShowSubstituicao(false);
            setAlimentoParaSubstituir(null);
            setItemParaSubstituir(null);
          }}
          alimentoOriginal={alimentoParaSubstituir}
          onSubstituir={handleSubstituicao}
        />
      )}
    </>
  );
};
