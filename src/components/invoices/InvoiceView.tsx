
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Invoice } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';

interface InvoiceViewProps {
  invoice: Invoice;
  onProcessPayment: () => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, onProcessPayment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Paid in Cash';
      case 'bank':
        return 'Paid via Bank';
      default:
        return 'Unpaid';
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Invoice #{invoice.invoice_number}</h3>
          <p className="text-sm text-muted-foreground">
            Issued: {formatDate(invoice.issue_date)}, Due: {formatDate(invoice.due_date)}
          </p>
        </div>
        <Badge className={getStatusColor(invoice.status)}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Client</p>
          <p>{invoice.client}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Payment Method</p>
          <p>{getPaymentMethodText(invoice.payment_method)}</p>
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between py-2">
          <span className="font-medium">Amount:</span>
          <span className="font-bold">₱{invoice.amount.toLocaleString()}</span>
        </div>
      </div>

      {invoice.status !== 'paid' && (
        <div className="pt-4">
          <Button onClick={onProcessPayment} className="w-full">
            Process Payment
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;
