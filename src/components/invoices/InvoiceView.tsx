import React, { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Invoice } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';
import { Printer, Edit, Save, X, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InvoiceEmailForm from './InvoiceEmailForm';

interface InvoiceViewProps {
  invoice: Invoice;
  onProcessPayment?: () => void;
  onUpdateInvoice?: (updatedInvoice: Invoice) => Promise<void>;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ 
  invoice, 
  onProcessPayment,
  onUpdateInvoice
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<Invoice>({...invoice});
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;
    
    document.body.innerHTML = `
      <style>
        @media print {
          body { 
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          .print-header {
            text-align: center;
            margin-bottom: 20px;
          }
          .print-section {
            margin-bottom: 15px;
          }
          .print-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          .print-footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
          }
          .status-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
            color: white;
            background-color: ${invoice.status === 'paid' ? '#10b981' : invoice.status === 'overdue' ? '#ef4444' : '#f59e0b'};
          }
          .amount {
            font-weight: bold;
            font-size: 1.1em;
          }
          @page {
            size: auto;
            margin: 20mm;
          }
        }
      </style>
      <div class="print-container">
        <div class="print-header">
          <h1>INVOICE</h1>
          <p>Invoice #${invoice.invoice_number}</p>
        </div>
        ${printContents}
      </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContents;
  };

  const handleInputChange = (field: keyof Invoice, value: any) => {
    setEditedInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (onUpdateInvoice) {
      await onUpdateInvoice(editedInvoice);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedInvoice({...invoice});
    setIsEditing(false);
  };

  const handleEmailInvoice = () => {
    setIsEmailDialogOpen(true);
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            {isEditing ? (
              <Input 
                value={editedInvoice.invoice_number} 
                onChange={(e) => handleInputChange('invoice_number', e.target.value)}
                className="max-w-[200px]"
              />
            ) : (
              <span>Invoice #{invoice.invoice_number}</span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isEditing ? (
              <div className="flex gap-2 my-2">
                <div>
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input 
                    id="issue_date"
                    type="date"
                    value={editedInvoice.issue_date}
                    onChange={(e) => handleInputChange('issue_date', e.target.value)}
                    className="max-w-[150px]"
                  />
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input 
                    id="due_date"
                    type="date"
                    value={editedInvoice.due_date}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="max-w-[150px]"
                  />
                </div>
              </div>
            ) : (
              <span>Issued: {formatDate(invoice.issue_date)}, Due: {formatDate(invoice.due_date)}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
              <Button variant="outline" size="icon" onClick={handleEmailInvoice} title="Email Invoice">
                <Mail size={16} />
              </Button>
              <Button variant="outline" size="icon" onClick={handlePrint} title="Print Invoice">
                <Printer size={16} />
              </Button>
              {onUpdateInvoice && (
                <Button variant="outline" size="icon" onClick={() => setIsEditing(true)} title="Edit Invoice">
                  <Edit size={16} />
                </Button>
              )}
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} className="mr-1" /> Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleSave}>
                <Save size={16} className="mr-1" /> Save
              </Button>
            </>
          )}
        </div>
      </div>

      <div ref={printRef} className="space-y-4 border p-4 rounded-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <p>Invoice #{invoice.invoice_number}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Bill To:</p>
            {isEditing ? (
              <Input 
                value={editedInvoice.client} 
                onChange={(e) => handleInputChange('client', e.target.value)}
              />
            ) : (
              <p className="font-semibold">{invoice.client}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Invoice Details:</p>
            <p><span className="font-medium">Date:</span> {formatDate(invoice.issue_date)}</p>
            <p><span className="font-medium">Due Date:</span> {formatDate(invoice.due_date)}</p>
          </div>
        </div>

        <div className="border-t border-b py-4 my-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Service Details:</p>
              {isEditing ? (
                <textarea 
                  className="w-full border rounded p-2"
                  value={editedInvoice.description || "Makeup Services"}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              ) : (
                <p>{invoice.description || "Makeup Services"}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Payment Status:</p>
              <p>{getPaymentMethodText(invoice.payment_method)}</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex justify-between py-2 font-bold">
            <span>TOTAL AMOUNT DUE:</span>
            {isEditing ? (
              <Input 
                type="number"
                value={editedInvoice.amount} 
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                className="max-w-[150px] text-right"
              />
            ) : (
              <span className="text-xl">₱{invoice.amount.toLocaleString()}</span>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground pt-6">
          <p>Thank you for your business!</p>
        </div>
      </div>

      {/* Payment button section */}
      {invoice.status !== 'paid' && onProcessPayment && (
        <div className="pt-4">
          <Button onClick={onProcessPayment} className="w-full">
            Process Payment
          </Button>
        </div>
      )}

      {/* Email dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Email Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceEmailForm 
            invoice={invoice} 
            onClose={() => setIsEmailDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceView;
