
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Trash2, ChefHat } from 'lucide-react';

interface Alimento {
  id: string;
  nome: string;
  categoria?: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carboidratos_por_100g: number;
  gorduras_por_100g: number;
  fibras_por_100g: number;
  is_publico: boolean;
  nutricionista_id?: string;
}

interface GerenciarAlimentosDialogProps {
  open: boolean;
  onClose: () => void;
}

const alimentosBase = [
  { nome: 'Arroz branco cozido', categoria: 'Cereais', calorias: 128, proteinas: 2.5, carboidratos: 28.0, gorduras: 0.2, fibras: 0.2 },
  { nome: 'Feijão preto cozido', categoria: 'Leguminosas', calorias: 77, proteinas: 4.5, carboidratos: 14.0, gorduras: 0.5, fibras: 8.4 },
  { nome: 'Peito de frango grelhado', categoria: 'Carnes', calorias: 165, proteinas: 31.0, carboidratos: 0.0, gorduras: 3.6, fibras: 0.0 },
  { nome: 'Ovo cozido', categoria: 'Ovos', calorias: 155, proteinas: 13.0, carboidratos: 1.1, gorduras: 11.0, fibras: 0.0 },
  { nome: 'Banana prata', categoria: 'Frutas', calorias: 89, proteinas: 1.1, carboidratos: 23.0, gorduras: 0.3, fibras: 2.6 },
  { nome: 'Maçã com casca', categoria: 'Frutas', calorias: 52, proteinas: 0.3, carboidratos: 14.0, gorduras: 0.2, fibras: 2.4 },
  { nome: 'Batata doce cozida', categoria: 'Tubérculos', calorias: 86, proteinas: 2.0, carboidratos: 20.0, gorduras: 0.1, fibras: 3.0 },
  { nome: 'Azeite de oliva', categoria: 'Óleos', calorias: 884, proteinas: 0.0, carboidratos: 0.0, gorduras: 100.0, fibras: 0.0 },
  { nome: 'Leite integral', categoria: 'Laticínios', calorias: 61, proteinas: 2.9, carboidratos: 4.3, gorduras: 3.2, fibras: 0.0 },
  { nome: 'Pão francês', categoria: 'Panificados', calorias: 265, proteinas: 8.0, carboidratos: 53.0, gorduras: 3.1, fibras: 2.3 },
  { nome: 'Brócolis cozido', categoria: 'Vegetais', calorias: 22, proteinas: 1.9, carboidratos: 4.0, gorduras: 0.4, fibras: 2.9 },
  { nome: 'Salmão grelhado', categoria: 'Peixes', calorias: 208, proteinas: 25.4, carboidratos: 0.0, gorduras: 12.4, fibras: 0.0 },
  { nome: 'Aveia em flocos', categoria: 'Cereais', calorias: 394, proteinas: 13.9, carboidratos: 67.0, gorduras: 8.5, fibras: 9.1 },
  { nome: 'Iogurte natural', categoria: 'Laticínios', calorias: 51, proteinas: 4.6, carboidratos: 3.8, gorduras: 1.5, fibras: 0.0 },
  { nome: 'Castanha do Brasil', categoria: 'Oleaginosas', calorias: 643, proteinas: 14.5, carboidratos: 15.0, gorduras: 63.5, fibras: 7.9 }
];

export const GerenciarAlimentosDialog = ({ open, onClose }: GerenciarAlimentosDialogProps) => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [novoAlimento, setNovoAlimento] = useState({
    nome: '',
    categoria: '',
    calorias_por_100g: 0,
    proteinas_por_100g: 0,
    carboidratos_por_100g: 0,
    gorduras_por_100g: 0,
    fibras_por_100g: 0
  });

  const { toast } = useToast();
  const { user } = useAuth();

  const carregarAlimentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .select('*')
        .or(`is_publico.eq.true,nutricionista_id.eq.${user?.id}`)
        .order('nome');

      if (error) throw error;

      console.log('Alimentos carregados:', data);
      setAlimentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alimentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const adicionarAlimentosBase = async () => {
    try {
      setLoading(true);
      
      const alimentosParaInserir = alimentosBase.map(alimento => ({
        nome: alimento.nome,
        categoria: alimento.categoria,
        calorias_por_100g: alimento.calorias,
        proteinas_por_100g: alimento.proteinas,
        carboidratos_por_100g: alimento.carboidratos,
        gorduras_por_100g: alimento.gorduras,
        fibras_por_100g: alimento.fibras,
        is_publico: true,
        nutricionista_id: null
      }));

      const { error } = await supabase
        .from('alimentos')
        .insert(alimentosParaInserir);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Alimentos base adicionados com sucesso!",
      });

      carregarAlimentos();
    } catch (error) {
      console.error('Erro ao adicionar alimentos base:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar alimentos base.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      carregarAlimentos();
    }
  }, [open]);

  const handleAddAlimento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não autenticado.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('alimentos')
        .insert({
          nome: novoAlimento.nome,
          categoria: novoAlimento.categoria,
          calorias_por_100g: novoAlimento.calorias_por_100g,
          proteinas_por_100g: novoAlimento.proteinas_por_100g,
          carboidratos_por_100g: novoAlimento.carboidratos_por_100g,
          gorduras_por_100g: novoAlimento.gorduras_por_100g,
          fibras_por_100g: novoAlimento.fibras_por_100g,
          is_publico: false,
          nutricionista_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Alimento adicionado",
        description: "O alimento foi adicionado com sucesso!",
      });

      setNovoAlimento({
        nome: '',
        categoria: '',
        calorias_por_100g: 0,
        proteinas_por_100g: 0,
        carboidratos_por_100g: 0,
        gorduras_por_100g: 0,
        fibras_por_100g: 0
      });

      setShowAddForm(false);
      carregarAlimentos();
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar alimento.",
        variant: "destructive",
      });
    }
  };

  const deletarAlimento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alimentos')
        .delete()
        .eq('id', id)
        .eq('nutricionista_id', user?.id);

      if (error) throw error;

      toast({
        title: "Alimento removido",
        description: "O alimento foi removido com sucesso!",
      });

      carregarAlimentos();
    } catch (error) {
      console.error('Erro ao deletar alimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover alimento.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ChefHat className="w-5 h-5 mr-2" />
            Biblioteca de Alimentos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Controles */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {alimentos.length === 0 && (
                <Button
                  onClick={adicionarAlimentosBase}
                  disabled={loading}
                  variant="outline"
                >
                  Adicionar Alimentos Base
                </Button>
              )}
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Alimento
              </Button>
            </div>
          </div>

          {/* Formulário para novo alimento */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Alimento</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAlimento} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome do Alimento</Label>
                      <Input
                        id="nome"
                        value={novoAlimento.nome}
                        onChange={(e) => setNovoAlimento({...novoAlimento, nome: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoria">Categoria</Label>
                      <Input
                        id="categoria"
                        value={novoAlimento.categoria}
                        onChange={(e) => setNovoAlimento({...novoAlimento, categoria: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="calorias">Calorias/100g</Label>
                      <Input
                        id="calorias"
                        type="number"
                        step="0.1"
                        value={novoAlimento.calorias_por_100g}
                        onChange={(e) => setNovoAlimento({...novoAlimento, calorias_por_100g: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="proteinas">Proteínas/100g</Label>
                      <Input
                        id="proteinas"
                        type="number"
                        step="0.1"
                        value={novoAlimento.proteinas_por_100g}
                        onChange={(e) => setNovoAlimento({...novoAlimento, proteinas_por_100g: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carboidratos">Carboidratos/100g</Label>
                      <Input
                        id="carboidratos"
                        type="number"
                        step="0.1"
                        value={novoAlimento.carboidratos_por_100g}
                        onChange={(e) => setNovoAlimento({...novoAlimento, carboidratos_por_100g: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gorduras">Gorduras/100g</Label>
                      <Input
                        id="gorduras"
                        type="number"
                        step="0.1"
                        value={novoAlimento.gorduras_por_100g}
                        onChange={(e) => setNovoAlimento({...novoAlimento, gorduras_por_100g: Number(e.target.value)})}
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

          {/* Lista de alimentos */}
          <Card>
            <CardHeader>
              <CardTitle>Alimentos Cadastrados ({alimentos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Carregando...</div>
              ) : alimentos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum alimento cadastrado ainda.</p>
                  <p className="text-sm mt-2">Clique em "Adicionar Alimentos Base" para começar com uma base de alimentos comum.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Calorias/100g</TableHead>
                      <TableHead>Proteínas/100g</TableHead>
                      <TableHead>Carboidratos/100g</TableHead>
                      <TableHead>Gorduras/100g</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alimentos.map((alimento) => (
                      <TableRow key={alimento.id}>
                        <TableCell className="font-medium">{alimento.nome}</TableCell>
                        <TableCell>{alimento.categoria || '-'}</TableCell>
                        <TableCell>{alimento.calorias_por_100g}</TableCell>
                        <TableCell>{alimento.proteinas_por_100g}g</TableCell>
                        <TableCell>{alimento.carboidratos_por_100g}g</TableCell>
                        <TableCell>{alimento.gorduras_por_100g}g</TableCell>
                        <TableCell>
                          <Badge variant={alimento.is_publico ? 'default' : 'secondary'}>
                            {alimento.is_publico ? 'Público' : 'Privado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {alimento.nutricionista_id === user?.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deletarAlimento(alimento.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
