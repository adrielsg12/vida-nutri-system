
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { NovoPatientForm } from '@/components/NovoPatientForm';
import { FichaPacienteDialog } from '@/components/FichaPacienteDialog';
import { NovoPlanoAlimentarDialog } from '@/components/NovoPlanoAlimentarDialog';
import { VisualizarPlanoDialog } from '@/components/VisualizarPlanoDialog';

interface Patient {
  id: string;
  nome: string;
  email?: string;
}

interface PacientesDialogsProps {
  showNewPatientForm: boolean;
  setShowNewPatientForm: (show: boolean) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  showFichaDialog: boolean;
  setShowFichaDialog: (show: boolean) => void;
  showNovoPlano: boolean;
  setShowNovoPlano: (show: boolean) => void;
  planoSelecionado: string | null;
  setPlanoSelecionado: (id: string | null) => void;
  showVisualizarPlano: boolean;
  setShowVisualizarPlano: (show: boolean) => void;
  patients: Patient[];
  onSuccess: () => void;
}

export const PacientesDialogs = ({
  showNewPatientForm,
  setShowNewPatientForm,
  selectedPatientId,
  setSelectedPatientId,
  showFichaDialog,
  setShowFichaDialog,
  showNovoPlano,
  setShowNovoPlano,
  planoSelecionado,
  setPlanoSelecionado,
  showVisualizarPlano,
  setShowVisualizarPlano,
  patients,
  onSuccess
}: PacientesDialogsProps) => {
  const { toast } = useToast();

  const handlePlanoSuccess = () => {
    setShowNovoPlano(false);
    onSuccess();
    toast({
      title: "Plano criado",
      description: "Plano alimentar criado com sucesso!",
    });
  };

  return (
    <>
      {showNewPatientForm && (
        <NovoPatientForm 
          open={showNewPatientForm}
          onClose={() => setShowNewPatientForm(false)}
          onSuccess={() => {
            setShowNewPatientForm(false);
            onSuccess();
          }}
        />
      )}

      {selectedPatientId && showFichaDialog && (
        <FichaPacienteDialog
          open={showFichaDialog}
          onClose={() => {
            setShowFichaDialog(false);
            setSelectedPatientId(null);
          }}
          patientId={selectedPatientId}
          onSuccess={onSuccess}
        />
      )}

      {selectedPatientId && showNovoPlano && (
        <NovoPlanoAlimentarDialog
          open={showNovoPlano}
          onClose={() => {
            setShowNovoPlano(false);
            setSelectedPatientId(null);
          }}
          onSuccess={handlePlanoSuccess}
          pacientes={patients.map(p => ({ id: p.id, nome: p.nome, email: p.email }))}
          pacienteSelecionado={selectedPatientId}
        />
      )}

      {planoSelecionado && (
        <VisualizarPlanoDialog
          open={showVisualizarPlano}
          onClose={() => {
            setShowVisualizarPlano(false);
            setPlanoSelecionado(null);
          }}
          planoId={planoSelecionado}
        />
      )}
    </>
  );
};
