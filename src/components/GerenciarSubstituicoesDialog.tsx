
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Trash2, Users } from 'lucide-react';

interface Alimento {
  id: string;
  nome: string;
}

interface GrupoSubstituicao {
  id: string;
  nome: string;
  descricao?: string;
  itens_substituicao: {
    id: string;
    quantidade_equivalente: number;
    unidade_medida: string;
    alimentos: {
      nome: string;
    };
  }[];
}

interface GerenciarSubstituicoesDialogProps {
  open: boolean;
  onClose: () => void;
}

export const GerenciarSubstituicoesDialog = ({ open, onClose }: GerenciarSubstituicoesDialogProps) => {
  const [grupos, setGrupos] = useState<GrupoSubstituicao[]>([]);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [novoGrupo, setNovoGrupo] = useState({ nome: '', descricao: '' });
  const [showFormGrupo, setShowFormGrupo] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null);
  const [novoItem, setNovoItem] = useState({
    alimento_id: '',
    quantidade_equivalente: 100,
    unidade_medida: 'g'
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  const carregarDados = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Carregar grupos de substituição
      const { data: gruposData, error: gruposError } = await supabase
        .from('grupos_substituicao')
        .select(`
          id,
          nome,
          descricao,
          itens_substituicao (
            id,
            quantidade_equivalente,
            unidade_medida,
            alimentos (nome)
          )
        `)
        .eq('nutricionista_id', user.id)
        .order('nome');

      if (gruposError) throw gruposError;

      // Carregar alimentos disponíveis
      const { data: alimentosData, error: alimentosError } = await supabase
        .from('alimentos')
        .select('id, nome')
        .order('nome');

      if (alimentosError) throw alimentosError;

      setGrupos(gruposData || []);
      setAlimentos(alimentosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar grupos de substituição.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      carregarDados();
    }
  }, [open, user]);

  const handleSubmitGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (!novoGrupo.nome) {
        toast({
          title: "Campo obrigatório",
          description: "Preencha o nome do grupo.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('grupos_substituicao')
        .insert({
          nutricionista_id: user.id,
          nome: novoGrupo.nome,
          descricao: novoGrupo.descricao || null
        });

      if (error) throw error;

      toast({
        title: "Grupo criado",
        description: "O grupo de substituição foi criado com sucesso.",
      });

      setNovoGrupo({ nome: '', descricao: '' });
      setShowFormGrupo(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar grupo de substituição.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grupoSelecionado) return;

    try {
      if (!novoItem.alimento_id) {
        toast({
          title: "Campo obrigatório",
          description: "Selecione um alimento.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('itens_substituicao')
        .insert({
          grupo_id: grupoSelecionado,
          alimento_id: novoItem.alimento_id,
          quantidade_equivalente: novoItem.quantidade_equivalente,
          unidade_medida: novoItem.unidade_medida
        });

      if (error) throw error;

      toast({
        title: "Item adicionado",
        description: "O alimento foi adicionado ao grupo.",
      });

      setNovoItem({
        alimento_id: '',
        quantidade_equivalente: 100,
        unidade_medida: 'g'
      });

      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar alimento ao grupo.",
        variant: "destructive",
      });
    }
  };

  const deletarGrupo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('grupos_substituicao')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Grupo removido",
        description: "O grupo de substituição foi removido.",
      });

      carregarDados();
    } catch (error) {
      console.error('Erro ao deletar grupo:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover grupo.",
        variant: "destructive",
      });
    }
  };

  const deletarItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('itens_substituicao')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Item removido",
        description: "O alimento foi removido do grupo.",
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Substituições</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Criar novo grupo */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Grupos de Substituição</h3>
            <Button
              onClick={() => setShowFormGrupo(!showFormGrupo)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Grupo
            </Button>
          </div>

          {/* Formulário para novo grupo */}
          {showFormGrupo && (
            <form onSubmit={handleSubmitGrupo} className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeGrupo">Nome do Grupo *</Label>
                  <Input
                    id="nomeGrupo"
                    value={novoGrupo.nome}
                    onChange={(e) => setNovoGrupo({...novoGrupo, nome: e.target.value})}
                    placeholder="Ex: Fontes de Proteína"
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricaoGrupo">Descrição</Label>
                  <Textarea
                    id="descricaoGrupo"
                    value={novoGrupo.descricao}
                    onChange={(e) => setNovoGrupo({...novoGrupo, descricao: e.target.value})}
                    placeholder="Descrição opcional do grupo"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Criar Grupo
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowFormGrupo(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}

          {/* Lista de grupos */}
          <div className="grid gap-4">
            {grupos.map((grupo) => (
              <Card key={grupo.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      {grupo.nome}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletarGrupo(grupo.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                  {grupo.descricao && (
                    <p className="text-sm text-gray-600">{grupo.descricao}</p>
                  )}
                </CardHeader>
                
                <CardContent>
                  {/* Formulário para adicionar item ao grupo */}
                  {grupoSelecionado === grupo.id ? (
                    <form onSubmit={handleSubmitItem} className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-3 gap-3">
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
                        
                        <Input
                          type="number"
                          placeholder="Quantidade"
                          value={novoItem.quantidade_equivalente}
                          onChange={(e) => setNovoItem({...novoItem, quantidade_equivalente: Number(e.target.value)})}
                        />
                        
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
                      
                      <div className="flex gap-2 mt-3">
                        <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Adicionar
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setGrupoSelecionado(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <Button
                      onClick={() => setGrupoSelecionado(grupo.id)}
                      variant="outline"
                      size="sm"
                      className="mb-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Alimento
                    </Button>
                  )}

                  {/* Lista de itens do grupo */}
                  {grupo.itens_substituicao.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Alimento</TableHead>
                          <TableHead>Quantidade Equivalente</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {grupo.itens_substituicao.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.alimentos.nome}</TableCell>
                            <TableCell>{item.quantidade_equivalente} {item.unidade_medida}</TableCell>
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
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum alimento adicionado a este grupo ainda.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {grupos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum grupo de substituição criado ainda.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
