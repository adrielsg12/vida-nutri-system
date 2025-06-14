
-- Criar tabela de alimentos da biblioteca
CREATE TABLE public.alimentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nutricionista_id uuid REFERENCES auth.users,
  nome text NOT NULL,
  categoria text,
  quantidade_padrao numeric DEFAULT 100,
  unidade_medida text DEFAULT 'g',
  calorias_por_100g numeric DEFAULT 0,
  proteinas_por_100g numeric DEFAULT 0,
  carboidratos_por_100g numeric DEFAULT 0,
  gorduras_por_100g numeric DEFAULT 0,
  fibras_por_100g numeric DEFAULT 0,
  is_publico boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de grupos de substituição
CREATE TABLE public.grupos_substituicao (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nutricionista_id uuid REFERENCES auth.users NOT NULL,
  nome text NOT NULL,
  descricao text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de itens de substituição
CREATE TABLE public.itens_substituicao (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  grupo_id uuid REFERENCES public.grupos_substituicao ON DELETE CASCADE NOT NULL,
  alimento_id uuid REFERENCES public.alimentos ON DELETE CASCADE NOT NULL,
  quantidade_equivalente numeric DEFAULT 100,
  unidade_medida text DEFAULT 'g',
  observacoes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de itens do plano alimentar
CREATE TABLE public.itens_plano_alimentar (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plano_id uuid REFERENCES public.planos_alimentares ON DELETE CASCADE NOT NULL,
  dia_semana integer NOT NULL, -- 0 = domingo, 1 = segunda, etc
  refeicao text NOT NULL, -- 'cafe_manha', 'lanche_manha', 'almoco', 'lanche_tarde', 'pre_treino', 'pos_treino', 'jantar', 'ceia'
  alimento_id uuid REFERENCES public.alimentos ON DELETE CASCADE NOT NULL,
  quantidade numeric NOT NULL,
  unidade_medida text NOT NULL,
  horario_recomendado time,
  observacoes text,
  ordem integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.alimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos_substituicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_substituicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_plano_alimentar ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para alimentos (permitindo alimentos públicos sem nutricionista)
CREATE POLICY "Nutricionistas podem ver seus alimentos e alimentos públicos" ON public.alimentos
  FOR SELECT USING (nutricionista_id = auth.uid() OR nutricionista_id IS NULL OR is_publico = true);

CREATE POLICY "Nutricionistas podem criar alimentos" ON public.alimentos
  FOR INSERT WITH CHECK (nutricionista_id = auth.uid() OR (nutricionista_id IS NULL AND is_publico = true));

CREATE POLICY "Nutricionistas podem atualizar seus alimentos" ON public.alimentos
  FOR UPDATE USING (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem deletar seus alimentos" ON public.alimentos
  FOR DELETE USING (nutricionista_id = auth.uid());

-- Políticas RLS para grupos de substituição
CREATE POLICY "Nutricionistas podem ver seus grupos" ON public.grupos_substituicao
  FOR SELECT USING (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem criar grupos" ON public.grupos_substituicao
  FOR INSERT WITH CHECK (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem atualizar seus grupos" ON public.grupos_substituicao
  FOR UPDATE USING (nutricionista_id = auth.uid());

CREATE POLICY "Nutricionistas podem deletar seus grupos" ON public.grupos_substituicao
  FOR DELETE USING (nutricionista_id = auth.uid());

-- Políticas RLS para itens de substituição
CREATE POLICY "Nutricionistas podem ver itens dos seus grupos" ON public.itens_substituicao
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.grupos_substituicao 
    WHERE id = grupo_id AND nutricionista_id = auth.uid()
  ));

CREATE POLICY "Nutricionistas podem criar itens nos seus grupos" ON public.itens_substituicao
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.grupos_substituicao 
    WHERE id = grupo_id AND nutricionista_id = auth.uid()
  ));

CREATE POLICY "Nutricionistas podem atualizar itens dos seus grupos" ON public.itens_substituicao
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.grupos_substituicao 
    WHERE id = grupo_id AND nutricionista_id = auth.uid()
  ));

CREATE POLICY "Nutricionistas podem deletar itens dos seus grupos" ON public.itens_substituicao
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.grupos_substituicao 
    WHERE id = grupo_id AND nutricionista_id = auth.uid()
  ));

-- Políticas RLS para itens do plano alimentar
CREATE POLICY "Nutricionistas podem ver itens dos seus planos" ON public.itens_plano_alimentar
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.planos_alimentares 
    WHERE id = plano_id AND nutricionista_id = auth.uid()
  ));

CREATE POLICY "Nutricionistas podem criar itens nos seus planos" ON public.itens_plano_alimentar
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.planos_alimentares 
    WHERE id = plano_id AND nutricionista_id = auth.uid()
  ));

CREATE POLICY "Nutricionistas podem atualizar itens dos seus planos" ON public.itens_plano_alimentar
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.planos_alimentares 
    WHERE id = plano_id AND nutricionista_id = auth.uid()
  ));

CREATE POLICY "Nutricionistas podem deletar itens dos seus planos" ON public.itens_plano_alimentar
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.planos_alimentares 
    WHERE id = plano_id AND nutricionista_id = auth.uid()
  ));

-- Inserir alguns alimentos básicos da tabela TACO como exemplo (alimentos públicos)
INSERT INTO public.alimentos (nutricionista_id, nome, categoria, quantidade_padrao, unidade_medida, calorias_por_100g, proteinas_por_100g, carboidratos_por_100g, gorduras_por_100g, is_publico) VALUES
  (NULL, 'Arroz integral cozido', 'Cereais', 100, 'g', 124, 2.6, 25.8, 1.0, true),
  (NULL, 'Peito de frango grelhado', 'Proteínas', 100, 'g', 195, 32.8, 0, 6.2, true),
  (NULL, 'Batata doce cozida', 'Tubérculos', 100, 'g', 77, 1.3, 18.4, 0.1, true),
  (NULL, 'Ovo de galinha inteiro', 'Proteínas', 1, 'unidade', 155, 13.0, 1.6, 10.6, true),
  (NULL, 'Aveia em flocos', 'Cereais', 100, 'g', 394, 13.9, 67.0, 8.5, true),
  (NULL, 'Banana nanica', 'Frutas', 1, 'unidade', 87, 1.3, 22.8, 0.1, true),
  (NULL, 'Leite desnatado', 'Laticínios', 200, 'ml', 35, 3.4, 4.9, 0.2, true),
  (NULL, 'Azeite de oliva', 'Óleos e gorduras', 10, 'ml', 884, 0, 0, 100, true),
  (NULL, 'Brócolis cozido', 'Vegetais', 100, 'g', 25, 3.4, 4.0, 0.4, true),
  (NULL, 'Maçã com casca', 'Frutas', 1, 'unidade', 56, 0.3, 14.8, 0.4, true),
  (NULL, 'Feijão carioca cozido', 'Leguminosas', 100, 'g', 76, 4.8, 13.6, 0.5, true),
  (NULL, 'Salmão grelhado', 'Proteínas', 100, 'g', 184, 25.4, 0, 8.1, true),
  (NULL, 'Quinoa cozida', 'Cereais', 100, 'g', 120, 4.4, 21.3, 1.9, true),
  (NULL, 'Iogurte natural', 'Laticínios', 100, 'g', 51, 4.3, 3.8, 1.5, true),
  (NULL, 'Amendoim torrado', 'Oleaginosas', 30, 'g', 544, 27.2, 20.3, 43.9, true);
