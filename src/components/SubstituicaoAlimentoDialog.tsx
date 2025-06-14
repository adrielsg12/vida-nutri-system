
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, ArrowRightLeft } from 'lucide-react';

interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  calorias_por_100g: number;
  proteinas_por_100g: number;
  carboidratos_por_100g: number;
  gorduras_por_100g: number;
  fibras_por_100g: number;
}

interface SubstituicaoAlimentoDialogProps {
  open: boolean;
  onClose: () => void;
  alimentoOriginal: Alimento;
  onSubstituir: (novoAlimento: Alimento) => void;
}

export const SubstituicaoAlimentoDialog = ({ 
  open, 
  onClose, 
  alimentoOriginal,
  onSubstituir 
}: SubstituicaoAlimentoDialogProps) => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');
  const [alimentosFiltrados, setAlimentosFiltrados] = useState<Alimento[]>([]);
  
  const { toast } = useToast();

  const carregarAlimentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alimentos')
        .select('*')
        .eq('categoria', alimentoOriginal.categoria)
        .neq('id', alimentoOriginal.id)
        .order('nome');

      if (error) throw error;

      setAlimentos(data || []);
      setAlimentosFiltrados(data || []);
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alimentos para substituição.",
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
  }, [open, alimentoOriginal]);

  useEffect(() => {
    if (busca) {
      const filtrados = alimentos.filter(alimento =>
        alimento.nome.toLowerCase().includes(busca.toLowerCase())
      );
      setAlimentosFiltrados(filtrados);
    } else {
      setAlimentosFiltrados(alimentos);
    }
  }, [busca, alimentos]);

  const handleSubstituir = (novoAlimento: Alimento) => {
    onSubstituir(novoAlimento);
    toast({
      title: "Alimento substituído",
      description: `${alimentoOriginal.nome} foi substituído por ${novoAlimento.nome}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ArrowRightLeft className="w-5 h-5 mr-2" />
            Substituir Alimento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alimento original */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Alimento Original:</h3>
            <div className="grid grid-cols-6 gap-4 text-sm">
              <div><strong>{alimentoOriginal.nome}</strong></div>
              <div>{alimentoOriginal.calorias_por_100g} kcal</div>
              <div>{alimentoOriginal.proteinas_por_100g}g prot</div>
              <div>{alimentoOriginal.carboidratos_por_100g}g carb</div>
              <div>{alimentoOriginal.gorduras_por_100g}g gord</div>
              <div>{alimentoOriginal.fibras_por_100g}g fibra</div>
            </div>
          </div>

          {/* Busca */}
          <div className="space-y-2">
            <Label htmlFor="busca">Buscar alimento substituto</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                id="busca"
                placeholder="Digite o nome do alimento..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lista de substitutos */}
          <div>
            <h3 className="font-semibold mb-2">
              Alimentos da categoria "{alimentoOriginal.categoria}" ({alimentosFiltrados.length})
            </h3>
            
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : alimentosFiltrados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum alimento encontrado para substituição.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alimento</TableHead>
                    <TableHead>Calorias/100g</TableHead>
                    <TableHead>Proteínas/100g</TableHead>
                    <TableHead>Carboidratos/100g</TableHead>
                    <TableHead>Gorduras/100g</TableHead>
                    <TableHead>Fibras/100g</TableHead>
                    <TableHead>Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alimentosFiltrados.map((alimento) => (
                    <TableRow key={alimento.id}>
                      <TableCell className="font-medium">{alimento.nome}</TableCell>
                      <TableCell>{alimento.calorias_por_100g}</TableCell>
                      <TableCell>{alimento.proteinas_por_100g}g</TableCell>
                      <TableCell>{alimento.carboidratos_por_100g}g</TableCell>
                      <TableCell>{alimento.gorduras_por_100g}g</TableCell>
                      <TableCell>{alimento.fibras_por_100g}g</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSubstituir(alimento)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Substituir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
