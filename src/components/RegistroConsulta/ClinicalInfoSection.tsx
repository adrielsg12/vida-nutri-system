
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ClinicalInfoSectionProps {
  formData: {
    queixas_principais: string;
    evolucao: string;
    conduta_nutricional: string;
    observacoes_clinicas: string;
    retorno_recomendado: string;
  };
  onFormDataChange: (updates: Partial<ClinicalInfoSectionProps['formData']>) => void;
}

export const ClinicalInfoSection = ({ formData, onFormDataChange }: ClinicalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Informações Clínicas</h3>
      <div className="space-y-2">
        <Label htmlFor="queixas_principais">Queixas Principais</Label>
        <Textarea
          id="queixas_principais"
          placeholder="Descreva as principais queixas do paciente..."
          value={formData.queixas_principais}
          onChange={(e) => onFormDataChange({ queixas_principais: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="evolucao">Evolução</Label>
        <Textarea
          id="evolucao"
          placeholder="Descreva a evolução do paciente desde a última consulta..."
          value={formData.evolucao}
          onChange={(e) => onFormDataChange({ evolucao: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="conduta_nutricional">Conduta Nutricional</Label>
        <Textarea
          id="conduta_nutricional"
          placeholder="Descreva as orientações nutricionais..."
          value={formData.conduta_nutricional}
          onChange={(e) => onFormDataChange({ conduta_nutricional: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes_clinicas">Observações Clínicas</Label>
        <Textarea
          id="observacoes_clinicas"
          placeholder="Observações adicionais..."
          value={formData.observacoes_clinicas}
          onChange={(e) => onFormDataChange({ observacoes_clinicas: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="retorno_recomendado">Data de Retorno Recomendada</Label>
        <Input
          id="retorno_recomendado"
          type="date"
          value={formData.retorno_recomendado}
          onChange={(e) => onFormDataChange({ retorno_recomendado: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};
