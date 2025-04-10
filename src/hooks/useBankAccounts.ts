
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, BankAccount } from '@/integrations/supabase/client';

export interface BankAccountFormData {
  id?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  balance: number;
  undeposited: number;
}

export function useBankAccounts() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<BankAccount | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [totalStats, setTotalStats] = useState({
    totalBalance: 0,
    totalUndeposited: 0,
    totalCashOnHand: 0
  });

  const initialAccountState: BankAccountFormData = {
    bankName: '',
    accountName: '',
    accountNumber: '',
    isDefault: false,
    balance: 0,
    undeposited: 0
  };

  // Fetch bank accounts
  const fetchBankAccounts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert the data to our BankAccount type
      const accounts: BankAccount[] = data.map(account => ({
        id: account.id,
        bankName: account.bank_name,
        accountName: account.account_name,
        accountNumber: account.account_number,
        isDefault: account.is_default,
        balance: account.balance,
        undeposited: account.undeposited
      }));
      
      setBankAccounts(accounts);
      
      // Calculate totals
      const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
      const totalUndeposited = accounts.reduce((sum, account) => sum + account.undeposited, 0);
      const totalCashOnHand = totalBalance + totalUndeposited;
      
      setTotalStats({
        totalBalance,
        totalUndeposited,
        totalCashOnHand
      });
    } catch (error: any) {
      console.error('Error fetching bank accounts:', error);
      toast({
        title: "Error fetching bank accounts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [user]);

  const addBankAccount = async (formData: BankAccountFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // If this is the default account, update all other accounts to not be default
      if (formData.isDefault) {
        await supabase
          .from('bank_accounts')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }
      
      // Insert the new account
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert([{
          user_id: user.id,
          bank_name: formData.bankName,
          account_name: formData.accountName,
          account_number: formData.accountNumber,
          is_default: formData.isDefault,
          balance: formData.balance,
          undeposited: formData.undeposited
        }])
        .select();

      if (error) throw error;
      
      toast({
        title: "Account added",
        description: "New bank account has been added successfully.",
      });
      
      await fetchBankAccounts();
    } catch (error: any) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Error adding bank account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateBankAccount = async (id: string, formData: BankAccountFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // If this is the default account, update all other accounts to not be default
      if (formData.isDefault) {
        await supabase
          .from('bank_accounts')
          .update({ is_default: false })
          .neq('id', id)
          .eq('user_id', user.id);
      }
      
      // Update the account
      const { error } = await supabase
        .from('bank_accounts')
        .update({
          bank_name: formData.bankName,
          account_name: formData.accountName,
          account_number: formData.accountNumber,
          is_default: formData.isDefault,
          balance: formData.balance,
          undeposited: formData.undeposited
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Account updated",
        description: "Bank account details have been updated successfully.",
      });
      
      await fetchBankAccounts();
    } catch (error: any) {
      console.error('Error updating bank account:', error);
      toast({
        title: "Error updating bank account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBankAccount = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Account deleted",
        description: "Bank account has been removed successfully.",
      });
      
      await fetchBankAccounts();
    } catch (error: any) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Error deleting bank account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setAccountDefault = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Set all accounts to not default
      await supabase
        .from('bank_accounts')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Set this account to default
      const { error } = await supabase
        .from('bank_accounts')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Default account updated",
        description: "Your default bank account has been updated.",
      });
      
      await fetchBankAccounts();
    } catch (error: any) {
      console.error('Error setting default bank account:', error);
      toast({
        title: "Error updating default account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bankAccounts,
    isLoading,
    isEditing,
    currentAccount,
    totalStats,
    initialAccountState,
    setIsEditing,
    setCurrentAccount,
    fetchBankAccounts,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setAccountDefault
  };
}
