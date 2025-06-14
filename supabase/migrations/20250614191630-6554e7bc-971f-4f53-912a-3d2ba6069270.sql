
-- Adicionar novas colunas de circunferências na tabela registros_consulta
ALTER TABLE public.registros_consulta 
ADD COLUMN circunferencia_peito numeric,
ADD COLUMN circunferencia_panturrilha numeric,
ADD COLUMN circunferencia_coxa numeric,
ADD COLUMN circunferencia_biceps numeric;

-- Criar tabela para relatórios de evolução do paciente
CREATE TABLE public.relatorios_evolucao (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  paciente_id uuid REFERENCES public.pacientes ON DELETE CASCADE NOT NULL,
  nutricionista_id uuid REFERENCES auth.users NOT NULL,
  periodo_inicio date NOT NULL,
  periodo_fim date NOT NULL,
  dados_evolucao jsonb NOT NULL, -- Armazenará os dados compilados da evolução
  observacoes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS para relatórios de evolução
ALTER TABLE public.relatorios_evolucao ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para relatórios de evolução
CREATE POLICY "Nutricionistas podem ver seus relatórios" ON public.relatorios_evolucao
  FOR SELECT USING (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem criar seus relatórios" ON public.relatorios_evolucao
  FOR INSERT WITH CHECK (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem atualizar seus relatórios" ON public.relatorios_evolucao
  FOR UPDATE USING (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem deletar seus relatórios" ON public.relatorios_evolucao
  FOR DELETE USING (nutricionista_id = auth.uid());
