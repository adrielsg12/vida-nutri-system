
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface VitalSignsSectionProps {
  formData: {
    pressao_arterial_sistolica: string;
    pressao_arterial_diastolica: string;
    frequencia_cardiaca: string;
  };
  onFormDataChange: (updates: Partial<VitalSignsSectionProps['formData']>) => void;
}

export const VitalSignsSection = ({ formData, onFormDataChange }: VitalSignsSectionProps) => {
  return (
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
            onChange={(e) => onFormDataChange({ pressao_arterial_sistolica: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pressao_arterial_diastolica">PA Diastólica (mmHg)</Label>
          <Input
            id="pressao_arterial_diastolica"
            type="number"
            placeholder="Ex: 80"
            value={formData.pressao_arterial_diastolica}
            onChange={(e) => onFormDataChange({ pressao_arterial_diastolica: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequencia_cardiaca">Freq. Cardíaca (bpm)</Label>
          <Input
            id="frequencia_cardiaca"
            type="number"
            placeholder="Ex: 72"
            value={formData.frequencia_cardiaca}
            onChange={(e) => onFormDataChange({ frequencia_cardiaca: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
