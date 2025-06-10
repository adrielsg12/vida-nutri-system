
-- Remover a necessidade de confirmação de e-mail
-- Isso será feito via configuração do Supabase, mas vamos garantir que
-- não há dependências no banco que exijam e-mail confirmado

-- Verificar se existe alguma política que depende de email_confirmed_at
-- (não deveria haver nenhuma, mas vamos garantir)

-- Como o controle é feito pelo status na tabela profiles,
-- não precisamos de alterações estruturais no banco
-- Apenas confirmar que tudo funcionará sem confirmação de e-mail

-- Comentário: As alterações principais serão na configuração do Auth
-- e no código frontend, não no esquema do banco
