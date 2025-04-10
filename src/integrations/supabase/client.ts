import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Invoice types
export type InvoiceStatus = 'paid' | 'pending' | 'overdue';
export type PaymentMethod = 'cash' | 'bank' | 'unpaid';

export function isValidInvoiceStatus(status: string): status is InvoiceStatus {
  return ['paid', 'pending', 'overdue'].includes(status);
}

export function isValidPaymentMethod(method: string): method is PaymentMethod {
  return ['cash', 'bank', 'unpaid'].includes(method);
}

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
  created_at: string;
  updated_at: string;
}

export function castInvoiceData(data: any): Invoice {
  return {
    id: data.id,
    invoice_number: data.invoice_number,
    client: data.client,
    issue_date: data.issue_date,
    due_date: data.due_date,
    amount: data.amount || 0,
    status: isValidInvoiceStatus(data.status) ? data.status : 'pending',
    payment_method: isValidPaymentMethod(data.payment_method) ? data.payment_method : 'unpaid',
    bank_account_id: data.bank_account_id,
    booking_id: data.booking_id,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

// Bank Account types
export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  balance: number;
  undeposited: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function castBankAccountData(data: any): BankAccount {
  return {
    id: data.id,
    bankName: data.bank_name,
    accountName: data.account_name,
    accountNumber: data.account_number,
    isDefault: data.is_default || false,
    balance: data.balance || 0,
    undeposited: data.undeposited || 0,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

// Booking types
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export function isValidBookingStatus(status: string): status is BookingStatus {
  return ['upcoming', 'completed', 'cancelled'].includes(status);
}

export interface Booking {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
  reservation_fee: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function castBookingData(data: any): Booking {
  return {
    id: data.id,
    client: data.client,
    service: data.service,
    date: data.date,
    time: data.time,
    location: data.location,
    amount: data.amount || 0,
    status: isValidBookingStatus(data.status) ? data.status : 'upcoming',
    reservation_fee: data.reservation_fee || 0,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

// Transaction types
export type TransactionType = 'deposit' | 'withdrawal' | 'transfer';

export function isValidTransactionType(type: string): type is TransactionType {
  return ['deposit', 'withdrawal', 'transfer'].includes(type);
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  fromAccount: string | null;
  toAccount: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export function castTransactionData(data: any): Transaction {
  return {
    id: data.id,
    date: data.date,
    type: isValidTransactionType(data.type) ? data.type : 'deposit',
    description: data.description || '',
    amount: data.amount || 0,
    fromAccount: data.fromAccount,
    toAccount: data.toAccount,
    user_id: data.user_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}
