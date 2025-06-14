
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RegistroConsultaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  consulta: {
    id: string;
    paciente_id: string;
    pacientes: {
      nome: string;
    };
  };
}

export const RegistroConsultaDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  consulta 
}: RegistroConsultaDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    peso: '',
    altura: '',
    pressao_arterial_sistolica: '',
    pressao_arterial_diastolica: '',
    frequencia_cardiaca: '',
    circunferencia_cintura: '',
    circunferencia_quadril: '',
    circunferencia_peito: '',
    circunferencia_panturrilha: '',
    circunferencia_coxa: '',
    circunferencia_biceps: '',
    percentual_gordura: '',
    massa_muscular: '',
    observacoes_clinicas: '',
    queixas_principais: '',
    evolucao: '',
    conduta_nutricional: '',
    retorno_recomendado: ''
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para registrar consultas.",
          variant: "destructive",
        });
        return;
      }

      // Criar registro da consulta
      const { error: registroError } = await supabase
        .from('registros_consulta')
        .insert({
          consulta_id: consulta.id,
          paciente_id: consulta.paciente_id,
          nutricionista_id: user.id,
          peso: formData.peso ? parseFloat(formData.peso) : null,
          altura: formData.altura ? parseFloat(formData.altura) : null,
          pressao_arterial_sistolica: formData.pressao_arterial_sistolica ? parseInt(formData.pressao_arterial_sistolica) : null,
          pressao_arterial_diastolica: formData.pressao_arterial_diastolica ? parseInt(formData.pressao_arterial_diastolica) : null,
          frequencia_cardiaca: formData.frequencia_cardiaca ? parseInt(formData.frequencia_cardiaca) : null,
          circunferencia_cintura: formData.circunferencia_cintura ? parseFloat(formData.circunferencia_cintura) : null,
          circunferencia_quadril: formData.circunferencia_quadril ? parseFloat(formData.circunferencia_quadril) : null,
          circunferencia_peito: formData.circunferencia_peito ? parseFloat(formData.circunferencia_peito) : null,
          circunferencia_panturrilha: formData.circunferencia_panturrilha ? parseFloat(formData.circunferencia_panturrilha) : null,
          circunferencia_coxa: formData.circunferencia_coxa ? parseFloat(formData.circunferencia_coxa) : null,
          circunferencia_biceps: formData.circunferencia_biceps ? parseFloat(formData.circunferencia_biceps) : null,
          percentual_gordura: formData.percentual_gordura ? parseFloat(formData.percentual_gordura) : null,
          massa_muscular: formData.massa_muscular ? parseFloat(formData.massa_muscular) : null,
          observacoes_clinicas: formData.observacoes_clinicas || null,
          queixas_principais: formData.queixas_principais || null,
          evolucao: formData.evolucao || null,
          conduta_nutricional: formData.conduta_nutricional || null,
          retorno_recomendado: formData.retorno_recomendado || null
        });

      if (registroError) {
        console.error('Erro ao criar registro:', registroError);
        toast({
          title: "Erro ao salvar registro",
          description: registroError.message,
          variant: "destructive",
        });
        return;
      }

      // Atualizar status da consulta para finalizada
      const { error: consultaError } = await supabase
        .from('consultas')
        .update({ status: 'finalizada' })
        .eq('id', consulta.id);

      if (consultaError) {
        console.error('Erro ao finalizar consulta:', consultaError);
        toast({
          title: "Erro ao finalizar consulta",
          description: consultaError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Consulta registrada",
        description: "O registro da consulta foi salvo com sucesso no histórico do paciente.",
      });

      setFormData({
        peso: '',
        altura: '',
        pressao_arterial_sistolica: '',
        pressao_arterial_diastolica: '',
        frequencia_cardiaca: '',
        circunferencia_cintura: '',
        circunferencia_quadril: '',
        circunferencia_peito: '',
        circunferencia_panturrilha: '',
        circunferencia_coxa: '',
        circunferencia_biceps: '',
        percentual_gordura: '',
        massa_muscular: '',
        observacoes_clinicas: '',
        queixas_principais: '',
        evolucao: '',
        conduta_nutricional: '',
        retorno_recomendado: ''
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao registrar a consulta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Consulta</DialogTitle>
          <DialogDescription>
            Paciente: {consulta.pacientes?.nome}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Antropométricos */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Dados Antropométricos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  value={formData.peso}
                  onChange={(e) => setFormData({...formData, peso: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 170.5"
                  value={formData.altura}
                  onChange={(e) => setFormData({...formData, altura: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="percentual_gordura">Percentual de Gordura (%)</Label>
                <Input
                  id="percentual_gordura"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 15.5"
                  value={formData.percentual_gordura}
                  onChange={(e) => setFormData({...formData, percentual_gordura: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="massa_muscular">Massa Muscular (kg)</Label>
                <Input
                  id="massa_muscular"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 45.0"
                  value={formData.massa_muscular}
                  onChange={(e) => setFormData({...formData, massa_muscular: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Circunferências */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Circunferências (cm)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="circunferencia_cintura">Cintura</Label>
                <Input
                  id="circunferencia_cintura"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 85.0"
                  value={formData.circunferencia_cintura}
                  onChange={(e) => setFormData({...formData, circunferencia_cintura: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circunferencia_quadril">Quadril</Label>
                <Input
                  id="circunferencia_quadril"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 95.0"
                  value={formData.circunferencia_quadril}
                  onChange={(e) => setFormData({...formData, circunferencia_quadril: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="circunferencia_peito">Peito</Label>
                <Input
                  id="circunferencia_peito"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 100.0"
                  value={formData.circunferencia_peito}
                  onChange={(e) => setFormData({...formData, circunferencia_peito: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circunferencia_panturrilha">Panturrilha</Label>
                <Input
                  id="circunferencia_panturrilha"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 35.0"
                  value={formData.circunferencia_panturrilha}
                  onChange={(e) => setFormData({...formData, circunferencia_panturrilha: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="circunferencia_coxa">Coxa</Label>
                <Input
                  id="circunferencia_coxa"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 55.0"
                  value={formData.circunferencia_coxa}
                  onChange={(e) => setFormData({...formData, circunferencia_coxa: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="circunferencia_biceps">Bíceps</Label>
                <Input
                  id="circunferencia_biceps"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 30.0"
                  value={formData.circunferencia_biceps}
                  onChange={(e) => setFormData({...formData, circunferencia_biceps: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Sinais Vitais */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Sinais Vitais</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pressao_arterial_sistolica">PA Sistólica (mmHg)</Label>
                <Input
                  id="pressao_arterial_sistolica"
                  type="number"
                  placeholder="Ex: 120"
                  value={formData.pressao_arterial_sistolica}
                  onChange={(e) => setFormData({...formData, pressao_arterial_sistolica: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pressao_arterial_diastolica">PA Diastólica (mmHg)</Label>
                <Input
                  id="pressao_arterial_diastolica"
                  type="number"
                  placeholder="Ex: 80"
                  value={formData.pressao_arterial_diastolica}
                  onChange={(e) => setFormData({...formData, pressao_arterial_diastolica: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequencia_cardiaca">Freq. Cardíaca (bpm)</Label>
                <Input
                  id="frequencia_cardiaca"
                  type="number"
                  placeholder="Ex: 72"
                  value={formData.frequencia_cardiaca}
                  onChange={(e) => setFormData({...formData, frequencia_cardiaca: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Informações Clínicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Informações Clínicas</h3>
            <div className="space-y-2">
              <Label htmlFor="queixas_principais">Queixas Principais</Label>
              <Textarea
                id="queixas_principais"
                placeholder="Descreva as principais queixas do paciente..."
                value={formData.queixas_principais}
                onChange={(e) => setFormData({...formData, queixas_principais: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evolucao">Evolução</Label>
              <Textarea
                id="evolucao"
                placeholder="Descreva a evolução do paciente desde a última consulta..."
                value={formData.evolucao}
                onChange={(e) => setFormData({...formData, evolucao: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conduta_nutricional">Conduta Nutricional</Label>
              <Textarea
                id="conduta_nutricional"
                placeholder="Descreva as orientações nutricionais..."
                value={formData.conduta_nutricional}
                onChange={(e) => setFormData({...formData, conduta_nutricional: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes_clinicas">Observações Clínicas</Label>
              <Textarea
                id="observacoes_clinicas"
                placeholder="Observações adicionais..."
                value={formData.observacoes_clinicas}
                onChange={(e) => setFormData({...formData, observacoes_clinicas: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retorno_recomendado">Data de Retorno Recomendada</Label>
              <Input
                id="retorno_recomendado"
                type="date"
                value={formData.retorno_recomendado}
                onChange={(e) => setFormData({...formData, retorno_recomendado: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
