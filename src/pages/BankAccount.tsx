
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Plus, 
  CreditCard, 
  DollarSign, 
  Wallet,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useBankAccounts, BankAccountFormData } from '@/hooks/useBankAccounts';
import { useBankTransactions } from '@/hooks/useBankTransactions';
import BankTransactionDialog from '@/components/bank/BankTransactionDialog';
import BankAccountCard from '@/components/bank/BankAccountCard';

const BankAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<any>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const accountId = queryParams.get('id');
  
  const {
    bankAccounts,
    isLoading,
    totalStats,
    setAccountDefault,
    deleteBankAccount,
    fetchBankAccounts,
    addBankAccount,
    updateBankAccount
  } = useBankAccounts();

  const {
    transactions,
    newTransaction,
    isAddDialogOpen: isTransactionDialogOpen,
    isLoading: isTransactionLoading,
    setIsAddDialogOpen: setIsTransactionDialogOpen,
    handleNewTransactionChange,
    addTransaction,
    fetchTransactions
  } = useBankTransactions(accountId || undefined);

  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal' | 'transfer'>('deposit');

  useEffect(() => {
    if (accountId) {
      // Load the specific account if ID is provided
      const account = bankAccounts.find(acc => acc.id === accountId);
      if (account) {
        setCurrentAccount(account);
        setIsEditing(true);
        form.reset({
          bankName: account.bank_name,
          accountName: account.account_name,
          accountNumber: account.account_number,
          isDefault: account.is_default,
          balance: account.balance,
          undeposited: account.undeposited
        });
      }
    }
  }, [bankAccounts, accountId]);

  const form = useForm<BankAccountFormData>({
    defaultValues: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      isDefault: false,
      balance: 0,
      undeposited: 0
    }
  });

  const handleAddAccount = () => {
    setIsEditing(true);
    setCurrentAccount(null);
    form.reset({
      bankName: '',
      accountName: '',
      accountNumber: '',
      isDefault: false,
      balance: 0,
      undeposited: 0
    });
  };

  const handleEditAccount = (account: any) => {
    setIsEditing(true);
    setCurrentAccount(account);
    form.reset({
      bankName: account.bank_name,
      accountName: account.account_name,
      accountNumber: account.account_number,
      isDefault: account.is_default,
      balance: account.balance,
      undeposited: account.undeposited
    });
  };

  const handleDeleteAccount = (id: string) => {
    deleteBankAccount(id);
  };

  const handleSubmit = (data: BankAccountFormData) => {
    if (currentAccount) {
      // Editing existing account
      updateBankAccount(currentAccount.id, data);
    } else {
      // Adding new account
      addBankAccount(data);
    }
    
    setIsEditing(false);
    setCurrentAccount(null);
    form.reset();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentAccount(null);
    form.reset();
  };

  const handleNewTransaction = (type: 'deposit' | 'withdrawal' | 'transfer') => {
    setTransactionType(type);
    handleNewTransactionChange('type', type);
    setIsTransactionDialogOpen(true);
  };

  const handleSetDefault = (id: string) => {
    setAccountDefault(id);
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="h-full">
      <PageHeader 
        title="Bank Accounts" 
        subtitle="Manage your bank accounts for payments"
        action={!isEditing ? {
          label: "Add Account",
          onClick: handleAddAccount,
          icon: <Plus size={16} />,
        } : undefined}
      />

      <div className="p-6">
        {/* Financial summary */}
        {!isEditing && totalStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bank Balance</p>
                    <h3 className="text-2xl font-bold mt-1">₱{totalStats.totalBalance.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-blue-50 text-blue-500">
                    <CreditCard size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Undeposited Funds</p>
                    <h3 className="text-2xl font-bold mt-1">₱{totalStats.totalUndeposited.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-yellow-50 text-yellow-500">
                    <DollarSign size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Cash on Hand</p>
                    <h3 className="text-2xl font-bold mt-1">₱{totalStats.totalCashOnHand.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-green-50 text-green-500">
                    <Wallet size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Transaction buttons */}
        {!isEditing && bankAccounts.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            <Button 
              variant="outline" 
              onClick={() => handleNewTransaction('deposit')}
              className="flex items-center"
            >
              <ArrowDownLeft size={16} className="mr-2 text-green-500" />
              Deposit Money
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleNewTransaction('withdrawal')}
              className="flex items-center"
            >
              <ArrowUpRight size={16} className="mr-2 text-red-500" />
              Withdraw Money
            </Button>
            {bankAccounts.length >= 2 && (
              <Button 
                variant="outline" 
                onClick={() => handleNewTransaction('transfer')}
                className="flex items-center"
              >
                <ArrowRightLeft size={16} className="mr-2 text-blue-500" />
                Transfer Funds
              </Button>
            )}
          </div>
        )}

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>{currentAccount ? 'Edit Bank Account' : 'Add Bank Account'}</CardTitle>
              <CardDescription>
                {currentAccount ? 'Update your bank account information' : 'Add a new bank account for receiving payments'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g., BDO, BPI, UnionBank"
                      {...form.register('bankName', { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                      id="accountName"
                      placeholder="Name on the account"
                      {...form.register('accountName', { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Your account number"
                      {...form.register('accountNumber', { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="balance">Current Balance (₱)</Label>
                    <Input
                      id="balance"
                      type="number"
                      placeholder="Current balance"
                      {...form.register('balance', { 
                        required: true,
                        valueAsNumber: true
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="undeposited">Undeposited Amount (₱)</Label>
                    <Input
                      id="undeposited"
                      type="number"
                      placeholder="Undeposited funds"
                      {...form.register('undeposited', { 
                        required: true,
                        valueAsNumber: true
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center pt-8">
                    <input
                      type="checkbox"
                      id="isDefault"
                      className="h-4 w-4 rounded border-gray-300 text-rose focus:ring-rose"
                      {...form.register('isDefault')}
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                      Set as default account
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {currentAccount ? 'Update Account' : 'Add Account'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Bank Accounts</CardTitle>
                <CardDescription>
                  Manage your bank accounts for receiving payments from clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bankAccounts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't added any bank accounts yet</p>
                    <Button onClick={handleAddAccount}>
                      <Plus size={16} className="mr-2" />
                      Add Bank Account
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {bankAccounts.map((account) => (
                      <BankAccountCard
                        key={account.id}
                        account={account}
                        onEdit={handleEditAccount}
                        onDelete={handleDeleteAccount}
                        onSetDefault={handleSetDefault}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {bankAccounts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest account transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                              ${transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 
                                transaction.type === 'withdrawal' ? 'bg-red-100 text-red-600' : 
                                'bg-blue-100 text-blue-600'}`}>
                              {transaction.type === 'deposit' ? (
                                <ArrowDownLeft size={16} />
                              ) : transaction.type === 'withdrawal' ? (
                                <ArrowUpRight size={16} />
                              ) : (
                                <ArrowRightLeft size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">{transaction.date}</p>
                            </div>
                          </div>
                          <div className={`font-medium ${
                            transaction.type === 'deposit' ? 'text-green-600' : 
                            transaction.type === 'withdrawal' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : 
                             transaction.type === 'withdrawal' ? '-' : ''}
                            ₱{transaction.amount.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Transaction Dialog */}
        <BankTransactionDialog
          isOpen={isTransactionDialogOpen}
          isLoading={isTransactionLoading}
          formData={newTransaction}
          onOpenChange={setIsTransactionDialogOpen}
          onFormChange={handleNewTransactionChange}
          onSubmit={addTransaction}
        />
      </div>
    </div>
  );
};

export default BankAccount;
