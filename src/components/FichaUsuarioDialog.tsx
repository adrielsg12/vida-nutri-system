
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Eye, AlertTriangle, Trash2, KeyRound, Save, CheckCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

interface FichaUsuarioDialogProps {
  usuario: Usuario;
  onUsuarioAtualizado: () => void;
}

export const FichaUsuarioDialog = ({ usuario, onUsuarioAtualizado }: FichaUsuarioDialogProps) => {
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
    clinica: usuario.clinica || '',
    status: usuario.status || 'pendente'
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

      // Se o status foi alterado, atualizar também
      if (formData.status !== usuario.status) {
        await atualizarStatus(formData.status);
      }

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

  const atualizarStatus = async (novoStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: novoStatus, updated_at: new Date().toISOString() })
        .eq('id', usuario.id);

      if (error) throw error;

      // Se for aprovação, atualizar também a tabela de aprovações
      if (novoStatus === 'aprovado' && usuario.status === 'pendente') {
        await supabase.rpc('aprovar_usuario', {
          usuario_id: usuario.id,
          aprovador_id: user?.id,
          observacoes_param: 'Aprovado pelo administrador'
        });
      } else if (novoStatus === 'rejeitado' && usuario.status === 'pendente') {
        await supabase.rpc('rejeitar_usuario', {
          usuario_id: usuario.id,
          aprovador_id: user?.id,
          observacoes_param: 'Rejeitado pelo administrador'
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  };

  const redefinirSenha = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: formData.email
      });

      if (error) throw error;

      toast({
        title: "Link de recuperação enviado",
        description: "Um link para redefinir a senha foi enviado para o email do usuário.",
      });
    } catch (error) {
      console.error('Erro ao enviar link de recuperação:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar link de recuperação de senha.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const excluirUsuario = async () => {
    setLoading(true);
    try {
      // Primeiro inativar o usuário
      const { error } = await supabase.rpc('inativar_usuario', {
        usuario_id: usuario.id,
        admin_id: user?.id
      });

      if (error) throw error;

      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido do sistema.",
      });

      setOpen(false);
      onUsuarioAtualizado();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const aprovarEAtivar = async () => {
    setLoading(true);
    try {
      await atualizarStatus('aprovado');
      
      toast({
        title: "Usuário aprovado",
        description: "O usuário foi aprovado e ativado no sistema.",
      });

      setOpen(false);
      onUsuarioAtualizado();
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar usuário.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case 'rejeitado':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-4 h-4 mr-1" />
          Visualizar/Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ficha do Usuário</span>
            {getStatusBadge(usuario.status)}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clinica">Clínica/Consultório</Label>
              <Input
                id="clinica"
                value={formData.clinica}
                onChange={(e) => setFormData({ ...formData, clinica: e.target.value })}
                placeholder="Nome da clínica ou consultório"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Informações do Cadastro</h3>
            <p className="text-sm text-gray-600">
              <strong>Data de cadastro:</strong> {new Date(usuario.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 border-t">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={redefinirSenha}
              disabled={loading || !formData.email}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Redefinir Senha
            </Button>

            {usuario.status === 'pendente' && (
              <Button
                type="button"
                onClick={aprovarEAtivar}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar e Ativar
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" disabled={loading}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Usuário
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Confirmar Exclusão
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir o usuário <strong>{usuario.nome_completo}</strong>? 
                    Esta ação não pode ser desfeita e o usuário perderá todo o acesso ao sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={excluirUsuario} className="bg-red-600 hover:bg-red-700">
                    Sim, Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
