
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConsultaFormData {
  peso: string;
  altura: string;
  pressao_arterial_sistolica: string;
  pressao_arterial_diastolica: string;
  frequencia_cardiaca: string;
  circunferencia_cintura: string;
  circunferencia_quadril: string;
  circunferencia_peito: string;
  circunferencia_panturrilha: string;
  circunferencia_coxa: string;
  circunferencia_biceps: string;
  percentual_gordura: string;
  massa_muscular: string;
  observacoes_clinicas: string;
  queixas_principais: string;
  evolucao: string;
  conduta_nutricional: string;
  retorno_recomendado: string;
}

const initialFormData: ConsultaFormData = {
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
};

export const useRegistroConsulta = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ConsultaFormData>(initialFormData);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<ConsultaFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const submitConsulta = async (consulta: { id: string; paciente_id: string }) => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para registrar consultas.",
          variant: "destructive",
        });
        return false;
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
        return false;
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
        return false;
      }

      toast({
        title: "Consulta registrada",
        description: "O registro da consulta foi salvo com sucesso no histórico do paciente.",
      });

      resetForm();
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao registrar a consulta.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    updateFormData,
    submitConsulta,
    resetForm
  };
};
