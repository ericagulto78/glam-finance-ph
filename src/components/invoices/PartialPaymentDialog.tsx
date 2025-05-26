
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface PartialPaymentDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  isLoading: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessPayment: (amount: number, paymentMethod: PaymentMethod, bankAccountId?: string, notes?: string) => Promise<void>;
}

const PartialPaymentDialog: React.FC<PartialPaymentDialogProps> = ({
  invoice,
  isOpen,
  isLoading,
  onOpenChange,
  onProcessPayment,
}) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank');
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const { bankAccounts, fetchBankAccounts } = useBankAccounts();

  useEffect(() => {
    if (isOpen && invoice) {
      fetchBankAccounts();
      // Set default payment amount to remaining balance
      const remainingAmount = invoice.amount - (invoice.paid_amount || 0);
      setPaymentAmount(remainingAmount);
      setNotes('');
      
      // Default to the first bank account if available
      if (bankAccounts.length > 0) {
        const defaultAccount = bankAccounts.find(account => account.is_default);
        setSelectedBankId(defaultAccount ? defaultAccount.id : bankAccounts[0].id);
      }
    }
  }, [isOpen, invoice, bankAccounts]);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value as PaymentMethod);
  };

  const handleProcessPayment = async () => {
    if (!invoice || paymentAmount <= 0) return;
    
    if (paymentMethod === 'bank' && !selectedBankId) {
      return; // Can't process without a selected bank
    }
    
    await onProcessPayment(
      paymentAmount, 
      paymentMethod, 
      paymentMethod === 'bank' ? selectedBankId : undefined,
      notes
    );
    
    // Reset form
    setPaymentAmount(0);
    setNotes('');
  };

  if (!invoice) return null;

  const remainingAmount = invoice.amount - (invoice.paid_amount || 0);
  const maxPayment = remainingAmount;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Record Partial Payment</DialogTitle>
          <DialogDescription>
            Invoice #{invoice.invoice_number} - Total: ₱{invoice.amount.toLocaleString()}
            <br />
            Paid: ₱{(invoice.paid_amount || 0).toLocaleString()} | Remaining: ₱{remainingAmount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Payment Amount (₱)</Label>
            <Input
              id="amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              max={maxPayment}
              min={0}
              step="0.01"
            />
            <p className="text-sm text-muted-foreground">
              Maximum: ₱{maxPayment.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={handlePaymentMethodChange}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="cursor-pointer">Cash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="cursor-pointer">Bank Deposit</Label>
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
                      {account.bank_name} - {account.account_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this payment..."
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleProcessPayment}
            disabled={isLoading || paymentAmount <= 0 || paymentAmount > maxPayment || (paymentMethod === 'bank' && !selectedBankId)}
          >
            {isLoading ? 'Processing...' : `Record Payment - ₱${paymentAmount.toLocaleString()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartialPaymentDialog;
