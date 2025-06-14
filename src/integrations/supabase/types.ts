export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alimentos: {
        Row: {
          calorias_por_100g: number | null
          carboidratos_por_100g: number | null
          categoria: string | null
          created_at: string | null
          fibras_por_100g: number | null
          gorduras_por_100g: number | null
          id: string
          is_publico: boolean | null
          nome: string
          nutricionista_id: string | null
          proteinas_por_100g: number | null
          quantidade_padrao: number | null
          unidade_medida: string | null
          updated_at: string | null
        }
        Insert: {
          calorias_por_100g?: number | null
          carboidratos_por_100g?: number | null
          categoria?: string | null
          created_at?: string | null
          fibras_por_100g?: number | null
          gorduras_por_100g?: number | null
          id?: string
          is_publico?: boolean | null
          nome: string
          nutricionista_id?: string | null
          proteinas_por_100g?: number | null
          quantidade_padrao?: number | null
          unidade_medida?: string | null
          updated_at?: string | null
        }
        Update: {
          calorias_por_100g?: number | null
          carboidratos_por_100g?: number | null
          categoria?: string | null
          created_at?: string | null
          fibras_por_100g?: number | null
          gorduras_por_100g?: number | null
          id?: string
          is_publico?: boolean | null
          nome?: string
          nutricionista_id?: string | null
          proteinas_por_100g?: number | null
          quantidade_padrao?: number | null
          unidade_medida?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      aprovacoes_acesso: {
        Row: {
          aprovado_por: string | null
          created_at: string | null
          data_aprovacao: string | null
          data_solicitacao: string | null
          id: string
          observacoes: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aprovado_por?: string | null
          created_at?: string | null
          data_aprovacao?: string | null
          data_solicitacao?: string | null
          id?: string
          observacoes?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aprovado_por?: string | null
          created_at?: string | null
          data_aprovacao?: string | null
          data_solicitacao?: string | null
          id?: string
          observacoes?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      consultas: {
        Row: {
          created_at: string | null
          data_hora: string
          id: string
          link_online: string | null
          nutricionista_id: string
          observacoes: string | null
          paciente_id: string
          status: string | null
          tipo: string | null
          updated_at: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string | null
          data_hora: string
          id?: string
          link_online?: string | null
          nutricionista_id: string
          observacoes?: string | null
          paciente_id: string
          status?: string | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string | null
          data_hora?: string
          id?: string
          link_online?: string | null
          nutricionista_id?: string
          observacoes?: string | null
          paciente_id?: string
          status?: string | null
          tipo?: string | null
          updated_at?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos_substituicao: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          nutricionista_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          nutricionista_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          nutricionista_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      itens_plano_alimentar: {
        Row: {
          alimento_id: string
          created_at: string | null
          dia_semana: number
          horario_recomendado: string | null
          id: string
          observacoes: string | null
          ordem: number | null
          plano_id: string
          quantidade: number
          refeicao: string
          unidade_medida: string
        }
        Insert: {
          alimento_id: string
          created_at?: string | null
          dia_semana: number
          horario_recomendado?: string | null
          id?: string
          observacoes?: string | null
          ordem?: number | null
          plano_id: string
          quantidade: number
          refeicao: string
          unidade_medida: string
        }
        Update: {
          alimento_id?: string
          created_at?: string | null
          dia_semana?: number
          horario_recomendado?: string | null
          id?: string
          observacoes?: string | null
          ordem?: number | null
          plano_id?: string
          quantidade?: number
          refeicao?: string
          unidade_medida?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_plano_alimentar_alimento_id_fkey"
            columns: ["alimento_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_plano_alimentar_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_alimentares"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_substituicao: {
        Row: {
          alimento_id: string
          created_at: string | null
          grupo_id: string
          id: string
          observacoes: string | null
          quantidade_equivalente: number | null
          unidade_medida: string | null
        }
        Insert: {
          alimento_id: string
          created_at?: string | null
          grupo_id: string
          id?: string
          observacoes?: string | null
          quantidade_equivalente?: number | null
          unidade_medida?: string | null
        }
        Update: {
          alimento_id?: string
          created_at?: string | null
          grupo_id?: string
          id?: string
          observacoes?: string | null
          quantidade_equivalente?: number | null
          unidade_medida?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itens_substituicao_alimento_id_fkey"
            columns: ["alimento_id"]
            isOneToOne: false
            referencedRelation: "alimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_substituicao_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos_substituicao"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          alergias_intolerancia: string | null
          anotacoes_privadas: string | null
          cpf: string | null
          created_at: string | null
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          habitos_alimentares: string | null
          historico_clinico: string | null
          id: string
          medicamentos: string | null
          nome: string
          nutricionista_id: string
          objetivo: string | null
          profissao: string | null
          rotina: string | null
          sexo: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          alergias_intolerancia?: string | null
          anotacoes_privadas?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          habitos_alimentares?: string | null
          historico_clinico?: string | null
          id?: string
          medicamentos?: string | null
          nome: string
          nutricionista_id: string
          objetivo?: string | null
          profissao?: string | null
          rotina?: string | null
          sexo?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          alergias_intolerancia?: string | null
          anotacoes_privadas?: string | null
          cpf?: string | null
          created_at?: string | null
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          habitos_alimentares?: string | null
          historico_clinico?: string | null
          id?: string
          medicamentos?: string | null
          nome?: string
          nutricionista_id?: string
          objetivo?: string | null
          profissao?: string | null
          rotina?: string | null
          sexo?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pagamentos: {
        Row: {
          consulta_id: string | null
          created_at: string | null
          data_pagamento: string
          forma_pagamento: string
          id: string
          nutricionista_id: string
          observacoes: string | null
          paciente_id: string
          status: string | null
          valor: number
        }
        Insert: {
          consulta_id?: string | null
          created_at?: string | null
          data_pagamento: string
          forma_pagamento: string
          id?: string
          nutricionista_id: string
          observacoes?: string | null
          paciente_id: string
          status?: string | null
          valor: number
        }
        Update: {
          consulta_id?: string | null
          created_at?: string | null
          data_pagamento?: string
          forma_pagamento?: string
          id?: string
          nutricionista_id?: string
          observacoes?: string | null
          paciente_id?: string
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pagamentos_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      planos_alimentares: {
        Row: {
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao: string | null
          id: string
          nutricionista_id: string
          paciente_id: string
          plano_json: Json | null
          status: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          nutricionista_id: string
          paciente_id: string
          plano_json?: Json | null
          status?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string | null
          id?: string
          nutricionista_id?: string
          paciente_id?: string
          plano_json?: Json | null
          status?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planos_alimentares_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cidade: string | null
          clinica: string | null
          created_at: string | null
          crn: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          logotipo_url: string | null
          nome_completo: string
          status: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          cidade?: string | null
          clinica?: string | null
          created_at?: string | null
          crn?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id: string
          logotipo_url?: string | null
          nome_completo: string
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          cidade?: string | null
          clinica?: string | null
          created_at?: string | null
          crn?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          logotipo_url?: string | null
          nome_completo?: string
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      registros_consulta: {
        Row: {
          altura: number | null
          circunferencia_cintura: number | null
          circunferencia_quadril: number | null
          conduta_nutricional: string | null
          consulta_id: string
          created_at: string | null
          evolucao: string | null
          frequencia_cardiaca: number | null
          id: string
          massa_muscular: number | null
          nutricionista_id: string
          observacoes_clinicas: string | null
          paciente_id: string
          percentual_gordura: number | null
          peso: number | null
          pressao_arterial_diastolica: number | null
          pressao_arterial_sistolica: number | null
          queixas_principais: string | null
          retorno_recomendado: string | null
          updated_at: string | null
        }
        Insert: {
          altura?: number | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          conduta_nutricional?: string | null
          consulta_id: string
          created_at?: string | null
          evolucao?: string | null
          frequencia_cardiaca?: number | null
          id?: string
          massa_muscular?: number | null
          nutricionista_id: string
          observacoes_clinicas?: string | null
          paciente_id: string
          percentual_gordura?: number | null
          peso?: number | null
          pressao_arterial_diastolica?: number | null
          pressao_arterial_sistolica?: number | null
          queixas_principais?: string | null
          retorno_recomendado?: string | null
          updated_at?: string | null
        }
        Update: {
          altura?: number | null
          circunferencia_cintura?: number | null
          circunferencia_quadril?: number | null
          conduta_nutricional?: string | null
          consulta_id?: string
          created_at?: string | null
          evolucao?: string | null
          frequencia_cardiaca?: number | null
          id?: string
          massa_muscular?: number | null
          nutricionista_id?: string
          observacoes_clinicas?: string | null
          paciente_id?: string
          percentual_gordura?: number | null
          peso?: number | null
          pressao_arterial_diastolica?: number | null
          pressao_arterial_sistolica?: number | null
          queixas_principais?: string | null
          retorno_recomendado?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_consulta_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_consulta_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aprovar_usuario: {
        Args: {
          usuario_id: string
          aprovador_id: string
          observacoes_param?: string
        }
        Returns: boolean
      }
      atualizar_usuario_admin: {
        Args: {
          usuario_id: string
          admin_id: string
          novo_nome?: string
          novo_email?: string
          novo_crn?: string
          novo_telefone?: string
          novo_endereco?: string
          nova_cidade?: string
          novo_estado?: string
          nova_clinica?: string
        }
        Returns: boolean
      }
      inativar_usuario: {
        Args: { usuario_id: string; admin_id: string }
        Returns: boolean
      }
      reativar_usuario: {
        Args: { usuario_id: string; admin_id: string }
        Returns: boolean
      }
      rejeitar_usuario: {
        Args: {
          usuario_id: string
          aprovador_id: string
          observacoes_param?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
