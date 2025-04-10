
import React from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Plus, PenSquare, Trash2, CreditCard, DollarSign, Wallet } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useBankAccounts, BankAccountFormData } from '@/hooks/useBankAccounts';

const BankAccount = () => {
  const {
    bankAccounts,
    isLoading,
    isEditing,
    currentAccount,
    totalStats,
    setIsEditing,
    setCurrentAccount,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setAccountDefault
  } = useBankAccounts();

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
      bankName: account.bankName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      isDefault: account.isDefault,
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

  const handleSetDefault = (id: string) => {
    setAccountDefault(id);
  };

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
        {!isEditing && (
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
                <div className="space-y-6">
                  {bankAccounts.map((account) => (
                    <div 
                      key={account.id}
                      className={`p-4 border rounded-lg relative ${account.isDefault ? 'border-rose' : 'border-border'}`}
                    >
                      {account.isDefault && (
                        <Badge className="absolute top-2 right-2 bg-rose text-rose-foreground">
                          Default
                        </Badge>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground">Bank Information</p>
                          <p className="font-medium">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground mt-1">Account: {account.accountNumber}</p>
                          <p className="text-sm">{account.accountName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="font-medium">₱{account.balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Undeposited</p>
                          <p className="font-medium">₱{account.undeposited.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-medium">₱{(account.balance + account.undeposited).toLocaleString()}</p>
                        </div>
                        
                        <div className="flex justify-end items-start gap-2">
                          {!account.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetDefault(account.id)}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditAccount(account)}
                          >
                            <PenSquare size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BankAccount;
