
import { useToast } from "@/hooks/use-toast";
import { Paciente } from "./usePacientesList";

export const useSendWhatsappConfirmation = () => {
  const { toast } = useToast();

  const formatConsultaToWhatsapp = ({
    pacienteNome, data, hora, tipo, valor, observacoes
  }: {
    pacienteNome: string, data: string, hora: string, tipo: string, valor?: string, observacoes?: string
  }) => {
    const dataBR = data ? new Date(data).toLocaleDateString("pt-BR") : "";
    let txt = `Olá${pacienteNome ? `, ${pacienteNome}` : ""}! Sua consulta está confirmada para ${dataBR} às ${hora}.`;
    txt += `\nTipo: ${tipo === "presencial" ? "Presencial" : "Online"}`;
    if (valor) txt += `\nValor: R$ ${valor}`;
    if (observacoes) txt += `\nObs: ${observacoes}`;
    txt += "\nQualquer dúvida, estou à disposição!";
    return txt;
  };

  return ({
    paciente,
    data,
    hora,
    tipo,
    valor,
    observacoes
  }: {
    paciente: Paciente | undefined;
    data: string;
    hora: string;
    tipo: string;
    valor?: string;
    observacoes?: string;
  }) => {
    if (!paciente || !paciente.telefone) {
      toast({ title: "Telefone não encontrado", description: "Selecione o paciente e cadastre um telefone válido.", variant: "destructive", });
      return;
    }
    if (!data || !hora) {
      toast({ title: "Data/hora faltando", description: "Informe a data e hora da consulta.", variant: "destructive", });
      return;
    }
    const telefone = paciente.telefone.replace(/\D/g, "");
    const mensagem = encodeURIComponent(
      formatConsultaToWhatsapp({
        pacienteNome: paciente.nome,
        data,
        hora,
        tipo,
        valor,
        observacoes,
      })
    );
    const url = `https://wa.me/55${telefone}?text=${mensagem}`;
    window.open(url, '_blank');
    toast({ title: "WhatsApp Aberto", description: "O WhatsApp Web foi aberto em uma nova aba." });
  };
};
