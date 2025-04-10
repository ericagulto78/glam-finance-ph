
import React, { forwardRef } from 'react';
import { Invoice } from '@/integrations/supabase/client';
import { 
  Printer, 
  Download, 
  Share2, 
  User, 
  Calendar, 
  DollarSign 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface InvoiceViewProps {
  invoice: Invoice;
  onClose: () => void;
}

const statusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-blue-100 text-blue-800",
  overdue: "bg-red-100 text-red-800",
};

// Using forwardRef to allow for printing functionality
const InvoiceView = forwardRef<HTMLDivElement, InvoiceViewProps>(
  ({ invoice, onClose }, ref) => {
    return (
      <div className="max-w-3xl mx-auto" ref={ref}>
        <Card className="border shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Invoice #{invoice.invoice_number}</CardTitle>
                <CardDescription>
                  <Badge className={statusColors[invoice.status]}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-xl">YOUR BUSINESS NAME</h3>
                <p className="text-muted-foreground">123 Business Address</p>
                <p className="text-muted-foreground">City, State ZIP</p>
                <p className="text-muted-foreground">contact@yourbusiness.com</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-muted-foreground text-sm mb-1">Bill To:</h3>
                <div className="flex items-center gap-2 mb-1">
                  <User size={16} className="text-muted-foreground" />
                  <p className="font-medium">{invoice.client}</p>
                </div>
                {/* You could add client address here if available */}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Issue Date:</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>{new Date(invoice.issue_date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Due Date:</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Invoice #:</span>
                  <span>{invoice.invoice_number}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold mb-4">Invoice Summary</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-3 border-t">Services provided to {invoice.client}</td>
                      <td className="px-4 py-3 border-t text-right">₱{invoice.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-muted/50">
                    <tr>
                      <td className="px-4 py-3 font-semibold">Total</td>
                      <td className="px-4 py-3 font-semibold text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign size={14} />
                          <span>₱{invoice.amount.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <p className="text-sm">Please make payment to: [Your Bank Account Details]</p>
              <p className="text-sm mt-2">Payment Terms: Due within 30 days of issue date.</p>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>Thank you for your business!</p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 size={14} className="mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download size={14} className="mr-1" />
                Download
              </Button>
              <Button size="sm" onClick={() => window.print()}>
                <Printer size={14} className="mr-1" />
                Print
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
);

InvoiceView.displayName = 'InvoiceView';

export default InvoiceView;
