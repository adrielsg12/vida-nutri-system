
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { User, Building, Clock, Palette, Bell, LogOut, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const Configuracoes = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    nome_completo: '',
    crn: '',
    telefone: '',
    clinica: '',
    cidade: '',
    estado: '',
    logotipo_url: ''
  });
  const [notifications, setNotifications] = useState({
    email_reminders: true,
    whatsapp_reminders: false,
    appointment_confirmations: true
  });
  const [workingHours, setWorkingHours] = useState({
    monday: { start: '08:00', end: '18:00', enabled: true },
    tuesday: { start: '08:00', end: '18:00', enabled: true },
    wednesday: { start: '08:00', end: '18:00', enabled: true },
    thursday: { start: '08:00', end: '18:00', enabled: true },
    friday: { start: '08:00', end: '18:00', enabled: true },
    saturday: { start: '08:00', end: '12:00', enabled: false },
    sunday: { start: '08:00', end: '12:00', enabled: false }
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao sair da conta.",
        variant: "destructive",
      });
    }
  };

  const weekDays = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
      </div>

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={profile.nome_completo}
                onChange={(e) => setProfile({...profile, nome_completo: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crn">CRN</Label>
              <Input
                id="crn"
                value={profile.crn || ''}
                onChange={(e) => setProfile({...profile, crn: e.target.value})}
                placeholder="Ex: CRN-3 12345"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone/WhatsApp</Label>
              <Input
                id="telefone"
                value={profile.telefone || ''}
                onChange={(e) => setProfile({...profile, telefone: e.target.value})}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Clínica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações da Clínica
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clinica">Nome da Clínica</Label>
              <Input
                id="clinica"
                value={profile.clinica || ''}
                onChange={(e) => setProfile({...profile, clinica: e.target.value})}
                placeholder="Nome da sua clínica"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logotipo">URL do Logotipo</Label>
              <Input
                id="logotipo"
                value={profile.logotipo_url || ''}
                onChange={(e) => setProfile({...profile, logotipo_url: e.target.value})}
                placeholder="https://exemplo.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={profile.cidade || ''}
                onChange={(e) => setProfile({...profile, cidade: e.target.value})}
                placeholder="Sua cidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={profile.estado || ''}
                onChange={(e) => setProfile({...profile, estado: e.target.value})}
                placeholder="SP"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horários de Funcionamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários de Funcionamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(weekDays).map(([key, day]) => (
            <div key={key} className="flex items-center gap-4">
              <div className="w-32">
                <Switch
                  checked={workingHours[key as keyof typeof workingHours].enabled}
                  onCheckedChange={(checked) => 
                    setWorkingHours({
                      ...workingHours,
                      [key]: { ...workingHours[key as keyof typeof workingHours], enabled: checked }
                    })
                  }
                />
                <Label className="ml-2">{day}</Label>
              </div>
              {workingHours[key as keyof typeof workingHours].enabled && (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={workingHours[key as keyof typeof workingHours].start}
                    onChange={(e) => 
                      setWorkingHours({
                        ...workingHours,
                        [key]: { ...workingHours[key as keyof typeof workingHours], start: e.target.value }
                      })
                    }
                    className="w-32"
                  />
                  <span>às</span>
                  <Input
                    type="time"
                    value={workingHours[key as keyof typeof workingHours].end}
                    onChange={(e) => 
                      setWorkingHours({
                        ...workingHours,
                        [key]: { ...workingHours[key as keyof typeof workingHours], end: e.target.value }
                      })
                    }
                    className="w-32"
                  />
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Lembretes por E-mail</Label>
              <p className="text-sm text-gray-600">Receber lembretes de consultas por e-mail</p>
            </div>
            <Switch
              checked={notifications.email_reminders}
              onCheckedChange={(checked) => 
                setNotifications({...notifications, email_reminders: checked})
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Confirmações de Agendamento</Label>
              <p className="text-sm text-gray-600">Enviar confirmações automáticas de consultas</p>
            </div>
            <Switch
              checked={notifications.appointment_confirmations}
              onCheckedChange={(checked) => 
                setNotifications({...notifications, appointment_confirmations: checked})
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={saveProfile} 
          disabled={loading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex-1">
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar logout</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                Sair
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
