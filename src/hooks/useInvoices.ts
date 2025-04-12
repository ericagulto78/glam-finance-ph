
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  supabase, 
  Invoice, 
  InvoiceStatus,
  PaymentMethod,
  Booking,
  castInvoice 
} from '@/integrations/supabase/client';

export interface InvoiceFormData {
  id?: string;
  invoice_number: string;
  client: string;
  email: string;
  issue_date: string;
  due_date: string;
  amount: number;
  status: InvoiceStatus;
  payment_method: PaymentMethod;
  bank_account_id: string | null;
  booking_id: string | null;
  notes: string;
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initial invoice form state
  const initialInvoiceState: InvoiceFormData = {
    invoice_number: '',
    client: '',
    email: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: 'draft',
    payment_method: 'unpaid',
    bank_account_id: null,
    booking_id: null,
    notes: ''
  };
  
  const [newInvoice, setNewInvoice] = useState<InvoiceFormData>(initialInvoiceState);

  // Fetch invoices
  const fetchInvoices = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure it matches our Invoice type
      const typedInvoices = data?.map(invoice => castInvoice(invoice)) || [];
      setInvoices(typedInvoices);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error fetching invoices",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  // Add a new invoice
  const addInvoice = async () => {
    if (!user) return;
    
    if (!newInvoice.invoice_number || !newInvoice.client || !newInvoice.issue_date || !newInvoice.due_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const invoiceToInsert = {
        invoice_number: newInvoice.invoice_number,
        client: newInvoice.client,
        email: newInvoice.email,
        issue_date: newInvoice.issue_date,
        due_date: newInvoice.due_date,
        amount: newInvoice.amount,
        status: newInvoice.status,
        payment_method: newInvoice.payment_method,
        bank_account_id: newInvoice.bank_account_id,
        booking_id: newInvoice.booking_id,
        notes: newInvoice.notes,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceToInsert])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      // Immediately fetch invoices after adding
      await fetchInvoices();
      
      setNewInvoice(initialInvoiceState);
      toast({
        title: "Invoice added",
        description: "The invoice has been successfully added",
      });
    } catch (error: any) {
      console.error('Error adding invoice:', error);
      toast({
        title: "Error adding invoice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing invoice
  const updateInvoice = async () => {
    if (!selectedInvoice || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          invoice_number: selectedInvoice.invoice_number,
          client: selectedInvoice.client,
          email: selectedInvoice.email,
          issue_date: selectedInvoice.issue_date,
          due_date: selectedInvoice.due_date,
          amount: selectedInvoice.amount,
          status: selectedInvoice.status,
          payment_method: selectedInvoice.payment_method,
          bank_account_id: selectedInvoice.bank_account_id,
          booking_id: selectedInvoice.booking_id,
          notes: selectedInvoice.notes
        })
        .eq('id', selectedInvoice.id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      // Immediately fetch invoices after updating
      await fetchInvoices();
      toast({
        title: "Invoice updated",
        description: "The invoice has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Error updating invoice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an invoice
  const deleteInvoice = async () => {
    if (!selectedInvoice || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', selectedInvoice.id);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      // Immediately fetch invoices after deleting
      await fetchInvoices();
      toast({
        title: "Invoice deleted",
        description: `Invoice for ${selectedInvoice.client} has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      toast({
        title: "Error deleting invoice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes for new invoice
  const handleNewInvoiceChange = (field: string, value: any) => {
    setNewInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form input changes for edit invoice
  const handleSelectedInvoiceChange = (field: string, value: any) => {
    if (!selectedInvoice) return;
    
    setSelectedInvoice((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Create an invoice for a booking
  const addBookingInvoice = async (booking: Booking) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const invoiceToInsert = {
        invoice_number: `INV-${Date.now()}`,
        client: booking.client,
        email: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        amount: booking.amount,
        status: 'pending',
        payment_method: 'unpaid',
        bank_account_id: null,
        booking_id: booking.id,
        notes: `Invoice for ${booking.service} service on ${booking.date} at ${booking.time}`,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('invoices')
        .insert([invoiceToInsert]);

      if (error) throw error;
      
      // Immediately fetch invoices after adding
      await fetchInvoices();
      toast({
        title: "Invoice created",
        description: `Invoice created for booking ${booking.id}`,
      });
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error creating invoice",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Record a payment for an invoice and update bank account balance
  const recordPayment = async (invoiceId: string, paymentMethod: PaymentMethod, bankAccountId?: string) => {
    setIsLoading(true);
    try {
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();
        
      if (invoiceError) throw invoiceError;

      // Update the invoice status and payment method
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid', 
          payment_method: paymentMethod,
          bank_account_id: paymentMethod === 'bank' ? bankAccountId : null
        })
        .eq('id', invoiceId);
        
      if (updateError) throw updateError;

      // If paid to a bank account, update the balance
      if (paymentMethod === 'bank' && bankAccountId) {
        const { error: balanceError } = await supabase
          .rpc('increment_balance', { 
            row_id: bankAccountId, 
            amount_to_add: invoice.amount 
          });
          
        if (balanceError) throw balanceError;
      }
      
      // Fetch the updated invoices
      await fetchInvoices();
      
      toast({
        title: "Payment recorded",
        description: `Payment of ₱${invoice.amount.toLocaleString()} has been recorded`,
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Error recording payment:', error);
      toast({
        title: "Error recording payment",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invoices: filteredInvoices,
    searchTerm,
    statusFilter,
    newInvoice,
    selectedInvoice,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isPaymentDialogOpen,
    isLoading,
    setSearchTerm,
    setStatusFilter,
    setSelectedInvoice,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsPaymentDialogOpen,
    handleNewInvoiceChange,
    handleSelectedInvoiceChange,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addBookingInvoice,
    recordPayment,
    fetchInvoices
  };
}
