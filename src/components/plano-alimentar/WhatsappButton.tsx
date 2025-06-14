
import React from "react";
import { Button } from "@/components/ui/button";
import { Paciente, ItemPlano } from "@/components/PlanoAlimentarFormDialog";
import { Alimento } from "@/hooks/useAlimentosList";
import { useToast } from "@/hooks/use-toast";

interface WhatsappButtonProps {
  paciente: Paciente | undefined;
  formData: {
    titulo: string;
    descricao?: string;
    itens_plano_alimentar: ItemPlano[];
  };
  alimentos: Alimento[];
}

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function formatPlanoToWhatsapp(formData: WhatsappButtonProps['formData'], alimentos: Alimento[]) {
  let texto = `🍎 *Seu Plano Alimentar*\n\n`;
  if (formData.titulo) texto += `*${formData.titulo}*\n`;
  if (formData.descricao) texto += `${formData.descricao}\n\n`;

  texto += DIAS.map((dia, diaIdx) => {
    const items = formData.itens_plano_alimentar.filter(i => i.dia_semana === diaIdx);
    if (items.length === 0) return '';
    let str = `*${dia}:*\n`;
    str += items.map(item => {
      const alimento = alimentos.find(a => a.id === item.alimento_id);
      const alimentoNome = alimento ? alimento.nome : "Alimento";
      return `- ${item.refeicao}: ${item.quantidade} ${item.unidade_medida} de ${alimentoNome}${item.horario_recomendado ? ` às ${item.horario_recomendado}` : ''}${item.observacoes ? ` (${item.observacoes})` : ''}`;
    }).join('\n');
    return str + '\n';
  }).join('\n');
  return texto.trim();
}

export const WhatsappButton: React.FC<WhatsappButtonProps> = ({ paciente, formData, alimentos }) => {
  const { toast } = useToast();

  const handleEnviarWhatsApp = () => {
    if (!paciente || !paciente.telefone) {
      toast({
        title: "Telefone não encontrado",
        description: "O paciente não possui número de telefone cadastrado.",
        variant: "destructive",
      });
      return;
    }
    const telefone = paciente.telefone.replace(/\D/g, '');
    const mensagem = encodeURIComponent(formatPlanoToWhatsapp(formData, alimentos));
    const url = `https://wa.me/55${telefone}?text=${mensagem}`;
    window.open(url, '_blank');
    toast({
      title: "WhatsApp Aberto",
      description: "O WhatsApp Web foi aberto em uma nova aba.",
    });
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleEnviarWhatsApp}
      disabled={!paciente || !paciente.telefone || formData.itens_plano_alimentar.length === 0}
    >
      Enviar via WhatsApp
    </Button>
  );
};

