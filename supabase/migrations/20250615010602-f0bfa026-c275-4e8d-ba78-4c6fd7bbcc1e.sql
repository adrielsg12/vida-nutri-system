
ALTER TABLE public.profiles
ADD COLUMN tipo_usuario text DEFAULT NULL;

-- Os tipos aceitos: 'profissional' ou 'paciente'. Nenhuma regra RLS precisa ser alterada, pois o controle já é feito via painel/admin.
