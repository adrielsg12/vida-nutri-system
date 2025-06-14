
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnthropometricSection } from './RegistroConsulta/AnthropometricSection';
import { CircumferenceSection } from './RegistroConsulta/CircumferenceSection';
import { VitalSignsSection } from './RegistroConsulta/VitalSignsSection';
import { ClinicalInfoSection } from './RegistroConsulta/ClinicalInfoSection';
import { useRegistroConsulta } from '@/hooks/useRegistroConsulta';

interface RegistroConsultaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  consulta: {
    id: string;
    paciente_id: string;
    pacientes: {
      nome: string;
    };
  };
}

export const RegistroConsultaDialog = ({ 
  open, 
  onClose, 
  onSuccess, 
  consulta 
}: RegistroConsultaDialogProps) => {
  const { formData, loading, updateFormData, submitConsulta, resetForm } = useRegistroConsulta();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitConsulta(consulta);
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Consulta</DialogTitle>
          <DialogDescription>
            Paciente: {consulta.pacientes?.nome}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnthropometricSection 
            formData={formData} 
            onFormDataChange={updateFormData} 
          />

          <CircumferenceSection 
            formData={formData} 
            onFormDataChange={updateFormData} 
          />

          <VitalSignsSection 
            formData={formData} 
            onFormDataChange={updateFormData} 
          />

          <ClinicalInfoSection 
            formData={formData} 
            onFormDataChange={updateFormData} 
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
