
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { PacientesHeader } from '@/components/Pacientes/PacientesHeader';
import { PacientesStats } from '@/components/Pacientes/PacientesStats';
import { PacientesTable } from '@/components/Pacientes/PacientesTable';
import { PacientesDialogs } from '@/components/Pacientes/PacientesDialogs';

interface Patient {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  status: string;
  created_at: string;
  planosCount?: number;
}

interface PlanoAlimentar {
  id: string;
  titulo: string;
  status: string;
  created_at: string;
}

export const Pacientes = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showFichaDialog, setShowFichaDialog] = useState(false);
  const [showNovoPlano, setShowNovoPlano] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);
  const [showVisualizarPlano, setShowVisualizarPlano] = useState(false);
  const [pacientePlanos, setPacientePlanos] = useState<{[key: string]: PlanoAlimentar[]}>({});
  
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchPatients = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar pacientes
      const { data: patientsData, error: patientsError } = await supabase
        .from('pacientes')
        .select('*')
        .eq('nutricionista_id', user.id)
        .order('created_at', { ascending: false });

      if (patientsError) throw patientsError;

      // Buscar planos para cada paciente
      const { data: planosData, error: planosError } = await supabase
        .from('planos_alimentares')
        .select('id, titulo, status, created_at, paciente_id')
        .eq('nutricionista_id', user.id);

      if (planosError) throw planosError;

      // Organizar planos por paciente
      const planosPorPaciente: {[key: string]: PlanoAlimentar[]} = {};
      planosData?.forEach(plano => {
        if (!planosPorPaciente[plano.paciente_id]) {
          planosPorPaciente[plano.paciente_id] = [];
        }
        planosPorPaciente[plano.paciente_id].push(plano);
      });

      // Adicionar contagem de planos aos pacientes
      const patientsWithPlanos = patientsData?.map(patient => ({
        ...patient,
        planosCount: planosPorPaciente[patient.id]?.length || 0
      })) || [];

      console.log('Pacientes carregados:', patientsWithPlanos);
      console.log('Planos por paciente:', planosPorPaciente);

      setPatients(patientsWithPlanos);
      setPacientePlanos(planosPorPaciente);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de pacientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowFichaDialog(true);
  };

  const handleCreatePlano = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowNovoPlano(true);
  };

  const handleViewPlano = (planoId: string) => {
    setPlanoSelecionado(planoId);
    setShowVisualizarPlano(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PacientesHeader onNewPatient={() => setShowNewPatientForm(true)} />
      
      <PacientesStats patients={patients} pacientePlanos={pacientePlanos} />

      <PacientesTable
        patients={patients}
        pacientePlanos={pacientePlanos}
        onViewPatient={handleViewPatient}
        onCreatePlano={handleCreatePlano}
        onViewPlano={handleViewPlano}
      />

      <PacientesDialogs
        showNewPatientForm={showNewPatientForm}
        setShowNewPatientForm={setShowNewPatientForm}
        selectedPatientId={selectedPatientId}
        setSelectedPatientId={setSelectedPatientId}
        showFichaDialog={showFichaDialog}
        setShowFichaDialog={setShowFichaDialog}
        showNovoPlano={showNovoPlano}
        setShowNovoPlano={setShowNovoPlano}
        planoSelecionado={planoSelecionado}
        setPlanoSelecionado={setPlanoSelecionado}
        showVisualizarPlano={showVisualizarPlano}
        setShowVisualizarPlano={setShowVisualizarPlano}
        patients={patients}
        onSuccess={fetchPatients}
      />
    </div>
  );
};
