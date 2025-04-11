
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, TransactionType } from '@/integrations/supabase/client';

export interface TransactionFormData {
  id?: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  fromAccount: string | null;
  toAccount: string | null;
}

export function useBankTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const initialTransactionState: TransactionFormData = {
    date: today,
    type: 'deposit',
    description: '',
    amount: 0,
    fromAccount: null,
    toAccount: null
  };

  const [newTransaction, setNewTransaction] = useState<TransactionFormData>(initialTransactionState);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Validate transaction data
      if (newTransaction.type === 'deposit' && !newTransaction.toAccount) {
        throw new Error('Please select a destination account');
      }
      
      if (newTransaction.type === 'withdrawal' && !newTransaction.fromAccount) {
        throw new Error('Please select a source account');
      }
      
      if (newTransaction.type === 'transfer' && (!newTransaction.fromAccount || !newTransaction.toAccount)) {
        throw new Error('Please select both source and destination accounts');
      }
      
      if (newTransaction.amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }
      
      // Insert transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          date: newTransaction.date,
          type: newTransaction.type,
          description: newTransaction.description,
          amount: newTransaction.amount,
          fromAccount: newTransaction.fromAccount,
          toAccount: newTransaction.toAccount,
          user_id: user.id
        }]);

      if (transactionError) throw transactionError;
      
      // Update account balances
      if (newTransaction.type === 'deposit' && newTransaction.toAccount) {
        const { error: depositError } = await supabase.rpc('increment_balance', { 
          row_id: newTransaction.toAccount,
          amount_to_add: newTransaction.amount
        });
          
        if (depositError) throw depositError;
      }
      
      if (newTransaction.type === 'withdrawal' && newTransaction.fromAccount) {
        const { error: withdrawalError } = await supabase.rpc('decrement_balance', {
          row_id: newTransaction.fromAccount,
          amount_to_subtract: newTransaction.amount  
        });
          
        if (withdrawalError) throw withdrawalError;
      }
      
      if (newTransaction.type === 'transfer' && newTransaction.fromAccount && newTransaction.toAccount) {
        const { error: fromError } = await supabase.rpc('decrement_balance', {
          row_id: newTransaction.fromAccount,
          amount_to_subtract: newTransaction.amount
        });
          
        if (fromError) throw fromError;
        
        const { error: toError } = await supabase.rpc('increment_balance', {
          row_id: newTransaction.toAccount,
          amount_to_add: newTransaction.amount
        });
          
        if (toError) throw toError;
      }
      
      toast({
        title: "Transaction processed",
        description: `Your ${newTransaction.type} transaction has been processed successfully.`,
      });
      
      setNewTransaction(initialTransactionState);
      setIsAddDialogOpen(false);
      await fetchTransactions();
    } catch (error: any) {
      console.error('Error processing transaction:', error);
      toast({
        title: "Error processing transaction",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTransactionChange = (field: string, value: any) => {
    setNewTransaction(prev => ({ ...prev, [field]: value }));
  };

  return {
    transactions,
    newTransaction,
    isLoading,
    isAddDialogOpen,
    setIsAddDialogOpen,
    fetchTransactions,
    addTransaction,
    handleNewTransactionChange,
  };
}
