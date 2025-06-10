
-- Primeiro, vamos verificar e corrigir o trigger de criação de perfil
-- O trigger atual não está funcionando corretamente

-- Recriar a função handle_new_user para garantir que funcione
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Inserir perfil com status pendente
  INSERT INTO public.profiles (id, nome_completo, status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email), 
    'pendente'
  );
  
  -- Criar registro de aprovação
  INSERT INTO public.aprovacoes_acesso (user_id, status)
  VALUES (NEW.id, 'pendente');
  
  RETURN NEW;
END;
$function$;

-- Verificar se o trigger existe e recriá-lo se necessário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Adicionar coluna email na tabela profiles para facilitar a consulta
-- (já que não podemos acessar diretamente auth.users)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Função para atualizar informações do usuário (admin)
CREATE OR REPLACE FUNCTION public.atualizar_usuario_admin(
  usuario_id uuid,
  admin_id uuid,
  novo_nome text DEFAULT NULL,
  novo_email text DEFAULT NULL,
  novo_crn text DEFAULT NULL,
  novo_telefone text DEFAULT NULL,
  novo_endereco text DEFAULT NULL,
  nova_cidade text DEFAULT NULL,
  novo_estado text DEFAULT NULL,
  nova_clinica text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Verificar se quem está atualizando é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = admin_id AND status = 'admin'
  ) THEN
    RAISE EXCEPTION 'Apenas administradores podem atualizar usuários';
  END IF;

  -- Atualizar perfil do usuário
  UPDATE public.profiles 
  SET 
    nome_completo = COALESCE(novo_nome, nome_completo),
    email = COALESCE(novo_email, email),
    crn = COALESCE(novo_crn, crn),
    telefone = COALESCE(novo_telefone, telefone),
    endereco = COALESCE(novo_endereco, endereco),
    cidade = COALESCE(nova_cidade, cidade),
    estado = COALESCE(novo_estado, estado),
    clinica = COALESCE(nova_clinica, clinica),
    updated_at = now()
  WHERE id = usuario_id;

  -- Se foi fornecido um novo email, tentar atualizar no auth também
  -- (isso pode falhar se não tivermos permissão, mas tentamos)
  IF novo_email IS NOT NULL THEN
    BEGIN
      -- Esta operação pode falhar, mas não queremos que impeça a atualização do perfil
      UPDATE auth.users 
      SET email = novo_email, updated_at = now()
      WHERE id = usuario_id;
    EXCEPTION
      WHEN OTHERS THEN
        -- Log do erro mas não falha a operação
        RAISE NOTICE 'Não foi possível atualizar email no auth.users: %', SQLERRM;
    END;
  END IF;

  RETURN TRUE;
END;
$function$;
