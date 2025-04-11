
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  supabase, 
  BankAccount,
  castBankAccount 
} from '@/integrations/supabase/client';

export interface BankAccountFormData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  balance: number;
  undeposited: number;
}

export function useBankAccounts() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initial bank account form state
  const initialAccountState: Omit<BankAccount, 'id' | 'created_at' | 'updated_at' | 'user_id'> = {
    type: 'checking',
    balance: 0,
    is_default: false,
    undeposited: 0,
    bank_name: '',
    account_name: '',
    account_number: ''
  };
  
  const [newAccount, setNewAccount] = useState<Omit<BankAccount, 'id' | 'created_at' | 'updated_at' | 'user_id'>>(initialAccountState);

  // Calculate total stats
  const totalStats = {
    totalBalance: bankAccounts.reduce((sum, account) => sum + account.balance, 0),
    totalUndeposited: bankAccounts.reduce((sum, account) => sum + account.undeposited, 0),
    totalCashOnHand: bankAccounts.reduce((sum, account) => sum + account.balance + account.undeposited, 0)
  };

  // Fetch bank accounts
  const fetchBankAccounts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('bank_name', { ascending: true });

      if (error) throw error;
      
      // Cast the data to ensure it matches our BankAccount type
      const typedAccounts = data?.map(account => castBankAccount(account)) || [];
      setBankAccounts(typedAccounts);
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

  // Add a new bank account
  const addBankAccount = async (formData: BankAccountFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const accountToInsert = {
        type: 'checking',
        balance: formData.balance || 0,
        is_default: formData.isDefault || false,
        undeposited: formData.undeposited || 0,
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
      
      setIsAddDialogOpen(false);
      // Immediately fetch bank accounts after adding
      await fetchBankAccounts();
      
      setNewAccount(initialAccountState);
      toast({
        title: "Bank account added",
        description: "The bank account has been successfully added",
      });
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

  // Update an existing bank account
  const updateBankAccount = async (id: string, formData: BankAccountFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .update({
          type: 'checking',
          balance: formData.balance,
          is_default: formData.isDefault,
          undeposited: formData.undeposited,
          bank_name: formData.bankName,
          account_name: formData.accountName,
          account_number: formData.accountNumber
        })
        .eq('id', id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      // Immediately fetch bank accounts after updating
      await fetchBankAccounts();
      toast({
        title: "Bank account updated",
        description: "The bank account has been successfully updated",
      });
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
      
      setIsDeleteDialogOpen(false);
      // Immediately fetch bank accounts after deleting
      await fetchBankAccounts();
      toast({
        title: "Bank account deleted",
        description: `Bank account has been deleted.`,
      });
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
      
      // Refresh accounts list
      await fetchBankAccounts();
      
      toast({
        title: "Default account updated",
        description: "Your default bank account has been updated",
      });
    } catch (error: any) {
      console.error('Error setting default account:', error);
      toast({
        title: "Error setting default account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes for new account
  const handleNewAccountChange = (field: string, value: any) => {
    setNewAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form input changes for edit account
  const handleSelectedAccountChange = (field: string, value: any) => {
    if (!selectedAccount) return;
    
    setSelectedAccount((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Filter bank accounts based on search term
  const filteredAccounts = bankAccounts.filter(account => {
    const matchesSearch = account.bank_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         account.account_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return {
    bankAccounts: filteredAccounts,
    searchTerm,
    newAccount,
    selectedAccount,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isLoading,
    totalStats,
    setSearchTerm,
    setSelectedAccount,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleNewAccountChange,
    handleSelectedAccountChange,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    fetchBankAccounts,
    setAccountDefault
  };
}
