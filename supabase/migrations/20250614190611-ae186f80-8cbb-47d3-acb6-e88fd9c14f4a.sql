
-- Criar tabela para registros de consultas (histórico clínico)
CREATE TABLE public.registros_consulta (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consulta_id uuid REFERENCES public.consultas ON DELETE CASCADE NOT NULL,
  paciente_id uuid REFERENCES public.pacientes ON DELETE CASCADE NOT NULL,
  nutricionista_id uuid REFERENCES auth.users NOT NULL,
  peso numeric,
  altura numeric,
  pressao_arterial_sistolica integer,
  pressao_arterial_diastolica integer,
  frequencia_cardiaca integer,
  circunferencia_cintura numeric,
  circunferencia_quadril numeric,
  percentual_gordura numeric,
  massa_muscular numeric,
  observacoes_clinicas text,
  queixas_principais text,
  evolucao text,
  conduta_nutricional text,
  retorno_recomendado date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.registros_consulta ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para registros de consulta
CREATE POLICY "Nutricionistas podem ver registros de suas consultas" ON public.registros_consulta
  FOR SELECT USING (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem criar registros de suas consultas" ON public.registros_consulta
  FOR INSERT WITH CHECK (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem atualizar registros de suas consultas" ON public.registros_consulta
  FOR UPDATE USING (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem deletar registros de suas consultas" ON public.registros_consulta
  FOR DELETE USING (nutricionista_id = auth.uid());
