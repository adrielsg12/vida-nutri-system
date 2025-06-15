
-- Liberar SELECT para todos os usuários autenticados na tabela alimentos
CREATE POLICY "Usuarios autenticados podem ler alimentos"
  ON public.alimentos
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
