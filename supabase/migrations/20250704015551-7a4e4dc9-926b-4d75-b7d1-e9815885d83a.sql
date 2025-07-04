
-- Permitir acesso à tabela alimentos apenas para admins ou usuários aprovados
DROP POLICY IF EXISTS "Usuarios autenticados podem ler alimentos" ON public.alimentos;

CREATE POLICY "Admins e aprovados podem ler alimentos"
  ON public.alimentos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND (status = 'admin' OR status = 'aprovado')
    )
  );
