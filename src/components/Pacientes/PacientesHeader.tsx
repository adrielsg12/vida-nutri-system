
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PacientesHeaderProps {
  onNewPatient: () => void;
}

export const PacientesHeader = ({ onNewPatient }: PacientesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <p className="text-gray-600">Gerencie os dados dos seus pacientes</p>
      </div>
      <Button
        onClick={onNewPatient}
        className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Novo Paciente
      </Button>
    </div>
  );
};
