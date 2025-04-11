import { createClient } from '@supabase/supabase-js';

// Use import.meta.env instead of process.env for Vite applications
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cbozlabhyzmlznhitdea.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3psYWJoeXptbHpuaGl0ZGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTY1NzQsImV4cCI6MjA1OTU5MjU3NH0.FmztyCmPa5ozMDP8HlrIslKkNJ9URCzCq8FrpO_FhfQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
export const ADMIN_EMAIL = 'admin@example.com';

// Supabase types
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
          account_name: string | null
          account_number: string | null
          balance: number | null
          bank_name: string | null
          created_at: string
          id: string
          is_default: boolean | null
          name: string | null
          type: string | null
          undeposited: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          balance?: number | null
          bank_name?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          type?: string | null
          undeposited?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          balance?: number | null
          bank_name?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          type?: string | null
          undeposited?: number | null
          updated_at?: string
          user_id?: string | null
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
          created_at: string
          date: string | null
          id: string
          location: string | null
          reservation_fee: number | null
          service: string | null
          service_details: string | null
          status: string | null
          time: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          client?: string | null
          created_at?: string
          date?: string | null
          id?: string
          location?: string | null
          reservation_fee?: number | null
          service?: string | null
          service_details?: string | null
          status?: string | null
          time?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          client?: string | null
          created_at?: string
          date?: string | null
          id?: string
          location?: string | null
          reservation_fee?: number | null
          service?: string | null
          service_details?: string | null
          status?: string | null
          time?: string | null
          updated_at?: string
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
          created_at: string
          date: string | null
          id: string
          is_monthly: boolean | null
          name: string | null
          tax_deductible: boolean | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string
          date?: string | null
          id?: string
          is_monthly?: boolean | null
          name?: string | null
          tax_deductible?: boolean | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string
          date?: string | null
          id?: string
          is_monthly?: boolean | null
          name?: string | null
          tax_deductible?: boolean | null
          updated_at?: string
          user_id?: string | null
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
          created_at: string
          due_date: string | null
          email: string | null
          id: string
          invoice_number: string | null
          issue_date: string | null
          notes: string | null
          payment_method: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          bank_account_id?: string | null
          booking_id?: string | null
          client?: string | null
          created_at?: string
          due_date?: string | null
          email?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          bank_account_id?: string | null
          booking_id?: string | null
          client?: string | null
          created_at?: string
          due_date?: string | null
          email?: string | null
          id?: string
          invoice_number?: string | null
          issue_date?: string | null
          notes?: string | null
          payment_method?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
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
          created_at: string
          description: string | null
          duration: number | null
          id: string
          name: string | null
          price: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          name?: string | null
          price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          name?: string | null
          price?: number | null
          updated_at?: string
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
          bank_account_id: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          bank_account_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          bank_account_id?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
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
      user_profiles: {
        Row: {
          approved: boolean | null
          created_at: string
          id: string
          rejection_reason: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
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
      decrement_balance: {
        Args: {
          row_id: string
          amount_to_subtract: number
        }
        Returns: undefined
      }
      increment_balance: {
        Args: {
          row_id: string
          amount_to_add: number
        }
        Returns: undefined
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

// Create TypeScript types for our database tables
export interface BankAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  is_default: boolean;
  undeposited: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to cast database types to our interface
export const castBankAccount = (data: any): BankAccount => ({
  id: data.id,
  name: data.name,
  type: data.type,
  balance: data.balance || 0,
  is_default: data.is_default || false,
  undeposited: data.undeposited || 0,
  bank_name: data.bank_name || '',
  account_name: data.account_name || '',
  account_number: data.account_number || '',
  created_at: data.created_at,
  updated_at: data.updated_at,
  user_id: data.user_id
});

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  client: string;
  service: string;
  service_details: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  reservation_fee: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to cast database types to our interface
export const castBooking = (data: any): Booking => ({
  id: data.id,
  client: data.client,
  service: data.service,
  service_details: data.service_details || '',
  date: data.date,
  time: data.time,
  location: data.location || '',
  amount: data.amount || 0,
  reservation_fee: data.reservation_fee || 0,
  status: data.status as BookingStatus,
  created_at: data.created_at,
  updated_at: data.updated_at,
  user_id: data.user_id
});

export type ExpenseCategory = 'supplies' | 'equipment' | 'travel' | 'rent' | 'utilities' | 'marketing' | 'professional' | 'insurance' | 'taxes' | 'other';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  tax_deductible: boolean;
  is_monthly: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to cast database types to our interface
export const castExpense = (data: any): Expense => ({
  id: data.id,
  name: data.name,
  amount: data.amount || 0,
  category: data.category as ExpenseCategory,
  date: data.date,
  tax_deductible: data.tax_deductible || false,
  is_monthly: data.is_monthly || false,
  created_at: data.created_at,
  updated_at: data.updated_at,
  user_id: data.user_id
});

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'bank_transfer' | 'check' | 'unpaid';

export interface Invoice {
  id: string;
  invoice_number: string;
  client: string;
  email: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  payment_method: PaymentMethod;
  bank_account_id: string | null;
  booking_id: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to cast database types to our interface
export const castInvoice = (data: any): Invoice => ({
  id: data.id,
  invoice_number: data.invoice_number,
  client: data.client,
  email: data.email || '',
  issue_date: data.issue_date,
  due_date: data.due_date,
  amount: data.amount || 0,
  status: data.status as InvoiceStatus,
  payment_method: data.payment_method as PaymentMethod,
  bank_account_id: data.bank_account_id,
  booking_id: data.booking_id,
  notes: data.notes || '',
  created_at: data.created_at,
  updated_at: data.updated_at,
  user_id: data.user_id
});

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to cast database types to our interface
export const castServiceType = (data: any): ServiceType => ({
  id: data.id,
  name: data.name,
  description: data.description || '',
  price: data.price || 0,
  duration: data.duration || 60,
  created_at: data.created_at,
  updated_at: data.updated_at,
  user_id: data.user_id
});

export interface Transaction {
  id: string;
  bank_account_id: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Helper function to cast database types to our interface
export const castTransaction = (data: any): Transaction => ({
  id: data.id,
  bank_account_id: data.bank_account_id,
  amount: data.amount || 0,
  type: data.type as 'deposit' | 'withdrawal',
  description: data.description || '',
  date: data.date,
  created_at: data.created_at,
  updated_at: data.updated_at,
  user_id: data.user_id
});

// Function to check if a user is an admin
export const isAdmin = (email: string | undefined | null): boolean => {
  if (!email) return false;
  return email === ADMIN_EMAIL;
};
