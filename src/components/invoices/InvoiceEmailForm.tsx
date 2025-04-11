
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { Invoice } from '@/integrations/supabase/client';
import { useBankAccounts } from '@/hooks/useBankAccounts';

interface InvoiceEmailFormProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoiceEmailForm: React.FC<InvoiceEmailFormProps> = ({ invoice, onClose }) => {
  const { bankAccounts } = useBankAccounts();
  const defaultBank = bankAccounts.find(account => account.is_default) || bankAccounts[0];
  
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState(`Invoice #${invoice.invoice_number}`);
  const [message, setMessage] = useState(`Dear ${invoice.client},\n\nPlease find attached your invoice #${invoice.invoice_number} for the amount of ₱${invoice.amount.toLocaleString()}.\n\nPayment is due by ${new Date(invoice.due_date).toLocaleDateString()}.\n\nPayment Methods:\n${defaultBank ? `Bank Transfer:\nBank: ${defaultBank.bank_name}\nAccount Name: ${defaultBank.account_name}\nAccount Number: ${defaultBank.account_number}\n` : ''}Cash Payment\n\nThank you for your business.\n\nBest regards,`);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipient,
          subject,
          message,
          invoice
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending the email');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient Email</Label>
        <Input
          id="recipient"
          type="email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="client@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={10}
          required
        />
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
          Email sent successfully!
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Invoice
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceEmailForm;
