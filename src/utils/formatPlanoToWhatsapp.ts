
import { ItemPlano } from "@/components/PlanoAlimentarFormDialog";
import { Alimento } from "@/hooks/useAlimentosList";

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export function formatPlanoToWhatsapp({
  titulo,
  descricao,
  itens_plano_alimentar,
}: {
  titulo: string;
  descricao?: string;
  itens_plano_alimentar: ItemPlano[];
}, alimentos: Alimento[]) {
  let texto = `🍎 *Seu Plano Alimentar*\n\n`;
  if (titulo) texto += `*${titulo}*\n`;
  if (descricao) texto += `${descricao}\n\n`;

  texto += DIAS.map((dia, diaIdx) => {
    const items = itens_plano_alimentar.filter(i => i.dia_semana === diaIdx);
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
