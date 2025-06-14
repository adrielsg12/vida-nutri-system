
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AnthropometricSectionProps {
  formData: {
    peso: string;
    altura: string;
    percentual_gordura: string;
    massa_muscular: string;
  };
  onFormDataChange: (updates: Partial<AnthropometricSectionProps['formData']>) => void;
}

export const AnthropometricSection = ({ formData, onFormDataChange }: AnthropometricSectionProps) => {
  return (
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
            onChange={(e) => onFormDataChange({ peso: e.target.value })}
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
            onChange={(e) => onFormDataChange({ altura: e.target.value })}
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
            onChange={(e) => onFormDataChange({ percentual_gordura: e.target.value })}
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
            onChange={(e) => onFormDataChange({ massa_muscular: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
