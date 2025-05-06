
import { useState, useEffect } from 'react';
import { supabase, Transaction, TransactionType, castTransaction } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TransactionFormData {
  id?: string;
  bank_account_id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  fromAccount?: string;
  toAccount?: string;
}

export const useBankTransactions = (bankAccountId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<TransactionFormData>({
    bank_account_id: bankAccountId || '',
    amount: 0,
    type: 'deposit',
    description: '',
    date: new Date().toISOString().split('T')[0],
    fromAccount: '',
    toAccount: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (bankAccountId) {
      fetchTransactions();
      // Update the form state when bankAccountId changes
      setNewTransaction(prev => ({
        ...prev,
        bank_account_id: bankAccountId
      }));
    } else {
      setTransactions([]);
      setIsLoading(false);
    }
  }, [bankAccountId]);

  const fetchTransactions = async () => {
    if (!bankAccountId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('bank_account_id', bankAccountId)
        .order('date', { ascending: false });

      if (error) throw error;
      
      setTransactions(data.map(castTransaction));
    } catch (error: any) {
      toast({
        title: "Error fetching transactions",
        description: error.message || "An error occurred while fetching transactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (transactionData: TransactionFormData) => {
    setIsLoading(true);
    try {
      // Fix: Use the exact field name that matches our database structure
      const accountId = 
        transactionData.type === 'deposit' ? 
          transactionData.toAccount : 
          transactionData.fromAccount;
      
      if (!accountId) {
        throw new Error('Account ID is required');
      }

      // Use the RPC function to increment or decrement the balance based on transaction type
      if (transactionData.type === 'deposit') {
        const { error: balanceError } = await supabase
          .rpc('increment_balance', { 
            row_id: accountId, 
            amount_to_add: transactionData.amount 
          });
          
        if (balanceError) throw balanceError;
      } else {
        const { error: balanceError } = await supabase
          .rpc('decrement_balance', { 
            row_id: accountId, 
            amount_to_subtract: transactionData.amount 
          });
          
        if (balanceError) throw balanceError;
      }

      // Create the transaction record - use bank_account_id that matches DB schema
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          bank_account_id: accountId,
          amount: transactionData.amount,
          type: transactionData.type,
          description: transactionData.description,
          date: transactionData.date,
          fromAccount: transactionData.fromAccount,
          toAccount: transactionData.toAccount,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setTransactions(prevTransactions => 
        [castTransaction(data), ...prevTransactions]
      );
      
      return { success: true, data: castTransaction(data) };
    } catch (error: any) {
      console.error('Transaction error:', error);
      toast({
        title: "Error creating transaction",
        description: error.message || "An error occurred while creating the transaction",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTransactionChange = (field: string, value: any) => {
    setNewTransaction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTransaction = async () => {
    const result = await createTransaction(newTransaction);
    if (result.success) {
      setIsAddDialogOpen(false);
      setNewTransaction({
        bank_account_id: bankAccountId || '',
        amount: 0,
        type: 'deposit',
        description: '',
        date: new Date().toISOString().split('T')[0],
        fromAccount: '',
        toAccount: ''
      });
      
      toast({
        title: "Transaction added",
        description: "The transaction has been successfully added",
      });
    }
    return result;
  };

  return {
    transactions,
    isLoading,
    createTransaction,
    fetchTransactions,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newTransaction,
    handleNewTransactionChange,
    addTransaction
  };
};
