
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Paciente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
}

export const usePacientesList = (open: boolean) => {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase
          .from("pacientes")
          .select("id, nome, email, telefone")
          .eq("nutricionista_id", user.id)
          .eq("status", "ativo")
          .order("nome");
        if (!error) setPatients(data || []);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
      } finally {
        setLoading(false);
      }
    };
    if (open) fetchPatients();
  }, [open]);

  return { patients, loading };
};
