import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AlimentoCompleto {
  id: string;
  nome: string;
  categoria_taco?: string | null;
  energia_kcal?: number | null;
  proteina?: number | null;
  carboidrato?: number | null;
  lipideos?: number | null;
  fibra_alimentar?: number | null;
}

export interface EquivalenciaAlimento extends AlimentoCompleto {
  quantidadeEquivalente: number;
  baseCalculo: string;
}

// Grupos de substituição baseados em categorias nutricionais
const GRUPOS_SUBSTITUICAO = {
  'Cereais, raízes, tubérculos e derivados': ['Cereais, raízes, tubérculos e derivados'],
  'Verduras, hortaliças e derivados': ['Verduras, hortaliças e derivados'],
  'Frutos e derivados': ['Frutos e derivados'],
  'Gorduras e óleos': ['Gorduras e óleos'],
  'Leite e derivados': ['Leite e derivados'],
  'Carnes e derivados': ['Carnes e derivados'],
  'Ovos e derivados': ['Ovos e derivados'],
  'Leguminosas e derivados': ['Leguminosas e derivados'],
  'Nozes e sementes': ['Nozes e sementes'],
  'Açúcares e produtos de confeitaria': ['Açúcares e produtos de confeitaria'],
  'Produtos industrializados': ['Produtos industrializados'],
  'Bebidas': ['Bebidas'],
  'Miscelâneas': ['Miscelâneas']
};

export function useEquivalenciasAlimentos() {
  const [alimentos, setAlimentos] = useState<AlimentoCompleto[]>([]);
  const [equivalencias, setEquivalencias] = useState<EquivalenciaAlimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [alimentoBusca, setAlimentoBusca] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    carregarAlimentos();
  }, []);

  async function carregarAlimentos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alimentos')
        .select('id, nome, categoria_taco, energia_kcal, proteina, carboidrato, lipideos, fibra_alimentar')
        .not('energia_kcal', 'is', null)
        .order('nome');
        
      if (error) throw error;
      setAlimentos(data || []);
    } catch (error) {
      console.error('[EquivalenciasAlimentos] Erro ao carregar alimentos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar alimentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function calcularEquivalencias(alimentoBase: AlimentoCompleto, quantidadeBase: number = 100) {
    if (!alimentoBase.energia_kcal) {
      setEquivalencias([]);
      return;
    }

    // Encontrar categoria do alimento base
    const categoriaBase = alimentoBase.categoria_taco;
    if (!categoriaBase) {
      setEquivalencias([]);
      return;
    }

    // Buscar grupos que contêm a categoria
    const grupoEquivalente = Object.values(GRUPOS_SUBSTITUICAO).find(
      categorias => categorias.some(cat => 
        categoriaBase.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(categoriaBase.toLowerCase())
      )
    );

    if (!grupoEquivalente) {
      setEquivalencias([]);
      return;
    }

    // Filtrar alimentos do mesmo grupo
    const alimentosDoGrupo = alimentos.filter(alimento => 
      alimento.id !== alimentoBase.id && 
      alimento.categoria_taco &&
      grupoEquivalente.some(cat => 
        alimento.categoria_taco!.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(alimento.categoria_taco!.toLowerCase())
      )
    );

    // Calcular equivalências baseado em energia
    const caloriasBase = alimentoBase.energia_kcal * (quantidadeBase / 100);
    
    const equivalenciasCalculadas: EquivalenciaAlimento[] = alimentosDoGrupo
      .filter(alimento => alimento.energia_kcal && alimento.energia_kcal > 0)
      .map(alimento => {
        const quantidadeEquivalente = (caloriasBase / alimento.energia_kcal!) * 100;
        
        return {
          ...alimento,
          quantidadeEquivalente: Math.round(quantidadeEquivalente),
          baseCalculo: 'calorias'
        };
      })
      .filter(equiv => equiv.quantidadeEquivalente > 0 && equiv.quantidadeEquivalente < 1000)
      .sort((a, b) => a.quantidadeEquivalente - b.quantidadeEquivalente);

    setEquivalencias(equivalenciasCalculadas);
  }

  function buscarAlimento(termoBusca: string) {
    setAlimentoBusca(termoBusca);
    
    if (!termoBusca.trim()) {
      setEquivalencias([]);
      return;
    }

    const alimentoEncontrado = alimentos.find(alimento =>
      alimento.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    if (alimentoEncontrado) {
      calcularEquivalencias(alimentoEncontrado, 100);
    } else {
      setEquivalencias([]);
    }
  }

  function buscarPorId(alimentoId: string, quantidade: number = 100) {
    const alimento = alimentos.find(a => a.id === alimentoId);
    if (alimento) {
      calcularEquivalencias(alimento, quantidade);
    }
  }

  return {
    alimentos,
    equivalencias,
    loading,
    alimentoBusca,
    buscarAlimento,
    buscarPorId,
    calcularEquivalencias
  };
}