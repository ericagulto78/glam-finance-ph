
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cbozlabhyzmlznhitdea.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNib3psYWJoeXptbHpuaGl0ZGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMTY1NzQsImV4cCI6MjA1OTU5MjU3NH0.FmztyCmPa5ozMDP8HlrIslKkNJ9URCzCq8FrpO_FhfQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Set admin email for the application
export const ADMIN_EMAIL = 'ericagulto@gmail.com';

// Helper function to check if a user is an admin
export const isAdmin = (email: string | undefined) => {
  return email === ADMIN_EMAIL;
};

// Type definitions and helpers for our components
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

// Type guards to ensure status values are correctly typed
export const isValidBookingStatus = (status: string): status is BookingStatus => {
  return ['upcoming', 'completed', 'cancelled'].includes(status);
};

export const isValidInvoiceStatus = (status: string): status is InvoiceStatus => {
  return ['paid', 'pending', 'overdue'].includes(status);
};

export const isValidTransactionType = (type: string): status is TransactionType => {
  return ['deposit', 'withdrawal', 'transfer'].includes(type);
};

// Helper functions to cast Supabase data to our frontend types
export const castBookingData = (data: any): Booking => {
  return {
    ...data,
    status: isValidBookingStatus(data.status) ? data.status : 'upcoming',
    reservation_fee: data.reservation_fee || 0
  };
};

export const castInvoiceData = (data: any): Invoice => {
  return {
    ...data,
    status: isValidInvoiceStatus(data.status) ? data.status : 'pending'
  };
};

export const castExpenseData = (data: any): Expense => {
  return {
    ...data,
    is_monthly: data.is_monthly || false
  };
};

export const castBankAccountData = (data: any): BankAccount => {
  return {
    id: data.id,
    bankName: data.bank_name || '',
    accountName: data.account_name || '',
    accountNumber: data.account_number || '',
    isDefault: data.is_default || false,
    balance: data.balance || 0,
    undeposited: data.undeposited || 0,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const castTransactionData = (data: any): Transaction => {
  return {
    ...data,
    type: isValidTransactionType(data.type) ? data.type : 'deposit',
    fromAccount: data.from_account || null,
    toAccount: data.to_account || null,
    amount: data.amount || 0
  };
};

// Type definitions that match our Supabase schema
export interface Booking {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
  reservation_fee?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  tax_deductible: boolean;
  is_monthly?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  balance: number;
  undeposited: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  fromAccount: string | null;
  toAccount: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}
