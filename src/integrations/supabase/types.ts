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
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          balance: number | null
          bank_name: string
          created_at: string
          id: string
          is_default: boolean | null
          type: Database["public"]["Enums"]["account_type"]
          undeposited: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          balance?: number | null
          bank_name: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          type?: Database["public"]["Enums"]["account_type"]
          undeposited?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          balance?: number | null
          bank_name?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          type?: Database["public"]["Enums"]["account_type"]
          undeposited?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number
          client: string
          created_at: string
          date: string
          early_morning_fee: number | null
          id: string
          location: string
          persons: number | null
          reservation_fee: number | null
          service: string
          service_details: string | null
          status: string
          time: string
          transportation_fee: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          client: string
          created_at?: string
          date: string
          early_morning_fee?: number | null
          id?: string
          location: string
          persons?: number | null
          reservation_fee?: number | null
          service: string
          service_details?: string | null
          status: string
          time: string
          transportation_fee?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          client?: string
          created_at?: string
          date?: string
          early_morning_fee?: number | null
          id?: string
          location?: string
          persons?: number | null
          reservation_fee?: number | null
          service?: string
          service_details?: string | null
          status?: string
          time?: string
          transportation_fee?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string | null
          phone: string | null
          tax_number: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          tax_number?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          tax_number?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          is_monthly: boolean | null
          tax_deductible: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_monthly?: boolean | null
          tax_deductible?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_monthly?: boolean | null
          tax_deductible?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          bank_account_id: string | null
          booking_id: string | null
          client: string
          created_at: string
          description: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          payment_method: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          booking_id?: string | null
          client: string
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string | null
          payment_method?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          booking_id?: string | null
          client?: string
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          created_at: string
          default_price: number
          icon: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_price?: number
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_price?: number
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          description: string
          fromAccount: string | null
          id: string
          toAccount: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          description: string
          fromAccount?: string | null
          id?: string
          toAccount?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          description?: string
          fromAccount?: string | null
          id?: string
          toAccount?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_fromAccount_fkey"
            columns: ["fromAccount"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_toAccount_fkey"
            columns: ["toAccount"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          nickname: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          nickname?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          nickname?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_emails: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      check_enum_exists: {
        Args: { enum_name: string }
        Returns: Json
      }
      decrement_balance: {
        Args: { row_id: string; amount_to_subtract: number }
        Returns: number
      }
      delete_bank_account: {
        Args: { account_id: string; user_id: string }
        Returns: Json
      }
      ensure_column_exists: {
        Args: {
          p_table: string
          p_column: string
          p_type: string
          p_default?: string
        }
        Returns: undefined
      }
      exec_sql: {
        Args: { sql_query: string }
        Returns: Json
      }
      get_table_structure: {
        Args: { table_name: string }
        Returns: Json
      }
      has_role: {
        Args: { required_role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      increment_balance: {
        Args: { row_id: string; amount_to_add: number }
        Returns: number
      }
      insert_bank_account: {
        Args: {
          account_type: string
          balance: number
          is_default: boolean
          undeposited: number
          bank_name: string
          account_name: string
          account_number: string
          user_id: string
        }
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_super_administrator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      refresh_schema_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_bank_account: {
        Args: {
          account_id: string
          account_type: string
          balance: number
          is_default: boolean
          undeposited: number
          bank_name: string
          account_name: string
          account_number: string
          user_id: string
        }
        Returns: Json
      }
      update_business_profile: {
        Args: {
          p_name?: string
          p_address?: string
          p_email?: string
          p_phone?: string
          p_website?: string
          p_tax_number?: string
          p_logo_url?: string
        }
        Returns: Json
      }
      update_business_profile_admin: {
        Args: {
          p_user_id: string
          p_name?: string
          p_address?: string
          p_email?: string
          p_phone?: string
          p_website?: string
          p_tax_number?: string
          p_logo_url?: string
        }
        Returns: Json
      }
      update_user_profile: {
        Args: {
          p_full_name?: string
          p_nickname?: string
          p_phone?: string
          p_bio?: string
          p_address?: string
          p_avatar_url?: string
        }
        Returns: Json
      }
      update_user_profile_admin: {
        Args: {
          p_user_id: string
          p_full_name?: string
          p_nickname?: string
          p_phone?: string
          p_bio?: string
          p_address?: string
          p_avatar_url?: string
          p_role?: string
          p_status?: string
        }
        Returns: Json
      }
    }
    Enums: {
      account_type: "bank" | "e-wallet"
      user_role:
        | "client"
        | "team_member"
        | "studio_admin"
        | "super_administrator"
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
    Enums: {
      account_type: ["bank", "e-wallet"],
      user_role: [
        "client",
        "team_member",
        "studio_admin",
        "super_administrator",
      ],
    },
  },
} as const
