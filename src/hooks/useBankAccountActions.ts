
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, BankAccount } from '@/integrations/supabase/client';

export interface BankAccountFormData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  balance: number;
  undeposited: number;
  accountType?: string;
}

export function useBankAccountActions(refreshAccounts: () => Promise<void>) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initial bank account form state
  const initialAccountState: Omit<BankAccount, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
    type: 'bank',
    balance: 0,
    is_default: false,
    undeposited: 0,
    bank_name: '',
    account_name: '',
    account_number: ''
  };

  // Add a new bank account
  const addBankAccount = async (formData: BankAccountFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const accountToInsert = {
        type: formData.accountType || 'bank',
        balance: formData.balance,
        is_default: formData.isDefault,
        undeposited: formData.undeposited,
        bank_name: formData.bankName,
        account_name: formData.accountName,
        account_number: formData.accountNumber,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('bank_accounts')
        .insert([accountToInsert])
        .select();

      if (error) throw error;
      
      // Immediately fetch bank accounts after adding
      await refreshAccounts();
      
      toast({
        title: "Bank account added",
        description: "The bank account has been successfully added",
      });
      
      return data;
    } catch (error: any) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Error adding bank account",
        description: error.message || "Failed to add bank account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing bank account
  const updateBankAccount = async (id: string, formData: BankAccountFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .update({
          type: formData.accountType || 'bank',
          balance: formData.balance,
          is_default: formData.isDefault,
          undeposited: formData.undeposited,
          bank_name: formData.bankName,
          account_name: formData.accountName,
          account_number: formData.accountNumber
        })
        .eq('id', id);

      if (error) throw error;
      
      // Immediately fetch bank accounts after updating
      await refreshAccounts();
      toast({
        title: "Bank account updated",
        description: "The bank account has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating bank account:', error);
      toast({
        title: "Error updating bank account",
        description: error.message || "Failed to update bank account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a bank account
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
        title: "Bank account deleted",
        description: `Bank account has been deleted.`,
      });
      
      // Refresh accounts after deletion
      await refreshAccounts();
    } catch (error: any) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Error deleting bank account",
        description: error.message || "Failed to delete bank account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set account as default
  const setAccountDefault = async (id: string) => {
    setIsLoading(true);
    try {
      // First, set all accounts to not default
      const { error: resetError } = await supabase
        .from('bank_accounts')
        .update({ is_default: false })
        .neq('id', '');
        
      if (resetError) throw resetError;
      
      // Then set the selected account to default
      const { error } = await supabase
        .from('bank_accounts')
        .update({ is_default: true })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Default account updated",
        description: "Your default bank account has been updated",
      });
      
      // Refresh accounts after changing default
      await refreshAccounts();
    } catch (error: any) {
      console.error('Error setting default account:', error);
      toast({
        title: "Error setting default account",
        description: error.message || "Failed to set default account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    initialAccountState,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setAccountDefault
  };
}
