
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Paciente } from "./usePacientesList";

export const useSendEmailConfirmation = () => {
  const { toast } = useToast();
  // Envio efetivo do email
  return async ({
    paciente, data, hora, tipo, valor, observacoes
  }: {
    paciente: Paciente | undefined,
    data: string,
    hora: string,
    tipo: string,
    valor?: string,
    observacoes?: string
  }) => {
    if (!paciente) {
      toast({ title: "Erro", description: "Selecione o paciente antes de enviar.", variant: "destructive" });
      return;
    }
    if (!data || !hora) {
      toast({ title: "Erro", description: "Informe data e horário.", variant: "destructive" });
      return;
    }
    if (!paciente.email) {
      toast({ title: "Erro", description: "Paciente não possui e-mail cadastrado.", variant: "destructive" });
      return;
    }

    const dataToSend = {
      to: paciente.email,
      name: paciente.nome,
      date: new Date(data).toLocaleDateString("pt-BR"),
      time: hora,
      type: tipo,
      value: valor,
      notes: observacoes || ""
    };

    try {
      toast({ title: "Enviando...", description: "Enviando confirmação para o paciente..." });

      const { data, error } = await supabase.functions.invoke('send-consultation-confirmation', {
        body: dataToSend,
      });

      if (error) throw new Error(error.message || "Não foi possível enviar o e-mail.");

      if (data && data.success) {
        toast({ title: "Confirmação enviada!", description: "Paciente recebeu o e-mail de confirmação." });
      } else {
        throw new Error((data && data.error) || "Não foi possível enviar o e-mail.");
      }
    } catch (err: any) {
      toast({ title: "Erro!", description: err.message || "Não foi possível enviar o e-mail.", variant: "destructive" });
    }
  };
};
