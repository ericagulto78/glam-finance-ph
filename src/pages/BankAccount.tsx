
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { useToast } from '@/components/ui/use-toast';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, PenSquare, Trash2, CreditCard, DollarSign, Wallet } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  isDefault: boolean;
  balance: number;
  undeposited: number;
}

// Initial sample data
const BANK_ACCOUNTS_DATA: BankAccount[] = [
  {
    id: '1',
    bankName: 'BDO',
    accountName: 'Camille Ramos',
    accountNumber: '1234567890',
    isDefault: true,
    balance: 25000,
    undeposited: 3000
  },
  {
    id: '2',
    bankName: 'BPI',
    accountName: 'Camille Ramos',
    accountNumber: '0987654321',
    isDefault: false,
    balance: 12500,
    undeposited: 0
  }
];

const BankAccount = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(BANK_ACCOUNTS_DATA);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<BankAccount | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [totalStats, setTotalStats] = useState({
    totalBalance: 0,
    totalUndeposited: 0,
    totalCashOnHand: 0
  });

  const form = useForm({
    defaultValues: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      isDefault: false,
      balance: 0,
      undeposited: 0
    }
  });

  useEffect(() => {
    // Calculate total stats
    const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
    const totalUndeposited = bankAccounts.reduce((sum, account) => sum + account.undeposited, 0);
    const totalCashOnHand = totalBalance + totalUndeposited;
    
    setTotalStats({
      totalBalance,
      totalUndeposited,
      totalCashOnHand
    });
  }, [bankAccounts]);

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

  const handleEditAccount = (account: BankAccount) => {
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
    setBankAccounts(prev => prev.filter(account => account.id !== id));
    toast({
      title: "Account deleted",
      description: "Bank account has been removed successfully.",
    });
  };

  const handleSubmit = (data: any) => {
    if (currentAccount) {
      // Editing existing account
      const updatedAccounts = bankAccounts.map(account => {
        if (account.id === currentAccount.id) {
          return {
            ...account,
            ...data
          };
        }
        
        // If the current account is set as default, make others not default
        if (data.isDefault && account.id !== currentAccount.id) {
          return {
            ...account,
            isDefault: false
          };
        }
        
        return account;
      });
      
      setBankAccounts(updatedAccounts);
      toast({
        title: "Account updated",
        description: "Bank account details have been updated successfully.",
      });
    } else {
      // Adding new account
      const newAccount: BankAccount = {
        id: Math.random().toString(36).substring(2, 9),
        ...data
      };
      
      // If the new account is set as default, make others not default
      if (data.isDefault) {
        setBankAccounts(prev => prev.map(account => ({
          ...account,
          isDefault: false
        })));
      }
      
      setBankAccounts(prev => [...prev, newAccount]);
      toast({
        title: "Account added",
        description: "New bank account has been added successfully.",
      });
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
    setBankAccounts(prev => prev.map(account => ({
      ...account,
      isDefault: account.id === id
    })));
    
    toast({
      title: "Default account updated",
      description: "Your default bank account has been updated.",
    });
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
                  <Button type="submit">
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
