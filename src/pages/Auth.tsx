
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthFormWrapper } from "@/components/Auth/AuthFormWrapper";
import { SignInForm } from "@/components/Auth/SignInForm";
import { SignUpForm } from "@/components/Auth/SignUpForm";
import { supabase } from "@/integrations/supabase/client";

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verifica se já está logado
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <AuthFormWrapper>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "signin" | "signup")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Criar Conta</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm loading={loading} setLoading={setLoading} />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm
            loading={loading}
            setLoading={setLoading}
            setTab={setTab}
          />
        </TabsContent>
      </Tabs>
    </AuthFormWrapper>
  );
};

export default Auth;
