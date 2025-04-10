
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  supabase, 
  Transaction, 
  TransactionType,
  castTransactionData 
} from '@/integrations/supabase/client';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initial transaction form state
  const initialTransactionState: TransactionFormData = {
    date: new Date().toISOString().split('T')[0],
    type: 'deposit',
    description: '',
    amount: 0,
    fromAccount: null,
    toAccount: null,
  };
  
  const [newTransaction, setNewTransaction] = useState<TransactionFormData>(initialTransactionState);

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure it matches our Transaction type
      const typedTransactions = data?.map(transaction => castTransactionData(transaction)) || [];
      setTransactions(typedTransactions);
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

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Add a new transaction
  const addTransaction = async () => {
    if (!user) return;
    
    if (!newTransaction.date || !newTransaction.description || newTransaction.amount <= 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields with valid values",
        variant: "destructive",
      });
      return;
    }

    // For transfers, we need both accounts
    if (newTransaction.type === 'transfer' && (!newTransaction.fromAccount || !newTransaction.toAccount)) {
      toast({
        title: "Missing account information",
        description: "Please select both source and destination accounts for the transfer",
        variant: "destructive",
      });
      return;
    }

    // For deposits, we need the destination account
    if (newTransaction.type === 'deposit' && !newTransaction.toAccount) {
      toast({
        title: "Missing account information",
        description: "Please select the destination account for the deposit",
        variant: "destructive",
      });
      return;
    }

    // For withdrawals, we need the source account
    if (newTransaction.type === 'withdrawal' && !newTransaction.fromAccount) {
      toast({
        title: "Missing account information",
        description: "Please select the source account for the withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create the transaction
      const transactionToInsert = {
        date: newTransaction.date,
        type: newTransaction.type,
        description: newTransaction.description,
        amount: newTransaction.amount,
        fromAccount: newTransaction.fromAccount,
        toAccount: newTransaction.toAccount,
        user_id: user.id,
      };

      const { data, error } = await (supabase as any)
        .from('transactions')
        .insert([transactionToInsert])
        .select();

      if (error) throw error;
      
      // 2. Update account balances based on transaction type
      if (newTransaction.type === 'deposit' && newTransaction.toAccount) {
        // Get the account
        const { data: accountData } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('id', newTransaction.toAccount)
          .single();
          
        if (accountData) {
          // Increase the balance
          await supabase
            .from('bank_accounts')
            .update({
              balance: (accountData.balance || 0) + newTransaction.amount,
            })
            .eq('id', newTransaction.toAccount);
        }
      } 
      else if (newTransaction.type === 'withdrawal' && newTransaction.fromAccount) {
        // Get the account
        const { data: accountData } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('id', newTransaction.fromAccount)
          .single();
          
        if (accountData) {
          // Decrease the balance
          await supabase
            .from('bank_accounts')
            .update({
              balance: Math.max((accountData.balance || 0) - newTransaction.amount, 0),
            })
            .eq('id', newTransaction.fromAccount);
        }
      }
      else if (newTransaction.type === 'transfer' && newTransaction.fromAccount && newTransaction.toAccount) {
        // Get the accounts
        const { data: fromAccountData } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('id', newTransaction.fromAccount)
          .single();
          
        const { data: toAccountData } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('id', newTransaction.toAccount)
          .single();
          
        if (fromAccountData && toAccountData) {
          // Decrease from account
          await supabase
            .from('bank_accounts')
            .update({
              balance: Math.max((fromAccountData.balance || 0) - newTransaction.amount, 0),
            })
            .eq('id', newTransaction.fromAccount);
            
          // Increase to account
          await supabase
            .from('bank_accounts')
            .update({
              balance: (toAccountData.balance || 0) + newTransaction.amount,
            })
            .eq('id', newTransaction.toAccount);
        }
      }
      
      setIsAddDialogOpen(false);
      // Refresh transactions and accounts
      await fetchTransactions();
      setNewTransaction(initialTransactionState);
      toast({
        title: "Transaction added",
        description: "The transaction has been successfully processed",
      });
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error processing transaction",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes for new transaction
  const handleNewTransactionChange = (field: string, value: any) => {
    setNewTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Reset accounts when changing transaction type
    if (field === 'type') {
      setNewTransaction((prev) => ({
        ...prev,
        fromAccount: null,
        toAccount: null,
      }));
    }
  };

  return {
    transactions,
    newTransaction,
    selectedTransaction,
    isAddDialogOpen,
    isLoading,
    setSelectedTransaction,
    setIsAddDialogOpen,
    handleNewTransactionChange,
    addTransaction,
    fetchTransactions
  };
}
