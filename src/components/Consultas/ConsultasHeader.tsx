
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ConsultasHeaderProps {
  onNovaConsulta: () => void;
  totalConsultas: number;
}

export const ConsultasHeader = ({ onNovaConsulta, totalConsultas }: ConsultasHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Consultas</h1>
        <p className="text-gray-600 mt-2">Gerencie suas consultas agendadas</p>
      </div>
      <Button onClick={onNovaConsulta} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Agendar Nova Consulta
      </Button>
    </div>
  );
};
