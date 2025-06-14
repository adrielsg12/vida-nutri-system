
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CircumferenceSectionProps {
  formData: {
    circunferencia_cintura: string;
    circunferencia_quadril: string;
    circunferencia_peito: string;
    circunferencia_panturrilha: string;
    circunferencia_coxa: string;
    circunferencia_biceps: string;
  };
  onFormDataChange: (updates: Partial<CircumferenceSectionProps['formData']>) => void;
}

export const CircumferenceSection = ({ formData, onFormDataChange }: CircumferenceSectionProps) => {
  return (
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
            onChange={(e) => onFormDataChange({ circunferencia_cintura: e.target.value })}
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
            onChange={(e) => onFormDataChange({ circunferencia_quadril: e.target.value })}
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
            onChange={(e) => onFormDataChange({ circunferencia_peito: e.target.value })}
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
            onChange={(e) => onFormDataChange({ circunferencia_panturrilha: e.target.value })}
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
            onChange={(e) => onFormDataChange({ circunferencia_coxa: e.target.value })}
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
            onChange={(e) => onFormDataChange({ circunferencia_biceps: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
