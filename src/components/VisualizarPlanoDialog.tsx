
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Calculator, Clock, ChefHat } from 'lucide-react';

interface Alimento {
  id: string;
  nome: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carboidratos_por_100g: number;
  gorduras_por_100g: number;
}

interface ItemPlano {
  id: string;
  dia_semana: number;
  refeicao: string;
  quantidade: number;
  unidade_medida: string;
  horario_recomendado?: string;
  observacoes?: string;
  ordem: number;
  alimentos: Alimento;
}

interface PlanoAlimentar {
  id: string;
  titulo: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
  status: string;
  pacientes: {
    nome: string;
  };
}

interface VisualizarPlanoDialogProps {
  open: boolean;
  onClose: () => void;
  planoId: string;
}

const diasSemana = [
  { valor: 1, nome: 'Segunda-feira' },
  { valor: 2, nome: 'Terça-feira' },
  { valor: 3, nome: 'Quarta-feira' },
  { valor: 4, nome: 'Quinta-feira' },
  { valor: 5, nome: 'Sexta-feira' },
  { valor: 6, nome: 'Sábado' },
  { valor: 0, nome: 'Domingo' }
];

const refeicoes = [
  { valor: 'cafe_manha', nome: 'Café da manhã' },
  { valor: 'lanche_manha', nome: 'Lanche da manhã' },
  { valor: 'almoco', nome: 'Almoço' },
  { valor: 'lanche_tarde', nome: 'Lanche da tarde' },
  { valor: 'pre_treino', nome: 'Pré-treino' },
  { valor: 'pos_treino', nome: 'Pós-treino' },
  { valor: 'jantar', nome: 'Jantar' },
  { valor: 'ceia', nome: 'Ceia' }
];

export const VisualizarPlanoDialog = ({ open, onClose, planoId }: VisualizarPlanoDialogProps) => {
  const [plano, setPlano] = useState<PlanoAlimentar | null>(null);
  const [itens, setItens] = useState<ItemPlano[]>([]);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [novoItem, setNovoItem] = useState({
    refeicao: 'cafe_manha',
    alimento_id: '',
    quantidade: 100,
    unidade_medida: 'g',
    horario_recomendado: '',
    observacoes: ''
  });

  const { toast } = useToast();

  const carregarDados = async () => {
    if (!planoId) return;
    
    setLoading(true);
    try {
      console.log('Carregando dados do plano:', planoId);

      // Carregar dados do plano
      const { data: planoData, error: planoError } = await supabase
        .from('planos_alimentares')
        .select(`
          id,
          titulo,
          descricao,
          data_inicio,
          data_fim,
          status,
          pacientes (nome)
        `)
        .eq('id', planoId)
        .single();

      if (planoError) {
        console.error('Erro ao carregar plano:', planoError);
        throw planoError;
      }

      console.log('Plano carregado:', planoData);

      // Carregar itens do plano
      const { data: itensData, error: itensError } = await supabase
        .from('itens_plano_alimentar')
        .select(`
          id,
          dia_semana,
          refeicao,
          quantidade,
          unidade_medida,
          horario_recomendado,
          observacoes,
          ordem,
          alimentos (
            id,
            nome,
            calorias_por_100g,
            proteinas_por_100g,
            carboidratos_por_100g,
            gorduras_por_100g
          )
        `)
        .eq('plano_id', planoId)
        .order('dia_semana')
        .order('refeicao')
        .order('ordem');

      if (itensError) {
        console.error('Erro ao carregar itens:', itensError);
        throw itensError;
      }

      console.log('Itens carregados:', itensData);

      // Carregar biblioteca de alimentos
      const { data: alimentosData, error: alimentosError } = await supabase
        .from('alimentos')
        .select('id, nome, calorias_por_100g, proteinas_por_100g, carboidratos_por_100g, gorduras_por_100g')
        .or('is_publico.eq.true,nutricionista_id.eq.' + (await supabase.auth.getUser()).data.user?.id)
        .order('nome');

      if (alimentosError) {
        console.error('Erro ao carregar alimentos:', alimentosError);
        throw alimentosError;
      }

      console.log('Alimentos carregados:', alimentosData);

      setPlano(planoData);
      setItens(itensData || []);
      setAlimentos(alimentosData || []);
    } catch (error) {
      console.error('Erro ao carregar plano:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do plano alimentar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && planoId) {
      carregarDados();
    }
  }, [open, planoId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!novoItem.alimento_id) {
        toast({
          title: "Campo obrigatório",
          description: "Selecione um alimento.",
          variant: "destructive",
        });
        return;
      }

      console.log('Adicionando item:', novoItem);

      const { error } = await supabase
        .from('itens_plano_alimentar')
        .insert({
          plano_id: planoId,
          dia_semana: diaSelecionado,
          refeicao: novoItem.refeicao,
          alimento_id: novoItem.alimento_id,
          quantidade: novoItem.quantidade,
          unidade_medida: novoItem.unidade_medida,
          horario_recomendado: novoItem.horario_recomendado || null,
          observacoes: novoItem.observacoes || null,
          ordem: 0
        });

      if (error) {
        console.error('Erro ao adicionar item:', error);
        throw error;
      }

      toast({
        title: "Item adicionado",
        description: "O alimento foi adicionado ao plano.",
      });

      setNovoItem({
        refeicao: 'cafe_manha',
        alimento_id: '',
        quantidade: 100,
        unidade_medida: 'g',
        horario_recomendado: '',
        observacoes: ''
      });

      setShowAddForm(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar alimento ao plano.",
        variant: "destructive",
      });
    }
  };

  const deletarItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('itens_plano_alimentar')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Item removido",
        description: "O alimento foi removido do plano.",
      });

      carregarDados();
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover item.",
        variant: "destructive",
      });
    }
  };

  const calcularNutrientes = (item: ItemPlano) => {
    const fator = item.quantidade / 100;
    return {
      calorias: Math.round(item.alimentos.calorias_por_100g * fator),
      proteinas: Math.round(item.alimentos.proteinas_por_100g * fator * 10) / 10,
      carboidratos: Math.round(item.alimentos.carboidratos_por_100g * fator * 10) / 10,
      gorduras: Math.round(item.alimentos.gorduras_por_100g * fator * 10) / 10
    };
  };

  const calcularTotalDia = (dia: number) => {
    const itensDia = itens.filter(item => item.dia_semana === dia);
    return itensDia.reduce((total, item) => {
      const nutrientes = calcularNutrientes(item);
      return {
        calorias: total.calorias + nutrientes.calorias,
        proteinas: Math.round((total.proteinas + nutrientes.proteinas) * 10) / 10,
        carboidratos: Math.round((total.carboidratos + nutrientes.carboidratos) * 10) / 10,
        gorduras: Math.round((total.gorduras + nutrientes.gorduras) * 10) / 10
      };
    }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
  };

  const getNomeRefeicao = (valor: string) => {
    return refeicoes.find(r => r.valor === valor)?.nome || valor;
  };

  const itensDiaSelecionado = itens.filter(item => item.dia_semana === diaSelecionado);
  const totalDia = calcularTotalDia(diaSelecionado);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando plano...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!plano) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-gray-600">Plano não encontrado.</p>
              <Button onClick={onClose} className="mt-4">Fechar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ChefHat className="w-5 h-5 mr-2" />
            {plano.titulo}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            Paciente: {plano.pacientes.nome} • Status: {plano.status}
          </div>
        </DialogHeader>

        <Tabs value={diaSelecionado.toString()} onValueChange={(value) => setDiaSelecionado(Number(value))}>
          <TabsList className="grid w-full grid-cols-7">
            {diasSemana.map((dia) => (
              <TabsTrigger key={dia.valor} value={dia.valor.toString()}>
                {dia.nome.substring(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {diasSemana.map((dia) => (
            <TabsContent key={dia.valor} value={dia.valor.toString()} className="space-y-4">
              {/* Resumo nutricional do dia */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Resumo Nutricional - {dia.nome}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{totalDia.calorias}</p>
                      <p className="text-sm text-gray-600">Calorias</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{totalDia.proteinas}g</p>
                      <p className="text-sm text-gray-600">Proteínas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{totalDia.carboidratos}g</p>
                      <p className="text-sm text-gray-600">Carboidratos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{totalDia.gorduras}g</p>
                      <p className="text-sm text-gray-600">Gorduras</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Botão para adicionar alimento */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Refeições - {dia.nome}</h3>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Alimento
                </Button>
              </div>

              {/* Formulário para adicionar alimento */}
              {showAddForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Adicionar Alimento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddItem} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="refeicao">Refeição</Label>
                          <Select 
                            value={novoItem.refeicao} 
                            onValueChange={(value) => setNovoItem({...novoItem, refeicao: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {refeicoes.map((refeicao) => (
                                <SelectItem key={refeicao.valor} value={refeicao.valor}>
                                  {refeicao.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="alimento">Alimento</Label>
                          <Select 
                            value={novoItem.alimento_id} 
                            onValueChange={(value) => setNovoItem({...novoItem, alimento_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um alimento" />
                            </SelectTrigger>
                            <SelectContent>
                              {alimentos.map((alimento) => (
                                <SelectItem key={alimento.id} value={alimento.id}>
                                  {alimento.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="quantidade">Quantidade</Label>
                          <Input
                            id="quantidade"
                            type="number"
                            value={novoItem.quantidade}
                            onChange={(e) => setNovoItem({...novoItem, quantidade: Number(e.target.value)})}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="unidade">Unidade</Label>
                          <Select 
                            value={novoItem.unidade_medida} 
                            onValueChange={(value) => setNovoItem({...novoItem, unidade_medida: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="g">g</SelectItem>
                              <SelectItem value="ml">ml</SelectItem>
                              <SelectItem value="unidade">unidade</SelectItem>
                              <SelectItem value="colher">colher</SelectItem>
                              <SelectItem value="xícara">xícara</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="horario">Horário</Label>
                          <Input
                            id="horario"
                            type="time"
                            value={novoItem.horario_recomendado}
                            onChange={(e) => setNovoItem({...novoItem, horario_recomendado: e.target.value})}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="observacoes">Observações</Label>
                          <Input
                            id="observacoes"
                            placeholder="Opcional"
                            value={novoItem.observacoes}
                            onChange={(e) => setNovoItem({...novoItem, observacoes: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                          Adicionar
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Lista de refeições */}
              <div className="space-y-4">
                {refeicoes.map((refeicao) => {
                  const itensRefeicao = itensDiaSelecionado.filter(item => item.refeicao === refeicao.valor);
                  
                  if (itensRefeicao.length === 0) return null;

                  return (
                    <Card key={refeicao.valor}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {refeicao.nome}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Alimento</TableHead>
                              <TableHead>Quantidade</TableHead>
                              <TableHead>Horário</TableHead>
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
                              const nutrientes = calcularNutrientes(item);
                              return (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.alimentos.nome}</TableCell>
                                  <TableCell>{item.quantidade} {item.unidade_medida}</TableCell>
                                  <TableCell>{item.horario_recomendado || '-'}</TableCell>
                                  <TableCell>{nutrientes.calorias} kcal</TableCell>
                                  <TableCell>{nutrientes.proteinas}g</TableCell>
                                  <TableCell>{nutrientes.carboidratos}g</TableCell>
                                  <TableCell>{nutrientes.gorduras}g</TableCell>
                                  <TableCell>{item.observacoes || '-'}</TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => deletarItem(item.id)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {itensDiaSelecionado.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum alimento adicionado para {dia.nome} ainda.
                  <br />
                  Clique em "Adicionar Alimento" para começar a montar o plano.
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
