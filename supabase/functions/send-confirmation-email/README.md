
# Configuração do E-mail de Confirmação NutriSync

Este edge function envia e-mails de confirmação personalizados quando um usuário se cadastra no sistema.

## Configuração Necessária

### 1. Resend API Key
1. Acesse https://resend.com e crie uma conta
2. Valide seu domínio em https://resend.com/domains
3. Crie uma API key em https://resend.com/api-keys
4. Adicione a variável de ambiente no Supabase:
   ```
   RESEND_API_KEY=seu_api_key_aqui
   ```

### 2. Webhook Secret
1. Gere um secret forte (ex: usando `openssl rand -hex 32`)
2. Adicione a variável de ambiente:
   ```
   SEND_EMAIL_HOOK_SECRET=seu_secret_aqui
   ```

### 3. Configurar Webhook no Supabase
1. Vá para Authentication > Settings > Auth Hooks
2. Adicione um novo hook:
   - **Hook Name**: send-confirmation-email
   - **Type**: Send Email Hook
   - **URL**: https://seu-projeto.supabase.co/functions/v1/send-confirmation-email
   - **Secret**: o mesmo valor de SEND_EMAIL_HOOK_SECRET
   - **Events**: signup

### 4. Deploy do Edge Function
Execute no terminal:
```bash
supabase functions deploy send-confirmation-email
```

## Como Funciona

1. Quando um usuário se cadastra, o Supabase dispara o webhook
2. O edge function recebe os dados do usuário
3. Um e-mail personalizado é renderizado usando React Email
4. O e-mail é enviado via Resend com o layout profissional do NutriSync

## Personalização

O template de e-mail está em `_templates/account-confirmation.tsx` e pode ser customizado conforme necessário.
