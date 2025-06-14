
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConsultaForm } from './ConsultaForm';

interface NovaConsultaDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NovaConsultaDialog = ({ open, onClose, onSuccess }: NovaConsultaDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agendar Nova Consulta</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar uma nova consulta.
          </DialogDescription>
        </DialogHeader>
        <ConsultaForm open={open} onClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};
