
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserX, ChefHat } from 'lucide-react';

interface Patient {
  id: string;
  status: string;
  planosCount?: number;
}

interface PlanoAlimentar {
  id: string;
  titulo: string;
  status: string;
  created_at: string;
}

interface PacientesStatsProps {
  patients: Patient[];
  pacientePlanos: {[key: string]: PlanoAlimentar[]};
}

export const PacientesStats = ({ patients, pacientePlanos }: PacientesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <p className="text-2xl font-bold text-emerald-600">{patients.filter(p => p.status === 'ativo').length}</p>
            <p className="text-sm text-gray-600">Pacientes Ativos</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <UserX className="w-8 h-8 mx-auto text-red-600 mb-2" />
            <p className="text-2xl font-bold text-red-600">{patients.filter(p => p.status === 'inativo').length}</p>
            <p className="text-sm text-gray-600">Pacientes Inativos</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <ChefHat className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">
              {Object.values(pacientePlanos).reduce((total, planos) => total + planos.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Planos Alimentares</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
