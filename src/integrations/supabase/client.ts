import { createClient } from '@supabase/supabase-js';

// Use import.meta.env instead of process.env for Vite applications
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cbozlabhyzmlznhitdea.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3psYWJoeXptbHpuaGl0ZGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTY1NzQsImV4cCI6MjA1OTU5MjU3NH0.FmztyCmPa5ozMDP8HlrIslKkNJ9URCzCq8FrpO_FhfQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const ADMIN_EMAIL = 'admin@example.com';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          balance: number | null
          created_at: string
          id: string
          is_default: boolean | null
          name: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          undeposited: number | null
          bank_name: string | null
          account_name: string | null
          account_number: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          undeposited?: number | null
          bank_name?: string | null
          account_name?: string | null
          account_number?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          undeposited?: number | null
          bank_name?: string | null
          account_name?: string | null
          account_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          amount: number | null
          client: string | null
          created_at: string | null
          date: string | null
          id: string
          location: string | null
          reservation_fee: number | null
          service: string | null
          service_details: string | null
          status: string | null
          time: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          client?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          location?: string | null
          reservation_fee?: number | null
          service?: string | null
          service_details?: string | null
          status?: string | null
          time?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          client?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          location?: string | null
          reservation_fee?: number | null
          service?: string | null
          service_details?: string | null
          status?: string | null
          time?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      expenses: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          date: string | null
          description: string | null
          id: string
          updated_at: string | null
          user_id: string | null
          tax_deductible: boolean | null
          is_monthly: boolean | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          tax_deductible?: boolean | null
          is_monthly?: boolean | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
          tax_deductible?: boolean | null
          is_monthly?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invoices: {
        Row: {
          amount: number | null
          bank_account_id: string | null
          booking_id: string | null
          client: string | null
          created_at: string | null
          due_date: string | null
          id: string
          invoice_number: string | null
          issue_date: string | null
          payment_method: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          description: string | null
        }
        Insert: {
          amount?: number | null
          bank_account_id?: string | null
          booking_id?: string | null
          client?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          description?: string | null
        }
        Update: {
          amount?: number | null
          bank_account_id?: string | null
          booking_id?: string | null
          client?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_bank_account_id_fkey"
            columns: ["bank_account_id"]
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      service_types: {
        Row: {
          created_at: string | null
          default_price: number | null
          id: string
          name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          default_price?: number | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          default_price?: number | null
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_types_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          created_at: string
          date: string | null
          description: string | null
          fromAccount: string | null
          id: string
          toAccount: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          date?: string | null
          description?: string | null
          fromAccount?: string | null
          id?: string
          toAccount?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at: string
          date: string | null
          description: string | null
          fromAccount: string | null
          id: string
          toAccount: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_fromAccount_fkey"
            columns: ["fromAccount"]
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_toAccount_fkey"
            columns: ["toAccount"]
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_balance: {
        Args: {
          row_id: string
          amount_to_add: number
        }
        Returns: string
      }
      decrement_balance: {
        Args: {
          row_id: string
          amount_to_subtract: number
        }
        Returns: string
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

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & { _: never })
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & { _: never })
  : never = never
  > = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & { _: never })[TableName]["Row"]
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & { _: never })
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] & { _: never })["Row"]
  : never

export type TableInsert<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & { _: never })
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & { _: never })
  : never = never
  > = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & { _: never })[TableName]["Insert"]
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & { _: never })
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] & { _: never })["Insert"]
  : never

export type TableUpdate<
  PublicTableNameOrOptions extends
  | keyof (Database["public"]["Tables"] & { _: never })
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] & { _: never })
  : never = never
  > = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] & { _: never })[TableName]["Update"]
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & { _: never })
  ? (Database["public"]["Tables"][PublicTableNameOrOptions] & { _: never })["Update"]
  : never

export type BankAccount = Tables<'bank_accounts'>;
export type Booking = Tables<'bookings'>;
export type Expense = Tables<'expenses'>;
export interface Invoice {
  id: string;
  invoice_number: string;
  client: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  payment_method: PaymentMethod;
  bank_account_id?: string | null;
  booking_id?: string | null;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
}
export type ServiceType = Tables<'service_types'>;
export type Transaction = Tables<'transactions'>;

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';
export type InvoiceStatus = 'pending' | 'paid' | 'overdue';
export type PaymentMethod = 'cash' | 'bank' | 'unpaid';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

// Helper function to cast Booking data
export const castBookingData = (data: any): Booking => {
  return {
    id: data.id,
    client: data.client || '',
    service: data.service || '',
    date: data.date || '',
    time: data.time || '',
    location: data.location || '',
    amount: data.amount || 0,
    status: data.status || 'upcoming',
    reservation_fee: data.reservation_fee || 0,
    user_id: data.user_id || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    service_details: data.service_details || null,
  };
};

// Helper function to cast Invoice data
export const castInvoiceData = (data: any): Invoice => {
  return {
    id: data.id,
    invoice_number: data.invoice_number || '',
    client: data.client || '',
    issue_date: data.issue_date || '',
    due_date: data.due_date || '',
    amount: data.amount || 0,
    status: data.status || 'pending',
    payment_method: data.payment_method || 'unpaid',
    bank_account_id: data.bank_account_id || null,
    booking_id: data.booking_id || null,
    user_id: data.user_id || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    description: data.description || '',
  };
};

// Helper function to cast BankAccount data
export const castBankAccountData = (data: any): BankAccount => {
  return {
    id: data.id,
    name: data.name || '',
    type: data.type || '',
    balance: data.balance || 0,
    is_default: data.is_default || false,
    user_id: data.user_id || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
    undeposited: data.undeposited || 0,
    bank_name: data.bank_name || '',
    account_name: data.account_name || '',
    account_number: data.account_number || '',
  };
};

// Helper function to cast Expense data
export const castExpenseData = (data: any): Expense => {
  return {
    id: data.id,
    description: data.description || '',
    category: data.category || '',
    amount: data.amount || 0,
    date: data.date || '',
    tax_deductible: data.tax_deductible || false,
    is_monthly: data.is_monthly || false,
    user_id: data.user_id || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
  };
};

// Helper function to cast Transaction data
export const castTransactionData = (data: any): Transaction => {
  return {
    id: data.id,
    type: data.type || 'deposit',
    date: data.date || '',
    description: data.description || '',
    amount: data.amount || 0,
    fromAccount: data.fromAccount || null,
    toAccount: data.toAccount || null,
    user_id: data.user_id || '',
    created_at: data.created_at || '',
    updated_at: data.updated_at || '',
  };
};

// Helper function to check if a user is an admin
export const isAdmin = (email: string | undefined): boolean => {
  return email === ADMIN_EMAIL;
};
