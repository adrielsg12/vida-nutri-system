
-- Este script define o usuário brainstormmktdt@gmail.com como administrador
UPDATE public.profiles 
SET status = 'admin' 
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'brainstormmktdt@gmail.com' 
  LIMIT 1
);
