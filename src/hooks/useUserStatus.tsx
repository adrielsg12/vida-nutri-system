
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserProfile {
  id: string;
  nome_completo: string;
  status: string;
  crn?: string;
  telefone?: string;
  endereco?: string;
  clinica?: string;
  cidade?: string;
  estado?: string;
}

export const useUserStatus = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome_completo, status, crn, telefone, endereco, clinica, cidade, estado')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil do usuário:', error);
          setUserProfile(null);
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar perfil:', error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  return {
    userProfile,
    loading,
    isAdmin: userProfile?.status === 'admin',
    isApproved: userProfile?.status === 'aprovado' || userProfile?.status === 'admin',
    isPending: userProfile?.status === 'pendente',
    isRejected: userProfile?.status === 'rejeitado',
    isInactive: userProfile?.status === 'inativo',
  };
};
