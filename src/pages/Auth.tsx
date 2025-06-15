
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    // Verifica se já está logado
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao fazer login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoUsuario) {
      toast({
        title: "Tipo de conta obrigatório",
        description: "Por favor, selecione se você é profissional ou paciente.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Erro de validação",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/',
          data: {
            tipo_usuario: tipoUsuario
          },
        }
      });
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Adiciona tipo_usuario ao profile
      // O trigger já cria o profile, mas vamos garantir que o campo fica preenchido corretamente
      if (data?.user?.id && tipoUsuario) {
        await supabase
          .from('profiles')
          .update({ tipo_usuario: tipoUsuario })
          .eq('id', data.user.id);
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Confira seu e-mail e aguarde aprovação de acesso.",
      });

      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTipoUsuario('');
      setTab('signin'); // Volta para login após cadastro
    } catch (error) {
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar a conta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-200 via-white to-emerald-100">
      <div className="w-full max-w-md space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-emerald-700 mb-2 tracking-tight drop-shadow-sm">
            NutriSync
          </h2>
          <p className="mt-4 text-gray-700">Entre para acelerar sua vida saudável</p>
        </div>
        <Card className="shadow-xl rounded-2xl border border-emerald-100 bg-white/50">
          <CardHeader>
            <CardTitle className="text-center text-emerald-800">Bem-vindo</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as 'signin' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-5 pt-3">
                  <div>
                    <Label htmlFor="email" className="text-emerald-900">Email</Label>
                    <Input
                      id="email"
                      autoComplete="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-emerald-900">Senha</Label>
                    <Input
                      id="password"
                      autoComplete="current-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="email-signup" className="text-emerald-900">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password-signup" className="text-emerald-900">Senha</Label>
                    <Input
                      id="password-signup"
                      autoComplete="new-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Pelo menos 6 caracteres"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password" className="text-emerald-900">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repetir senha"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-emerald-900">Tipo de Conta</Label>
                    <RadioGroup
                      className="flex gap-6 mt-2"
                      value={tipoUsuario}
                      onValueChange={setTipoUsuario}
                      required
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="profissional" id="tipo-prof" />
                        <Label htmlFor="tipo-prof">Profissional</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paciente" id="tipo-paci" />
                        <Label htmlFor="tipo-paci">Paciente</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                        <span>Criando conta...</span>
                      </div>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="mt-auto py-4 px-4 text-center">
        <p className="text-sm text-gray-600">
          Sistema desenvolvido pela{' '}
          <span className="font-semibold text-gray-900">Brainstorm Agência de Marketing</span>
          {' '}- Contato: (32) 9 9166-5327
        </p>
      </div>
    </div>
  );
};

export default Auth;
