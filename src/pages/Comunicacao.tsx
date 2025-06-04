
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Mail, Send, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Comunicacao = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [patientName, setPatientName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const { toast } = useToast();

  const messageTemplates = [
    {
      id: 'appointment_confirmation',
      title: 'Confirmação de Consulta',
      message: 'Olá {nome}, aqui é sua nutricionista. Sua consulta está confirmada para {data_hora}. Caso precise remarcar, entre em contato.',
      type: 'whatsapp'
    },
    {
      id: 'meal_plan_sent',
      title: 'Plano Alimentar Enviado',
      message: 'Olá {nome}! Seu plano alimentar foi enviado por e-mail. Qualquer dúvida, estou à disposição! 🥗',
      type: 'whatsapp'
    },
    {
      id: 'appointment_reminder',
      title: 'Lembrete de Consulta',
      message: 'Olá {nome}! Lembrete: você tem consulta marcada para amanhã às {hora}. Te espero!',
      type: 'whatsapp'
    },
    {
      id: 'meal_plan_email',
      title: 'E-mail do Plano Alimentar',
      message: 'Olá {nome},\n\nSegue em anexo seu plano alimentar personalizado. Siga as orientações e qualquer dúvida, entre em contato.\n\nAtenciosamente,\nSua Nutricionista',
      type: 'email'
    }
  ];

  const sendWhatsAppMessage = (message: string) => {
    const processedMessage = message
      .replace('{nome}', patientName || '[Nome do Paciente]')
      .replace('{data_hora}', appointmentDate || '[Data/Hora]')
      .replace('{hora}', appointmentDate || '[Hora]');
    
    const encodedMessage = encodeURIComponent(processedMessage);
    const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: "A mensagem foi preparada no WhatsApp Web.",
    });
  };

  const sendEmail = () => {
    const processedMessage = selectedTemplate === 'meal_plan_email' 
      ? messageTemplates.find(t => t.id === 'meal_plan_email')?.message || ''
      : customMessage;
    
    const finalMessage = processedMessage
      .replace('{nome}', patientName || '[Nome do Paciente]')
      .replace('{data_hora}', appointmentDate || '[Data/Hora]');
    
    const subject = encodeURIComponent('Comunicação - NutriCRM');
    const body = encodeURIComponent(finalMessage);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    
    window.open(emailUrl);
    
    toast({
      title: "E-mail preparado",
      description: "O cliente de e-mail foi aberto com a mensagem.",
    });
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id);
    setCustomMessage(template.message);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comunicação</h1>
        <p className="text-gray-600">Envie mensagens e mantenha contato com seus pacientes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates de Mensagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Templates de Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {messageTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{template.title}</h4>
                  <Badge variant={template.type === 'whatsapp' ? 'default' : 'secondary'}>
                    {template.type === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {template.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Envio de Mensagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient-name">Nome do Paciente</Label>
              <Input
                id="patient-name"
                placeholder="Digite o nome do paciente"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-date">Data/Hora (se aplicável)</Label>
              <Input
                id="appointment-date"
                placeholder="Ex: 15/01/2024 às 14:00"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem personalizada..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => sendWhatsAppMessage(customMessage)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!customMessage.trim()}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                onClick={sendEmail}
                variant="outline"
                className="flex-1"
                disabled={!customMessage.trim()}
              >
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => {
                const message = "Olá! Gostaria de agendar uma consulta. Quais são os horários disponíveis?";
                sendWhatsAppMessage(message);
              }}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Lembrete de Consulta</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => {
                const message = "Seu plano alimentar foi atualizado! Confira as novas orientações que enviei por e-mail.";
                sendWhatsAppMessage(message);
              }}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Reenviar Plano</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => {
                const message = "Olá! Como está indo com o plano alimentar? Precisa de algum ajuste?";
                sendWhatsAppMessage(message);
              }}
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm">Check-in</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
