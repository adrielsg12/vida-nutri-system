
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SignUpFormProps {
  setLoading: (val: boolean) => void;
  loading: boolean;
  setTab: (t: "signin" | "signup") => void;
}

export const SignUpForm = ({ setLoading, loading, setTab }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const { toast } = useToast();

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
          emailRedirectTo: window.location.origin + "/",
          data: {
            tipo_usuario: tipoUsuario,
          },
        },
      });
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Garante que tipo_usuario é salvo no profile
      if (data?.user?.id && tipoUsuario) {
        await supabase
          .from("profiles")
          .update({ tipo_usuario: tipoUsuario })
          .eq("id", data.user.id);
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Confira seu e-mail e aguarde aprovação de acesso.",
      });

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTipoUsuario("");
      setTab("signin");
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
    <form onSubmit={handleSignUp} className="space-y-4 pt-2">
      <div>
        <Label htmlFor="email-signup" className="text-emerald-900">
          Email
        </Label>
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
        <Label htmlFor="password-signup" className="text-emerald-900">
          Senha
        </Label>
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
        <Label htmlFor="confirm-password" className="text-emerald-900">
          Confirmar Senha
        </Label>
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
          "Criar Conta"
        )}
      </Button>
    </form>
  );
};
