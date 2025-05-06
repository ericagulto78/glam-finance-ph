
import { useState } from 'react';
import { BankAccount } from '@/integrations/supabase/client';

export function useBankAccountsState() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Omit<BankAccount, 'id' | 'created_at' | 'updated_at' | 'user_id'>>({
    type: 'bank',
    balance: 0,
    is_default: false,
    undeposited: 0,
    bank_name: '',
    account_name: '',
    account_number: ''
  });

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

  // Filter function to apply search term
  const filterAccounts = (accounts: BankAccount[], term: string) => {
    if (!term) return accounts;
    
    return accounts.filter(account => {
      const matchesSearch = 
        account.bank_name.toLowerCase().includes(term.toLowerCase()) || 
        account.account_name.toLowerCase().includes(term.toLowerCase()) ||
        account.account_number.toLowerCase().includes(term.toLowerCase());
      
      return matchesSearch;
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedAccount,
    setSelectedAccount,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    newAccount,
    setNewAccount,
    handleNewAccountChange,
    handleSelectedAccountChange,
    filterAccounts
  };
}
