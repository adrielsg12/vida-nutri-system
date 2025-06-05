import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageCircle, Send, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
}

const templates = [
  {
    id: 'consulta_confirmada',
    titulo: 'Consulta Confirmada',
    conteudo: 'Olá! Sua consulta está confirmada para [DATA] às [HORA]. Qualquer dúvida, estou à disposição!'
  },
  {
    id: 'plano_enviado',
    titulo: 'Plano Alimentar Enviado',
    conteudo: 'Seu plano alimentar foi enviado por e-mail. Qualquer dúvida sobre o cardápio, entre em contato!'
  },
  {
    id: 'lembrete_consulta',
    titulo: 'Lembrete de Consulta',
    conteudo: 'Lembrete: Você tem consulta marcada para amanhã às [HORA]. Até lá!'
  }
];

export const Comunicacao = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [templateSelecionado, setTemplateSelecionado] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPacientes();
  }, []);

  const fetchPacientes = async () => {
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, nome, telefone')
        .order('nome');

      if (error) throw error;
      setPacientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setTemplateSelecionado(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMensagem(template.conteudo);
    }
  };

  const handleEnviarWhatsApp = () => {
    const paciente = pacientes.find(p => p.id === pacienteSelecionado);
    if (!paciente || !mensagem) {
      toast({
        title: 'Erro',
        description: 'Selecione um paciente e digite uma mensagem.',
        variant: 'destructive',
      });
      return;
    }

    const telefone = paciente.telefone.replace(/\D/g, '');
    const mensagemEncoded = encodeURIComponent(mensagem);
    const whatsappUrl = `https://wa.me/55${telefone}?text=${mensagemEncoded}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: 'WhatsApp Aberto',
      description: 'WhatsApp Web foi aberto em uma nova aba.',
    });
  };

  const handleEnviarEmail = () => {
    if (!mensagem) {
      toast({
        title: 'Erro',
        description: 'Digite uma mensagem para enviar por e-mail.',
        variant: 'destructive',
      });
      return;
    }

    const assunto = 'Mensagem da sua nutricionista';
    const emailUrl = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(mensagem)}`;
    
    window.location.href = emailUrl;
    
    toast({
      title: 'E-mail Preparado',
      description: 'Cliente de e-mail foi aberto com a mensagem.',
    });
  };

  return (
    <div className="w-full px-4 lg:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comunicação</h1>
        <p className="text-gray-600">Envie mensagens para seus pacientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Enviar Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paciente">Selecionar Paciente</Label>
              <Select value={pacienteSelecionado} onValueChange={setPacienteSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="template">Template de Mensagem</Label>
              <Select value={templateSelecionado} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um template (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mensagem">Mensagem</Label>
              <Textarea
                id="mensagem"
                placeholder="Digite sua mensagem aqui..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleEnviarWhatsApp} 
                className="flex items-center gap-2 flex-1"
                disabled={!pacienteSelecionado || !mensagem}
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button 
                onClick={handleEnviarEmail} 
                variant="outline" 
                className="flex items-center gap-2 flex-1"
                disabled={!mensagem}
              >
                <Mail className="h-4 w-4" />
                E-mail
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Templates Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm mb-1">{template.titulo}</h4>
                  <p className="text-sm text-gray-600">{template.conteudo}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Dica:</strong> Use [DATA] e [HORA] nos templates para personalizar as mensagens.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
