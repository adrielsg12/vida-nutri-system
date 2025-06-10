
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Trash2 } from 'lucide-react';

interface Usuario {
  id: string;
  nome_completo: string;
  email?: string;
  crn?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  clinica?: string;
  status: string;
  created_at: string;
}

interface EditarUsuarioDialogProps {
  usuario: Usuario;
  onUsuarioAtualizado: () => void;
}

export const EditarUsuarioDialog = ({ usuario, onUsuarioAtualizado }: EditarUsuarioDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: usuario.nome_completo || '',
    email: usuario.email || '',
    crn: usuario.crn || '',
    telefone: usuario.telefone || '',
    endereco: usuario.endereco || '',
    cidade: usuario.cidade || '',
    estado: usuario.estado || '',
    clinica: usuario.clinica || ''
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.rpc('atualizar_usuario_admin', {
        usuario_id: usuario.id,
        admin_id: user?.id,
        novo_nome: formData.nome_completo,
        novo_email: formData.email,
        novo_crn: formData.crn,
        novo_telefone: formData.telefone,
        novo_endereco: formData.endereco,
        nova_cidade: formData.cidade,
        novo_estado: formData.estado,
        nova_clinica: formData.clinica
      });

      if (error) throw error;

      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      });

      setOpen(false);
      onUsuarioAtualizado();
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar informações do usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInativarUsuario = async () => {
    if (!confirm('Tem certeza que deseja remover o acesso deste usuário?')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('inativar_usuario', {
        usuario_id: usuario.id,
        admin_id: user?.id
      });

      if (error) throw error;

      toast({
        title: "Usuário inativado",
        description: "O acesso do usuário foi removido.",
      });

      setOpen(false);
      onUsuarioAtualizado();
    } catch (error) {
      console.error('Erro ao inativar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover acesso do usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome_completo">Nome Completo *</Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="crn">CRN</Label>
              <Input
                id="crn"
                value={formData.crn}
                onChange={(e) => setFormData({ ...formData, crn: e.target.value })}
                placeholder="Ex: CRN-3 12345"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Rua, número, bairro"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                placeholder="Ex: SP, RJ, MG"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clinica">Clínica/Consultório</Label>
            <Input
              id="clinica"
              value={formData.clinica}
              onChange={(e) => setFormData({ ...formData, clinica: e.target.value })}
              placeholder="Nome da clínica ou consultório"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleInativarUsuario}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover Acesso
            </Button>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
