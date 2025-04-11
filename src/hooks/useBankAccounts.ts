import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  supabase, 
  BankAccount,
  castBankAccount 
} from '@/integrations/supabase/client';

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
    name: '',
    type: 'checking',
    balance: 0,
    is_default: false,
    undeposited: 0,
    bank_name: '',
    account_name: '',
    account_number: ''
  };
  
  const [newAccount, setNewAccount] = useState<Omit<BankAccount, 'id' | 'created_at' | 'updated_at' | 'user_id'>>(initialAccountState);

  // Fetch bank accounts
  const fetchBankAccounts = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('name', { ascending: true });

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
  const addBankAccount = async () => {
    if (!user) return;
    
    if (!newAccount.name || !newAccount.type || !newAccount.bank_name || !newAccount.account_name || !newAccount.account_number) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const accountToInsert = {
        name: newAccount.name,
        type: newAccount.type,
        balance: newAccount.balance || 0,
        is_default: newAccount.is_default || false,
        undeposited: newAccount.undeposited || 0,
        bank_name: newAccount.bank_name,
        account_name: newAccount.account_name,
        account_number: newAccount.account_number,
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
  const updateBankAccount = async () => {
    if (!selectedAccount || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .update({
          name: selectedAccount.name,
          type: selectedAccount.type,
          balance: selectedAccount.balance,
          is_default: selectedAccount.is_default,
          undeposited: selectedAccount.undeposited,
          bank_name: selectedAccount.bank_name,
          account_name: selectedAccount.account_name,
          account_number: selectedAccount.account_number
        })
        .eq('id', selectedAccount.id);

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
  const deleteBankAccount = async () => {
    if (!selectedAccount || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', selectedAccount.id);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      // Immediately fetch bank accounts after deleting
      await fetchBankAccounts();
      toast({
        title: "Bank account deleted",
        description: `Bank account ${selectedAccount.name} has been deleted.`,
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
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         account.bank_name.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    fetchBankAccounts
  };
}
