
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida?: string | null;
  umidade?: number | null;
  energia_kcal?: number | null;
  energia_kj?: number | null;
  proteina?: number | null;
  lipideos?: number | null;
  colesterol?: number | null;
  carboidrato?: number | null;
  fibra_alimentar?: number | null;
  cinzas?: number | null;
  calcio?: number | null;
  magnesio?: number | null;
  manganes?: number | null;
  fosforo?: number | null;
  ferro?: number | null;
  sodio?: number | null;
  potassio?: number | null;
  cobre?: number | null;
  zinco?: number | null;
  retinol?: number | null;
  re?: number | null;
  rae?: number | null;
  tiamina?: number | null;
  riboflavina?: number | null;
  piridoxina?: number | null;
  niacina?: number | null;
  vitamina_c?: number | null;
  categoria_taco?: string | null;
  codigo_taco?: string | null;
  calorias_por_100g?: number | null;
  proteinas_por_100g?: number | null;
  carboidratos_por_100g?: number | null;
  gorduras_por_100g?: number | null;
  fibras_por_100g?: number | null;
}

export type OrderableField =
  | 'nome'
  | 'proteina'
  | 'lipideos'
  | 'carboidrato'
  | 'energia_kcal'
  | 'fibras_por_100g'
  | 'calorias_por_100g'
  | 'colesterol';

export interface FiltrosAlimento {
  nome: string;
  categoria: string;
  proteinaMin: string;
  proteinaMax: string;
  lipideosMin: string;
  lipideosMax: string;
  carboidratoMin: string;
  carboidratoMax: string;
  energiaKcalMin: string;
  energiaKcalMax: string;
}

export const defaultFiltros: FiltrosAlimento = {
  nome: "",
  categoria: "",
  proteinaMin: "",
  proteinaMax: "",
  lipideosMin: "",
  lipideosMax: "",
  carboidratoMin: "",
  carboidratoMax: "",
  energiaKcalMin: "",
  energiaKcalMax: "",
};

export function usePesquisaAlimentos() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosAlimento>(defaultFiltros);
  const [ordenarPor, setOrdenarPor] = useState<OrderableField>("nome");
  const [ordemAsc, setOrdemAsc] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    async function carregarAlimentos() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('alimentos')
          .select(`*`)
          .order('nome');
        if (error) throw error;
        setAlimentos(data || []);
        setAlimentosFiltrados(data || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('[PesquisaAlimentos] Erro ao carregar alimentos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar alimentos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    carregarAlimentos();
  }, []);

  useEffect(() => {
    aplicarFiltros();
    // eslint-disable-next-line
  }, [alimentos, filtros, ordenarPor, ordemAsc]);

  function aplicarFiltros() {
    let filtrados = alimentos;

    if (filtros.nome) {
      filtrados = filtrados.filter(a =>
        a.nome.toLowerCase().includes(filtros.nome.toLowerCase())
      );
    }
    if (filtros.categoria) {
      filtrados = filtrados.filter(a =>
        a.categoria === filtros.categoria
      );
    }
    if (filtros.proteinaMin) {
      filtrados = filtrados.filter(a =>
        (a.proteina ?? 0) >= Number(filtros.proteinaMin)
      );
    }
    if (filtros.proteinaMax) {
      filtrados = filtrados.filter(a =>
        (a.proteina ?? 0) <= Number(filtros.proteinaMax)
      );
    }
    if (filtros.lipideosMin) {
      filtrados = filtrados.filter(a =>
        (a.lipideos ?? 0) >= Number(filtros.lipideosMin)
      );
    }
    if (filtros.lipideosMax) {
      filtrados = filtrados.filter(a =>
        (a.lipideos ?? 0) <= Number(filtros.lipideosMax)
      );
    }
    if (filtros.carboidratoMin) {
      filtrados = filtrados.filter(a =>
        (a.carboidrato ?? 0) >= Number(filtros.carboidratoMin)
      );
    }
    if (filtros.carboidratoMax) {
      filtrados = filtrados.filter(a =>
        (a.carboidrato ?? 0) <= Number(filtros.carboidratoMax)
      );
    }
    if (filtros.energiaKcalMin) {
      filtrados = filtrados.filter(a =>
        (a.energia_kcal ?? 0) >= Number(filtros.energiaKcalMin)
      );
    }
    if (filtros.energiaKcalMax) {
      filtrados = filtrados.filter(a =>
        (a.energia_kcal ?? 0) <= Number(filtros.energiaKcalMax)
      );
    }

    filtrados = [...filtrados].sort((a, b) => {
      const fieldA = (a[ordenarPor] ?? 0) as number;
      const fieldB = (b[ordenarPor] ?? 0) as number;
      return ordemAsc ? fieldA - fieldB : fieldB - fieldA;
    });

    setAlimentosFiltrados(filtrados);
  }

  function limparFiltros() {
    setFiltros(defaultFiltros);
  }

  function handleFiltroChange(field: keyof FiltrosAlimento, value: string) {
    setFiltros(prev => ({ ...prev, [field]: value }));
  }

  // Sanitiza categorias para options válidos
  const categorias: string[] = [
    ...new Set(
      alimentos
        .map(a => {
          if (typeof a.categoria !== "string") return null;
          const trimmed = a.categoria.trim();
          return trimmed.length === 0 ? null : trimmed;
        })
        .filter(
          (c): c is string =>
            typeof c === "string" && c.length > 0 && c !== ""
        )
    )
  ].sort();

  if (
    categorias.some(c => c === "" || typeof c !== "string" || !c.trim())
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      "[PesquisaAlimentos] Detectado valor de categoria inválido no SelectItem:",
      categorias
    );
  }

  return {
    alimentosFiltrados,
    filtros,
    loading,
    limparFiltros,
    handleFiltroChange,
    categorias,
    ordenarPor,
    setOrdenarPor,
    ordemAsc,
    setOrdemAsc,
    aplicarFiltros,
  };
}
