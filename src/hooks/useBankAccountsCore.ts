
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, BankAccount, castBankAccount } from '@/integrations/supabase/client';

export function useBankAccountsCore() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Calculate total stats
  const totalStats = {
    totalBalance: bankAccounts.reduce((sum, account) => sum + account.balance, 0),
    totalUndeposited: bankAccounts.reduce((sum, account) => sum + account.undeposited, 0),
    totalCashOnHand: bankAccounts.reduce((sum, account) => sum + account.balance + account.undeposited, 0)
  };

  // Fetch bank accounts
  const fetchBankAccounts = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('is_default', { ascending: false })
        .order('bank_name', { ascending: true });

      if (error) {
        throw error;
      }
      
      // Cast the data to ensure it matches our BankAccount type
      const typedAccounts = data?.map(account => castBankAccount(account)) || [];
      setBankAccounts(typedAccounts);
    } catch (error: any) {
      console.error('Error fetching bank accounts:', error);
      toast({
        title: "Error fetching bank accounts",
        description: error.message || "Failed to load your accounts",
        variant: "destructive",
      });
      setBankAccounts([]); // Set to empty array in case of error
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchBankAccounts();
    }
  }, [user, fetchBankAccounts]);

  return {
    bankAccounts,
    isLoading,
    totalStats,
    fetchBankAccounts,
  };
}
