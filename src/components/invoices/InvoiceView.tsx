
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Invoice } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import PartialPaymentDialog from './PartialPaymentDialog';
import InvoicePaymentHistory from './InvoicePaymentHistory';

interface InvoiceViewProps {
  invoice: Invoice;
  onProcessPayment?: () => void;
  onUpdateInvoice?: (invoice: Invoice) => void;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ 
  invoice, 
  onProcessPayment,
  onUpdateInvoice 
}) => {
  const [isPartialPaymentOpen, setIsPartialPaymentOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'secondary',
      pending: 'destructive',
      partial: 'outline',
      paid: 'default',
      overdue: 'destructive',
      cancelled: 'secondary'
    } as const;
    
    return (
      <Badge variant={statusColors[status as keyof typeof statusColors] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const remainingAmount = invoice.amount - (invoice.paid_amount || 0);
  const isFullyPaid = invoice.status === 'paid';
  const hasPartialPayment = (invoice.paid_amount || 0) > 0;

  const handlePartialPayment = async (amount: number, paymentMethod: string, bankAccountId?: string, notes?: string) => {
    setIsLoading(true);
    try {
      // This would be handled by the parent component or a custom hook
      // For now, we'll just close the dialog
      setIsPartialPaymentOpen(false);
      
      // Trigger refresh of invoice data
      if (onUpdateInvoice) {
        // This would normally re-fetch the invoice data
        onUpdateInvoice({ ...invoice, paid_amount: (invoice.paid_amount || 0) + amount });
      }
    } catch (error) {
      console.error('Error processing partial payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h2>
          <p className="text-muted-foreground">Client: {invoice.client}</p>
        </div>
        {getStatusBadge(invoice.status)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Issue Date</p>
              <p>{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Date</p>
              <p>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Amount:</span>
              <span className="text-lg font-bold">₱{invoice.amount.toLocaleString()}</span>
            </div>
            
            {hasPartialPayment && (
              <>
                <div className="flex justify-between items-center text-green-600">
                  <span>Amount Paid:</span>
                  <span className="font-medium">₱{(invoice.paid_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-orange-600">
                  <span>Remaining Balance:</span>
                  <span className="font-medium">₱{remainingAmount.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          {invoice.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="whitespace-pre-wrap">{invoice.description}</p>
              </div>
            </>
          )}

          {invoice.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Notes</p>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Actions */}
      {!isFullyPaid && (
        <div className="flex gap-2">
          {onProcessPayment && (
            <Button onClick={onProcessPayment} className="flex-1">
              Mark as Fully Paid
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => setIsPartialPaymentOpen(true)}
            className="flex-1"
          >
            Record Partial Payment
          </Button>
        </div>
      )}

      {/* Payment History */}
      {hasPartialPayment && (
        <InvoicePaymentHistory invoiceId={invoice.id} />
      )}

      {/* Partial Payment Dialog */}
      <PartialPaymentDialog
        invoice={invoice}
        isOpen={isPartialPaymentOpen}
        isLoading={isLoading}
        onOpenChange={setIsPartialPaymentOpen}
        onProcessPayment={handlePartialPayment}
      />
    </div>
  );
};

export default InvoiceView;
