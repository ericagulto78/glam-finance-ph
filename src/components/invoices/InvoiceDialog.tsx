
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Invoice, Booking, InvoiceStatus, PaymentMethod } from '@/integrations/supabase/client';
import { formatDate } from '@/lib/utils';

interface InvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'> | Invoice) => void;
  bookings: Booking[];
  initialData?: Invoice;
  title: string;
  buttonText: string;
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bookings,
  initialData,
  title,
  buttonText,
}) => {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoice_number: '',
    client: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    amount: 0,
    status: 'pending',
    payment_method: 'unpaid',
    booking_id: null,
    notes: '',
  });

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSelectedBookingId(initialData.booking_id || null);
    } else {
      // Generate invoice number for new invoices
      const date = new Date();
      const year = date.getFullYear().toString().slice(2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      
      setFormData({
        invoice_number: `INV-${year}${month}-${random}`,
        client: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
        amount: 0,
        status: 'pending',
        payment_method: 'unpaid',
        booking_id: null,
        notes: '',
      });
      setSelectedBookingId(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Invoice, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBookingChange = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    
    const selectedBooking = bookings.find((booking) => booking.id === bookingId);
    if (selectedBooking) {
      setFormData((prev) => ({
        ...prev,
        client: selectedBooking.client,
        amount: selectedBooking.amount,
        booking_id: selectedBooking.id,
        notes: `Booking for ${selectedBooking.service} on ${formatDate(selectedBooking.date)}`,
      }));
    }
  };

  const handleSubmit = () => {
    if (!formData.invoice_number || !formData.client || !formData.issue_date || !formData.due_date) {
      return; // Form validation failed
    }

    onSubmit(formData as any);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter the invoice details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {!initialData && (
            <div className="grid gap-2">
              <Label htmlFor="booking">Create from Booking (Optional)</Label>
              <Select
                value={selectedBookingId || ""}
                onValueChange={handleBookingChange}
              >
                <SelectTrigger id="booking">
                  <SelectValue placeholder="Select a booking" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {bookings.map((booking) => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.client} - {booking.service} ({formatDate(booking.date)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="invoice_number">Invoice Number</Label>
              <Input
                id="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => handleChange('invoice_number', e.target.value)}
                disabled={initialData !== undefined}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleChange('client', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => handleChange('issue_date', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₱)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value as InvoiceStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add any additional notes or details about this invoice"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialog;
