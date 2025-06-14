
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

interface Alimento {
  id: string;
  nome: string;
  categoria?: string;
  quantidade_padrao: number;
  unidade_medida: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carboidratos_por_100g: number;
  gorduras_por_100g: number;
  is_publico: boolean;
}

interface GerenciarAlimentosDialogProps {
  open: boolean;
  onClose: () => void;
}

export const GerenciarAlimentosDialog = ({ open, onClose }: GerenciarAlimentosDialogProps) => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [filteredAlimentos, setFilteredAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [novoAlimento, setNovoAlimento] = useState({
    nome: '',
    categoria: '',
    quantidade_padrao: 100,
    unidade_medida: 'g',
    calorias_por_100g: 0,
    proteinas_por_100g: 0,
    carboidratos_por_100g: 0,
    gorduras_por_100g: 0
  });
  const [showForm, setShowForm] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const categorias = [
    'Cereais', 'Proteínas', 'Frutas', 'Vegetais', 'Laticínios', 
    'Leguminosas', 'Oleaginosas', 'Tubérculos', 'Óleos e gorduras'
  ];

  const carregarAlimentos = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .select('*')
        .order('nome');

      if (error) throw error;

      setAlimentos(data || []);
      setFilteredAlimentos(data || []);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar biblioteca de alimentos.",
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
  }, [open, user]);

  useEffect(() => {
    let alimentosFiltrados = alimentos;

    if (busca) {
      alimentosFiltrados = alimentosFiltrados.filter(alimento =>
        alimento.nome.toLowerCase().includes(busca.toLowerCase()) ||
        (alimento.categoria && alimento.categoria.toLowerCase().includes(busca.toLowerCase()))
      );
    }

    if (filtroCategoria !== 'todas') {
      alimentosFiltrados = alimentosFiltrados.filter(alimento => 
        alimento.categoria === filtroCategoria
      );
    }

    setFilteredAlimentos(alimentosFiltrados);
  }, [busca, filtroCategoria, alimentos]);

  const handleSubmitAlimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (!novoAlimento.nome) {
        toast({
          title: "Campo obrigatório",
          description: "Preencha o nome do alimento.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('alimentos')
        .insert({
          nutricionista_id: user.id,
          nome: novoAlimento.nome,
          categoria: novoAlimento.categoria || null,
          quantidade_padrao: novoAlimento.quantidade_padrao,
          unidade_medida: novoAlimento.unidade_medida,
          calorias_por_100g: novoAlimento.calorias_por_100g,
          proteinas_por_100g: novoAlimento.proteinas_por_100g,
          carboidratos_por_100g: novoAlimento.carboidratos_por_100g,
          gorduras_por_100g: novoAlimento.gorduras_por_100g,
          is_publico: false
        });

      if (error) throw error;

      toast({
        title: "Alimento adicionado",
        description: "O alimento foi adicionado à sua biblioteca.",
      });

      setNovoAlimento({
        nome: '',
        categoria: '',
        quantidade_padrao: 100,
        unidade_medida: 'g',
        calorias_por_100g: 0,
        proteinas_por_100g: 0,
        carboidratos_por_100g: 0,
        gorduras_por_100g: 0
      });

      setShowForm(false);
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
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Alimento removido",
        description: "O alimento foi removido da biblioteca.",
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
          <DialogTitle>Biblioteca de Alimentos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Botão para adicionar novo alimento */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Seus Alimentos</h3>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Alimento
            </Button>
          </div>

          {/* Formulário para novo alimento */}
          {showForm && (
            <form onSubmit={handleSubmitAlimento} className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome do Alimento *</Label>
                  <Input
                    id="nome"
                    value={novoAlimento.nome}
                    onChange={(e) => setNovoAlimento({...novoAlimento, nome: e.target.value})}
                    placeholder="Ex: Peito de frango grelhado"
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select 
                    value={novoAlimento.categoria} 
                    onValueChange={(value) => setNovoAlimento({...novoAlimento, categoria: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="quantidade">Qtd Padrão</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={novoAlimento.quantidade_padrao}
                    onChange={(e) => setNovoAlimento({...novoAlimento, quantidade_padrao: Number(e.target.value)})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select 
                    value={novoAlimento.unidade_medida} 
                    onValueChange={(value) => setNovoAlimento({...novoAlimento, unidade_medida: value})}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {/* Filtros */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Buscar alimentos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de alimentos */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Calorias</TableHead>
                  <TableHead>Proteínas</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlimentos.map((alimento) => (
                  <TableRow key={alimento.id}>
                    <TableCell className="font-medium">{alimento.nome}</TableCell>
                    <TableCell>{alimento.categoria || '-'}</TableCell>
                    <TableCell>{alimento.quantidade_padrao}{alimento.unidade_medida}</TableCell>
                    <TableCell>{alimento.calorias_por_100g}kcal</TableCell>
                    <TableCell>{alimento.proteinas_por_100g}g</TableCell>
                    <TableCell>
                      {alimento.is_publico ? (
                        <Badge variant="outline">Público</Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-800">Seu</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!alimento.is_publico && (
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
            
            {filteredAlimentos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum alimento encontrado.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
