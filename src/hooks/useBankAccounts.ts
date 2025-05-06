
import { useBankAccountsCore } from './useBankAccountsCore';
import { useBankAccountActions } from './useBankAccountActions';
import { useBankAccountsState } from './useBankAccountsState';

export { useBankAccountActions, BankAccountFormData } from './useBankAccountActions';

export function useBankAccounts() {
  const core = useBankAccountsCore();
  const state = useBankAccountsState();
  const actions = useBankAccountActions(core.fetchBankAccounts);
  
  // Apply filtering to accounts
  const filteredAccounts = state.filterAccounts(core.bankAccounts, state.searchTerm);

  return {
    // Core data and operations
    bankAccounts: filteredAccounts,
    isLoading: core.isLoading || actions.isLoading,
    totalStats: core.totalStats,
    fetchBankAccounts: core.fetchBankAccounts,
    
    // State management
    searchTerm: state.searchTerm,
    selectedAccount: state.selectedAccount,
    newAccount: state.newAccount,
    isAddDialogOpen: state.isAddDialogOpen,
    isEditDialogOpen: state.isEditDialogOpen,
    isDeleteDialogOpen: state.isDeleteDialogOpen,
    
    // State setters
    setSearchTerm: state.setSearchTerm,
    setSelectedAccount: state.setSelectedAccount,
    setNewAccount: state.setNewAccount,
    setIsAddDialogOpen: state.setIsAddDialogOpen,
    setIsEditDialogOpen: state.setIsEditDialogOpen,
    setIsDeleteDialogOpen: state.setIsDeleteDialogOpen,
    
    // Event handlers
    handleNewAccountChange: state.handleNewAccountChange,
    handleSelectedAccountChange: state.handleSelectedAccountChange,
    
    // CRUD operations
    addBankAccount: actions.addBankAccount,
    updateBankAccount: actions.updateBankAccount,
    deleteBankAccount: actions.deleteBankAccount,
    setAccountDefault: actions.setAccountDefault
  };
}
