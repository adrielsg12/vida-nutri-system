
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PartyPopper, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PacienteAniversariante {
  id: string;
  nome: string;
  telefone?: string;
  data_nascimento?: string;
}

export const AniversariantesMes: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<PacienteAniversariante[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAniversariantes = async () => {
      setLoading(true);
      // Busca do mês atual
      const hoje = new Date();
      const mes = hoje.getMonth() + 1;
      const { data, error } = await supabase
        .from("pacientes")
        .select("id, nome, telefone, data_nascimento")
        .neq("status", "inativo");
      if (!error && data) {
        // filtrar no frontend para casos em que o campo data_nascimento pode ser string ou null
        setList(
          data.filter(
            (p: PacienteAniversariante) =>
              p.data_nascimento &&
              new Date(p.data_nascimento).getMonth() + 1 === mes
          )
        );
      }
      setLoading(false);
    };
    if (open) fetchAniversariantes();
  }, [open]);

  const mensagemPadrao = (nome: string) =>
    encodeURIComponent(
      `Olá ${nome}! 🎉\n\nFeliz aniversário! Que este ano seja repleto de saúde, alegria e conquistas! — Equipe NutriSync`
    );

  const handleEnviarWhats = (paciente: PacienteAniversariante) => {
    if (!paciente.telefone) {
      toast({
        title: "Paciente sem telefone",
        description: `O paciente ${paciente.nome} não possui telefone cadastrado.`,
        variant: "destructive",
      });
      return;
    }
    const telefone = paciente.telefone.replace(/\D/g, "");
    const link = `https://wa.me/55${telefone}?text=${mensagemPadrao(paciente.nome)}`;
    window.open(link, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-orange-500" />
          Aniversariantes do mês
          <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)} className="ml-4">
            {open ? "Esconder" : "Ver lista"}
          </Button>
        </CardTitle>
      </CardHeader>
      {open && (
        <CardContent>
          {loading ? (
            <div className="py-4 text-muted-foreground">Carregando...</div>
          ) : list.length === 0 ? (
            <div className="py-4 text-muted-foreground">Nenhum aniversariante neste mês.</div>
          ) : (
            <div className="space-y-2">
              {list.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center py-2 px-1 border-b last:border-b-0"
                >
                  <span>{p.nome}</span>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleEnviarWhats(p)}
                    title="Enviar mensagem de feliz aniversário"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
