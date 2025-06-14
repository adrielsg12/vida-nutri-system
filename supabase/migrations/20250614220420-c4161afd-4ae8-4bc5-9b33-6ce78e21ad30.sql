
-- Adicionar todos os campos TACO à tabela 'alimentos'
-- [A lista a seguir foi baseada nos campos conhecidos da TACO 4a edição, modifique conforme necessidade.]
ALTER TABLE public.alimentos
  ADD COLUMN IF NOT EXISTS umidade numeric,
  ADD COLUMN IF NOT EXISTS energia_kcal numeric,
  ADD COLUMN IF NOT EXISTS energia_kj numeric,
  ADD COLUMN IF NOT EXISTS proteina numeric,
  ADD COLUMN IF NOT EXISTS lipideos numeric,
  ADD COLUMN IF NOT EXISTS colesterol numeric,
  ADD COLUMN IF NOT EXISTS carboidrato numeric,
  ADD COLUMN IF NOT EXISTS fibra_alimentar numeric,
  ADD COLUMN IF NOT EXISTS cinzas numeric,
  ADD COLUMN IF NOT EXISTS calcio numeric,
  ADD COLUMN IF NOT EXISTS magnesio numeric,
  ADD COLUMN IF NOT EXISTS manganes numeric,
  ADD COLUMN IF NOT EXISTS fosforo numeric,
  ADD COLUMN IF NOT EXISTS ferro numeric,
  ADD COLUMN IF NOT EXISTS sodio numeric,
  ADD COLUMN IF NOT EXISTS potassio numeric,
  ADD COLUMN IF NOT EXISTS cobre numeric,
  ADD COLUMN IF NOT EXISTS zinco numeric,
  ADD COLUMN IF NOT EXISTS retinol numeric,
  ADD COLUMN IF NOT EXISTS re numeric,
  ADD COLUMN IF NOT EXISTS rae numeric,
  ADD COLUMN IF NOT EXISTS tiamina numeric,
  ADD COLUMN IF NOT EXISTS riboflavina numeric,
  ADD COLUMN IF NOT EXISTS piridoxina numeric,
  ADD COLUMN IF NOT EXISTS niacina numeric,
  ADD COLUMN IF NOT EXISTS vitamina_c numeric,
  ADD COLUMN IF NOT EXISTS categoria_taco text,
  ADD COLUMN IF NOT EXISTS codigo_taco text;

-- Opcional: Adaptar tipos/códigos para número/categorização oficial da TACO, se necessário.
