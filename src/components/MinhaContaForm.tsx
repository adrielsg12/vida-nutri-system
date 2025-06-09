
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useUserStatus } from '@/hooks/useUserStatus';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Lock, Save } from 'lucide-react';

export const MinhaContaForm = () => {
  const { user } = useAuth();
  const { userProfile } = useUserStatus();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Dados do perfil
  const [profileData, setProfileData] = useState({
    nome_completo: '',
    crn: '',
    telefone: '',
    endereco: '',
    clinica: '',
    cidade: '',
    estado: ''
  });

  // Dados de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        nome_completo: userProfile.nome_completo || '',
        crn: userProfile.crn || '',
        telefone: userProfile.telefone || '',
        endereco: userProfile.endereco || '',
        clinica: userProfile.clinica || '',
        cidade: userProfile.cidade || '',
        estado: userProfile.estado || ''
      });
    }
  }, [userProfile]);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleProfileChange('telefone', formatted);
  };

  const validateProfile = () => {
    if (!profileData.nome_completo.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome completo é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (!profileData.crn.trim()) {
      toast({
        title: "Erro de validação", 
        description: "CRN é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "Todos os campos de senha são obrigatórios.",
        variant: "destructive",
      });
      return false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "Nova senha e confirmação não coincidem.",
        variant: "destructive",
      });
      return false;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro de validação",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nome_completo: profileData.nome_completo,
          crn: profileData.crn,
          telefone: profileData.telefone,
          endereco: profileData.endereco,
          clinica: profileData.clinica,
          cidade: profileData.cidade,
          estado: profileData.estado,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Informações atualizadas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar informações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast({
        title: "Sucesso",
        description: "Senha alterada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar senha.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                value={profileData.nome_completo}
                onChange={(e) => handleProfileChange('nome_completo', e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <Label htmlFor="crn">CRN *</Label>
              <Input
                id="crn"
                value={profileData.crn}
                onChange={(e) => handleProfileChange('crn', e.target.value)}
                placeholder="Ex: CRN-3 12345"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={profileData.telefone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="clinica">Clínica</Label>
              <Input
                id="clinica"
                value={profileData.clinica}
                onChange={(e) => handleProfileChange('clinica', e.target.value)}
                placeholder="Nome da clínica"
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={profileData.cidade}
                onChange={(e) => handleProfileChange('cidade', e.target.value)}
                placeholder="Sua cidade"
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={profileData.estado}
                onChange={(e) => handleProfileChange('estado', e.target.value)}
                placeholder="Ex: SP"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={profileData.endereco}
              onChange={(e) => handleProfileChange('endereco', e.target.value)}
              placeholder="Endereço completo (opcional)"
            />
          </div>

          <Button 
            onClick={handleSaveProfile} 
            disabled={loading}
            className="w-full md:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardContent>
      </Card>

      {/* Alteração de Senha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Alteração de Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Senha Atual *</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Digite sua senha atual"
            />
          </div>

          <div>
            <Label htmlFor="newPassword">Nova Senha *</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Digite a nova senha (mín. 6 caracteres)"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Confirme a nova senha"
            />
          </div>

          <Button 
            onClick={handleChangePassword} 
            disabled={passwordLoading}
            variant="outline"
            className="w-full md:w-auto"
          >
            <Lock className="w-4 h-4 mr-2" />
            {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
