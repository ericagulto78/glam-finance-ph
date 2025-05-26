
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, InvoicePayment, castInvoicePayment } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface InvoicePaymentHistoryProps {
  invoiceId: string;
}

const InvoicePaymentHistory: React.FC<InvoicePaymentHistoryProps> = ({ invoiceId }) => {
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [invoiceId]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoice_payments')
        .select('*')
        .eq('invoice_id', invoiceId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      const typedPayments = data?.map(payment => castInvoicePayment(payment)) || [];
      setPayments(typedPayments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading payment history...</div>;
  }

  if (payments.length === 0) {
    return <div className="text-sm text-muted-foreground">No payments recorded yet.</div>;
  }

  const getPaymentMethodBadge = (method: string) => {
    const variant = method === 'cash' ? 'secondary' : 'default';
    return <Badge variant={variant}>{method.toUpperCase()}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Payment History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">₱{payment.amount.toLocaleString()}</span>
                {getPaymentMethodBadge(payment.payment_method)}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
              </div>
              {payment.notes && (
                <div className="text-sm text-muted-foreground mt-1">
                  {payment.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InvoicePaymentHistory;
