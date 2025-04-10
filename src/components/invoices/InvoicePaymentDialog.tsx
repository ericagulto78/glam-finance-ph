
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { Invoice, PaymentMethod } from '@/integrations/supabase/client';
import { useBankAccounts } from '@/hooks/useBankAccounts';

interface InvoicePaymentDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessPayment: (paymentMethod: PaymentMethod, bankAccountId?: string) => Promise<void>;
}

const InvoicePaymentDialog: React.FC<InvoicePaymentDialogProps> = ({
  invoice,
  isOpen,
  isLoading,
  onOpenChange,
  onProcessPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const { bankAccounts, fetchBankAccounts } = useBankAccounts();

  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
      // Default to the first bank account if available
      if (bankAccounts.length > 0) {
        const defaultAccount = bankAccounts.find(account => account.isDefault);
        setSelectedBankId(defaultAccount ? defaultAccount.id : bankAccounts[0].id);
      }
    }
  }, [isOpen]);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const handleProcessPayment = () => {
    if (paymentMethod === 'bank' && !selectedBankId) {
      return; // Can't process without a selected bank
    }
    onProcessPayment(paymentMethod, paymentMethod === 'bank' ? selectedBankId : undefined);
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Record payment for Invoice #{invoice.invoice_number} - ₱{invoice.amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={handlePaymentMethodChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="cursor-pointer">Cash (adds to undeposited funds)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="cursor-pointer">Bank Deposit (select account below)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {paymentMethod === 'bank' && (
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Deposit to Bank Account</Label>
              <Select 
                value={selectedBankId}
                onValueChange={setSelectedBankId}
              >
                <SelectTrigger id="bankAccount">
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.bankName} - {account.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcessPayment}
            disabled={isLoading || (paymentMethod === 'bank' && !selectedBankId)}
          >
            {isLoading ? 'Processing...' : 'Process Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePaymentDialog;
