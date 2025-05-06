
import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import BankAccountCard from '@/components/bank/BankAccountCard';
import BankTransactionDialog from '@/components/bank/BankTransactionDialog';
import { useBankTransactions } from '@/hooks/useBankTransactions';
import { useInvoices } from '@/hooks/useInvoices';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const BankAccounts: React.FC = () => {
  const navigate = useNavigate();
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal' | 'transfer'>('deposit');
  const { toast } = useToast();
  
  const {
    bankAccounts,
    isLoading: isAccountsLoading,
    totalStats,
    setAccountDefault,
    deleteBankAccount,
    fetchBankAccounts,
  } = useBankAccounts();

  const {
    newTransaction,
    isLoading: isTransactionLoading,
    handleNewTransactionChange,
    addTransaction
  } = useBankTransactions();

  const { invoices } = useInvoices();

  // Calculate undeposited cash from invoices
  const undepositedCash = invoices
    .filter(invoice => invoice.status === 'paid' && invoice.payment_method === 'cash')
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  // Use useCallback to prevent unnecessary re-renders
  const loadData = useCallback(async () => {
    try {
      await fetchBankAccounts();
    } catch (error: any) {
      console.error('Error loading bank accounts:', error);
      toast({
        title: "Error loading accounts",
        description: error.message || "Failed to load bank accounts",
        variant: "destructive"
      });
    }
  }, [fetchBankAccounts, toast]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddAccount = () => {
    navigate('/bank-account');
  };

  const handleTransactionClick = (accountId: string, type: 'deposit' | 'withdrawal' | 'transfer') => {
    setSelectedAccountId(accountId);
    setTransactionType(type);
    handleNewTransactionChange('type', type);
    if (type === 'deposit') {
      handleNewTransactionChange('toAccount', accountId);
      handleNewTransactionChange('fromAccount', '');
    } else if (type === 'withdrawal') {
      handleNewTransactionChange('fromAccount', accountId);
      handleNewTransactionChange('toAccount', '');
    } else {
      handleNewTransactionChange('fromAccount', accountId);
    }
    setIsTransactionDialogOpen(true);
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setAccountDefault(id);
      toast({
        title: "Default account updated",
        description: "Your default account has been set successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error setting default",
        description: error.message || "Failed to set default account",
        variant: "destructive"
      });
    }
  };

  const handleEditAccount = (accountId: string) => {
    navigate(`/bank-account?id=${accountId}`);
  };

  const handleSubmitTransaction = async () => {
    try {
      const result = await addTransaction();
      if (result.success) {
        setIsTransactionDialogOpen(false);
        // Reload data after transaction
        await loadData();
        toast({
          title: "Transaction successful",
          description: "Your transaction has been processed"
        });
      }
    } catch (error: any) {
      toast({
        title: "Transaction failed",
        description: error.message || "An error occurred processing your transaction",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full">
      <PageHeader 
        title="Bank Accounts" 
        subtitle="Manage your banking and track balances"
        action={{
          label: "Add Account",
          onClick: handleAddAccount,
          icon: <Plus size={16} />,
        }}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-1">Total Balance</h3>
            <p className="text-2xl font-bold">₱{totalStats.totalBalance.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">In bank accounts</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-1">Undeposited Cash</h3>
            <p className="text-2xl font-bold">₱{undepositedCash.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">From cash payments</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-1">Total Cash on Hand</h3>
            <p className="text-2xl font-bold">₱{(totalStats.totalBalance + undepositedCash).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">All available funds</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isAccountsLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="h-40"></CardContent>
              </Card>
            ))
          ) : bankAccounts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No bank accounts found</h3>
              <Button onClick={handleAddAccount} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add your first bank account
              </Button>
            </div>
          ) : (
            bankAccounts.map((account) => (
              <BankAccountCard
                key={account.id}
                account={account}
                onEdit={() => handleEditAccount(account.id)}
                onDelete={async () => {
                  try {
                    await deleteBankAccount(account.id);
                    loadData(); // Refresh after deletion
                  } catch (error: any) {
                    toast({
                      title: "Delete failed",
                      description: error.message || "Failed to delete account",
                      variant: "destructive"
                    });
                  }
                }}
                onSetDefault={() => handleSetDefault(account.id)}
                onDeposit={(id) => handleTransactionClick(id, 'deposit')}
                onWithdraw={(id) => handleTransactionClick(id, 'withdrawal')}
                onTransfer={(id) => handleTransactionClick(id, 'transfer')}
              />
            ))
          )}
        </div>
      </div>

      {/* Transaction Dialog */}
      <BankTransactionDialog
        isOpen={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        isLoading={isTransactionLoading}
        formData={newTransaction}
        onFormChange={handleNewTransactionChange}
        onSubmit={handleSubmitTransaction}
      />
    </div>
  );
};

export default BankAccounts;
