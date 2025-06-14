
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Alimento {
  id: string;
  nome: string;
  categoria: string | null;
  unidade_medida: string | null;
  // Campos TACO completos
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
  // Mantém para retrocompatibilidade
  calorias_por_100g?: number | null;
  proteinas_por_100g?: number | null;
  carboidratos_por_100g?: number | null;
  gorduras_por_100g?: number | null;
  fibras_por_100g?: number | null;
}

export const useAlimentosList = (open: boolean) => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlimentos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('alimentos')
        .select(`
          id, nome, categoria, unidade_medida,
          umidade, energia_kcal, energia_kj, proteina, lipideos, colesterol, carboidrato, fibra_alimentar, cinzas, calcio, magnesio, manganes, fosforo, ferro, sodio, potassio, cobre, zinco, retinol, re, rae,
          tiamina, riboflavina, piridoxina, niacina, vitamina_c, categoria_taco, codigo_taco,
          calorias_por_100g, proteinas_por_100g, carboidratos_por_100g, gorduras_por_100g, fibras_por_100g
        `)
        .order('nome');
      if (!error && data) setAlimentos(data);
      setLoading(false);
    };
    if (open) fetchAlimentos();
  }, [open]);

  return { alimentos, loading };
};
