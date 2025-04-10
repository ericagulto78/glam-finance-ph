
import React from 'react';
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
import { InvoiceStatus } from '@/integrations/supabase/client';

export interface InvoiceFormData {
  id?: string;
  invoice_number: string;
  client: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
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
      <div className="grid grid-cols-2 gap-4">
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
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
