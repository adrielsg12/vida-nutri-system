import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AlimentoPesquisa {
  "Número do Alimento"?: number | null;
  "Categoria do alimento"?: string | null;
  "Descrição dos alimentos"?: string | null;
  "Saturados (g)"?: string | null;
  "Mono-insaturados (g)"?: string | null;
  "Poli-insaturados (g)"?: string | null;
  "12:0 (g)"?: string | null;
  "14:0 (g)"?: string | null;
  "16:0 (g)"?: string | null;
  "18:0 (g)"?: string | null;
  "20:0 (g)"?: string | null;
  "22:0 (g)"?: string | null;
  "24:0 (g)"?: string | null;
  "14:1 (g)"?: string | null;
  "16:1 (g)"?: string | null;
  "18:1 (g)"?: string | null;
  "20:1 (g)"?: string | null;
  "18:2 n-6 (g)"?: string | null;
  "18:3 n-3 (g)"?: string | null;
  "20:4 (g)"?: string | null;
  "20:5 (g)"?: string | null;
  "22:5 (g)"?: string | null;
  "22:6 (g)"?: string | null;
  "18:1t (g)"?: string | null;
  "18:2t (g)"?: string | null;
}

export type OrderableField =
  | 'Descrição dos alimentos'
  | 'Categoria do alimento'
  | 'Saturados (g)'
  | 'Mono-insaturados (g)'
  | 'Poli-insaturados (g)';

export interface FiltrosAlimento {
  descricao: string;
  categoria: string;
  saturadosMin: string;
  saturadosMax: string;
  monoinsaturadosMin: string;
  monoinsaturadosMax: string;
  poliinsaturadosMin: string;
  poliinsaturadosMax: string;
}

export const defaultFiltros: FiltrosAlimento = {
  descricao: "",
  categoria: "",
  saturadosMin: "",
  saturadosMax: "",
  monoinsaturadosMin: "",
  monoinsaturadosMax: "",
  poliinsaturadosMin: "",
  poliinsaturadosMax: "",
};

export function usePesquisaAlimentos() {
  const [alimentos, setAlimentos] = useState<AlimentoPesquisa[]>([]);
  const [alimentosFiltrados, setAlimentosFiltrados] = useState<AlimentoPesquisa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosAlimento>(defaultFiltros);
  const [ordenarPor, setOrdenarPor] = useState<OrderableField>("Descrição dos alimentos");
  const [ordemAsc, setOrdemAsc] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    async function carregarAlimentos() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Pesquisa_de_alimentos')
          .select(`*`)
          .order('"Descrição dos alimentos"');
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

    if (filtros.descricao) {
      filtrados = filtrados.filter(a =>
        (a["Descrição dos alimentos"] || "").toLowerCase().includes(filtros.descricao.toLowerCase())
      );
    }
    if (filtros.categoria) {
      filtrados = filtrados.filter(a =>
        a["Categoria do alimento"] === filtros.categoria
      );
    }
    if (filtros.saturadosMin) {
      filtrados = filtrados.filter(a => {
        const valor = parseFloat(a["Saturados (g)"] || "0");
        return valor >= Number(filtros.saturadosMin);
      });
    }
    if (filtros.saturadosMax) {
      filtrados = filtrados.filter(a => {
        const valor = parseFloat(a["Saturados (g)"] || "0");
        return valor <= Number(filtros.saturadosMax);
      });
    }
    if (filtros.monoinsaturadosMin) {
      filtrados = filtrados.filter(a => {
        const valor = parseFloat(a["Mono-insaturados (g)"] || "0");
        return valor >= Number(filtros.monoinsaturadosMin);
      });
    }
    if (filtros.monoinsaturadosMax) {
      filtrados = filtrados.filter(a => {
        const valor = parseFloat(a["Mono-insaturados (g)"] || "0");
        return valor <= Number(filtros.monoinsaturadosMax);
      });
    }
    if (filtros.poliinsaturadosMin) {
      filtrados = filtrados.filter(a => {
        const valor = parseFloat(a["Poli-insaturados (g)"] || "0");
        return valor >= Number(filtros.poliinsaturadosMin);
      });
    }
    if (filtros.poliinsaturadosMax) {
      filtrados = filtrados.filter(a => {
        const valor = parseFloat(a["Poli-insaturados (g)"] || "0");
        return valor <= Number(filtros.poliinsaturadosMax);
      });
    }

    filtrados = [...filtrados].sort((a, b) => {
      const fieldA = String(a[ordenarPor] ?? "");
      const fieldB = String(b[ordenarPor] ?? "");
      return ordemAsc ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    });

    setAlimentosFiltrados(filtrados);
  }

  function limparFiltros() {
    setFiltros(defaultFiltros);
  }

  function handleFiltroChange(field: keyof FiltrosAlimento, value: string) {
    setFiltros(prev => ({ ...prev, [field]: value }));
  }

  // Robustly sanitize categorias for Select
  const categorias: string[] = [
    ...new Set(
      alimentos
        .map(a => {
          const categoria = a["Categoria do alimento"];
          if (typeof categoria === "string") {
            const trimmed = categoria.trim();
            // Only allow non-empty, non-whitespace
            return trimmed.length > 0 ? trimmed : null;
          }
          return null;
        })
        // Only allow non-empty, non-null, non-undefined strings
        .filter((c): c is string => !!c && typeof c === "string" && c.trim().length > 0)
    ),
  ].sort();

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
