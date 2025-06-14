
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Alimento {
  id: string;
  nome: string;
  categoria: string;
  unidade_medida: string;
}

export const useAlimentosList = (open: boolean) => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlimentos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('alimentos')
        .select('id, nome, categoria, unidade_medida')
        .order('nome');
      if (!error && data) setAlimentos(data);
      setLoading(false);
    };
    if (open) fetchAlimentos();
  }, [open]);

  return { alimentos, loading };
};
