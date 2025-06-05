import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, User, Clock, Bell, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Configuracoes = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState({
    nome: user?.user_metadata?.nome_completo || '',
    email: user?.email || '',
    crn: 'CRN-3 12345',
    telefone: '',
    endereco: ''
  });

  const [horarios, setHorarios] = useState({
    segunda: { inicio: '08:00', fim: '18:00', ativo: true },
    terca: { inicio: '08:00', fim: '18:00', ativo: true },
    quarta: { inicio: '08:00', fim: '18:00', ativo: true },
    quinta: { inicio: '08:00', fim: '18:00', ativo: true },
    sexta: { inicio: '08:00', fim: '18:00', ativo: true },
    sabado: { inicio: '08:00', fim: '12:00', ativo: false },
    domingo: { inicio: '08:00', fim: '12:00', ativo: false }
  });

  const [notificacoes, setNotificacoes] = useState({
    emailLembretes: true,
    whatsappLembretes: false,
    notificacoesPagamento: true
  });

  const handleSalvarPerfil = () => {
    toast({
      title: 'Sucesso',
      description: 'Perfil atualizado com sucesso!',
    });
  };

  const handleSalvarHorarios = () => {
    toast({
      title: 'Sucesso',
      description: 'Horários de atendimento atualizados!',
    });
  };

  const handleSalvarNotificacoes = () => {
    toast({
      title: 'Sucesso',
      description: 'Configurações de notificação atualizadas!',
    });
  };

  const handleSair = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer logout.',
        variant: 'destructive',
      });
    }
  };

  const diasSemana = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do seu sistema</p>
        </div>
        <Button 
          onClick={handleSair} 
          variant="destructive" 
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil Profissional */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil Profissional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={perfil.nome}
                onChange={(e) => setPerfil(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={perfil.email}
                onChange={(e) => setPerfil(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="crn">CRN</Label>
              <Input
                id="crn"
                value={perfil.crn}
                onChange={(e) => setPerfil(prev => ({ ...prev, crn: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="telefone">WhatsApp</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={perfil.telefone}
                onChange={(e) => setPerfil(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="endereco">Endereço da Clínica</Label>
              <Textarea
                id="endereco"
                placeholder="Endereço completo da clínica"
                value={perfil.endereco}
                onChange={(e) => setPerfil(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>
            
            <Button onClick={handleSalvarPerfil} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Horários de Atendimento */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários de Atendimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {diasSemana.map((dia) => (
              <div key={dia.key} className="flex items-center gap-4">
                <div className="w-24">
                  <Switch
                    checked={horarios[dia.key as keyof typeof horarios].ativo}
                    onCheckedChange={(checked) =>
                      setHorarios(prev => ({
                        ...prev,
                        [dia.key]: { ...prev[dia.key as keyof typeof horarios], ativo: checked }
                      }))
                    }
                  />
                  <Label className="text-sm font-medium">{dia.label}</Label>
                </div>
                
                {horarios[dia.key as keyof typeof horarios].ativo && (
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={horarios[dia.key as keyof typeof horarios].inicio}
                      onChange={(e) =>
                        setHorarios(prev => ({
                          ...prev,
                          [dia.key]: { ...prev[dia.key as keyof typeof horarios], inicio: e.target.value }
                        }))
                      }
                      className="w-24"
                    />
                    <span className="self-center">às</span>
                    <Input
                      type="time"
                      value={horarios[dia.key as keyof typeof horarios].fim}
                      onChange={(e) =>
                        setHorarios(prev => ({
                          ...prev,
                          [dia.key]: { ...prev[dia.key as keyof typeof horarios], fim: e.target.value }
                        }))
                      }
                      className="w-24"
                    />
                  </div>
                )}
              </div>
            ))}
            
            <Button onClick={handleSalvarHorarios} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Horários
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="shadow-sm">
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
                <p className="text-sm text-gray-500">Receber lembretes de consultas por e-mail</p>
              </div>
              <Switch
                checked={notificacoes.emailLembretes}
                onCheckedChange={(checked) =>
                  setNotificacoes(prev => ({ ...prev, emailLembretes: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Lembretes por WhatsApp</Label>
                <p className="text-sm text-gray-500">Receber lembretes de consultas por WhatsApp</p>
              </div>
              <Switch
                checked={notificacoes.whatsappLembretes}
                onCheckedChange={(checked) =>
                  setNotificacoes(prev => ({ ...prev, whatsappLembretes: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações de Pagamento</Label>
                <p className="text-sm text-gray-500">Receber notificações sobre pagamentos</p>
              </div>
              <Switch
                checked={notificacoes.notificacoesPagamento}
                onCheckedChange={(checked) =>
                  setNotificacoes(prev => ({ ...prev, notificacoesPagamento: checked }))
                }
              />
            </div>
            
            <Button onClick={handleSalvarNotificacoes} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Notificações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
