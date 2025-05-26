
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InvoiceStatus, PaymentMethod } from '@/integrations/supabase/client';
import { useBankAccounts } from '@/hooks/useBankAccounts';
import { Textarea } from '@/components/ui/textarea';

export interface InvoiceFormData {
  id?: string;
  invoice_number: string;
  client: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  payment_method: PaymentMethod;
  bank_account_id?: string | null;
  booking_id?: string | null;
  description?: string;
  notes?: string;
}

interface InvoiceFormProps {
  formData: InvoiceFormData;
  isLoading: boolean;
  onFormChange: (field: string, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  formData,
  isLoading,
  onFormChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  const { bankAccounts, fetchBankAccounts } = useBankAccounts();
  const [showBankSelector, setShowBankSelector] = useState(false);

  useEffect(() => {
    fetchBankAccounts();
    setShowBankSelector(formData.payment_method === 'bank');
  }, []);

  const handlePaymentMethodChange = (value: string) => {
    const method = value as PaymentMethod;
    onFormChange('payment_method', method);
    setShowBankSelector(method === 'bank');
    
    // Clear bank_account_id if not bank
    if (method !== 'bank') {
      onFormChange('bank_account_id', null);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice_number">Invoice Number</Label>
          <Input 
            id="invoice_number" 
            value={formData.invoice_number}
            onChange={(e) => onFormChange('invoice_number', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client Name</Label>
          <Input 
            id="client" 
            value={formData.client}
            onChange={(e) => onFormChange('client', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issue_date">Issue Date</Label>
          <Input 
            id="issue_date" 
            type="date" 
            value={formData.issue_date}
            onChange={(e) => onFormChange('issue_date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input 
            id="due_date" 
            type="date" 
            value={formData.due_date}
            onChange={(e) => onFormChange('due_date', e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₱)</Label>
          <Input 
            id="amount" 
            type="number" 
            value={formData.amount.toString()}
            onChange={(e) => onFormChange('amount', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status}
            onValueChange={(value) => onFormChange('status', value as InvoiceStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select 
            value={formData.payment_method}
            onValueChange={handlePaymentMethodChange}
          >
            <SelectTrigger id="payment_method">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank">Bank</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {showBankSelector && (
        <div className="space-y-2">
          <Label htmlFor="bank_account_id">Bank Account</Label>
          <Select 
            value={formData.bank_account_id || ''}
            onValueChange={(value) => onFormChange('bank_account_id', value)}
          >
            <SelectTrigger id="bank_account_id">
              <SelectValue placeholder="Select bank account" />
            </SelectTrigger>
            <SelectContent>
              {bankAccounts.map(account => (
                <SelectItem key={account.id} value={account.id}>
                  {account.bank_name} - {account.account_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onFormChange('description', e.target.value)}
          placeholder="Enter invoice description or service details"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => onFormChange('notes', e.target.value)}
          placeholder="Additional notes about this invoice"
          rows={2}
        />
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default InvoiceForm;
