
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionType } from '@/integrations/supabase/client';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { TransactionFormData } from '@/hooks/useBankTransactions';
import { useToast } from '@/hooks/use-toast';

interface BankTransactionDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  formData: TransactionFormData;
  onOpenChange: (open: boolean) => void;
  onFormChange: (field: string, value: any) => void;
  onSubmit: () => void;
}

const BankTransactionDialog: React.FC<BankTransactionDialogProps> = ({
  isOpen,
  isLoading,
  formData,
  onOpenChange,
  onFormChange,
  onSubmit,
}) => {
  const { bankAccounts, isLoading: isAccountsLoading } = useBankAccounts();
  const { toast } = useToast();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

  useEffect(() => {
    // Validate form data
    const checkFormValidity = () => {
      const { amount, type, description, fromAccount, toAccount } = formData;
      
      if (amount <= 0) return true;
      if (!description.trim()) return true;
      
      if (type === 'deposit' && !toAccount) return true;
      if (type === 'withdrawal' && !fromAccount) return true;
      if (type === 'transfer' && (!fromAccount || !toAccount || fromAccount === toAccount)) return true;

      return false;
    };

    setIsSubmitDisabled(checkFormValidity());
  }, [formData]);

  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (error: any) {
      console.error('Transaction submission error:', error);
      toast({
        title: "Transaction failed",
        description: error.message || "An error occurred processing the transaction",
        variant: "destructive",
      });
    }
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'Deposit Money';
      case 'withdrawal':
        return 'Withdraw Money';
      case 'transfer':
        return 'Transfer Between Accounts';
      default:
        return 'Transaction';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTransactionTypeLabel(formData.type)}</DialogTitle>
          <DialogDescription>
            Enter the transaction details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select 
              value={formData.type}
              onValueChange={(value) => onFormChange('type', value as TransactionType)}
              disabled={isLoading}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={(e) => onFormChange('date', e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₱)</Label>
              <Input 
                id="amount" 
                type="number" 
                value={formData.amount}
                onChange={(e) => onFormChange('amount', Number(e.target.value) || 0)}
                disabled={isLoading}
                min={0}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              placeholder="Enter transaction details..."
              rows={2}
              disabled={isLoading}
            />
          </div>
          
          {(formData.type === 'withdrawal' || formData.type === 'transfer') && (
            <div className="space-y-2">
              <Label htmlFor="fromAccount">From Account</Label>
              <Select 
                value={formData.fromAccount || ''}
                onValueChange={(value) => onFormChange('fromAccount', value)}
                disabled={isLoading || isAccountsLoading}
              >
                <SelectTrigger id="fromAccount">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bank_name} - {account.account_name} (₱{account.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {(formData.type === 'deposit' || formData.type === 'transfer') && (
            <div className="space-y-2">
              <Label htmlFor="toAccount">To Account</Label>
              <Select 
                value={formData.toAccount || ''}
                onValueChange={(value) => onFormChange('toAccount', value)}
                disabled={isLoading || isAccountsLoading}
              >
                <SelectTrigger id="toAccount">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bank_name} - {account.account_name} (₱{account.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || isSubmitDisabled}
          >
            {isLoading ? 'Processing...' : 'Process Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankTransactionDialog;
