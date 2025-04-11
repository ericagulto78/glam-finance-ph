
import { useState, useEffect } from 'react';
import { supabase, Transaction, castTransaction } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useBankTransactions = (bankAccountId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (bankAccountId) {
      fetchTransactions();
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

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    setIsLoading(true);
    try {
      // Use the RPC function to increment or decrement the balance based on transaction type
      if (transactionData.type === 'deposit') {
        const { data: balanceData, error: balanceError } = await supabase
          .rpc('increment_balance', { 
            row_id: transactionData.bank_account_id, 
            amount_to_add: transactionData.amount 
          });
          
        if (balanceError) throw balanceError;
      } else {
        const { data: balanceData, error: balanceError } = await supabase
          .rpc('decrement_balance', { 
            row_id: transactionData.bank_account_id, 
            amount_to_subtract: transactionData.amount 
          });
          
        if (balanceError) throw balanceError;
      }

      // Create the transaction record
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transactionData,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTransactions(prevTransactions => 
        [castTransaction(data), ...prevTransactions]
      );
      
      return { success: true, data: castTransaction(data) };
    } catch (error: any) {
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

  return {
    transactions,
    isLoading,
    createTransaction,
    fetchTransactions
  };
};
