
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  supabase, 
  Invoice, 
  InvoiceStatus,
  Booking,
  PaymentMethod,
  castInvoiceData 
} from '@/integrations/supabase/client';

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
}

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isProcessPaymentDialogOpen, setIsProcessPaymentDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Initial invoice form state
  const initialInvoiceState: InvoiceFormData = {
    invoice_number: '',
    client: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    amount: 0,
    status: 'pending',
    payment_method: 'unpaid',
    bank_account_id: null,
    booking_id: null
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
      const typedInvoices = data?.map(invoice => castInvoiceData(invoice)) || [];
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

  // Generate a new invoice number based on existing invoices
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const baseNumber = `INV-${year}${month}-`;
    
    if (invoices.length === 0) {
      return `${baseNumber}001`;
    }
    
    // Find the highest existing invoice number with the same prefix
    const existingNumbers = invoices
      .filter(inv => inv.invoice_number.startsWith(baseNumber))
      .map(inv => {
        const suffix = inv.invoice_number.slice(baseNumber.length);
        return parseInt(suffix, 10);
      })
      .filter(num => !isNaN(num));
    
    const highestNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = (highestNumber + 1).toString().padStart(3, '0');
    
    return `${baseNumber}${nextNumber}`;
  };

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
        issue_date: newInvoice.issue_date,
        due_date: newInvoice.due_date,
        amount: newInvoice.amount,
        status: newInvoice.status,
        payment_method: newInvoice.payment_method,
        bank_account_id: newInvoice.bank_account_id,
        booking_id: newInvoice.booking_id,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceToInsert])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      fetchInvoices();
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

  // Add an invoice automatically from a booking
  const addBookingInvoice = async (booking: Booking) => {
    if (!user) return;
    
    try {
      const invoiceNumber = generateInvoiceNumber();
      const dueDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];
      
      const invoiceToInsert = {
        invoice_number: invoiceNumber,
        client: booking.client,
        issue_date: booking.date,
        due_date: dueDate,
        amount: booking.amount,
        status: 'pending' as InvoiceStatus,
        payment_method: 'unpaid' as PaymentMethod,
        booking_id: booking.id,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('invoices')
        .insert([invoiceToInsert]);

      if (error) throw error;
      
      await fetchInvoices();
    } catch (error: any) {
      console.error('Error adding booking invoice:', error);
      toast({
        title: "Error adding invoice for booking",
        description: error.message,
        variant: "destructive",
      });
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
          issue_date: selectedInvoice.issue_date,
          due_date: selectedInvoice.due_date,
          amount: selectedInvoice.amount,
          status: selectedInvoice.status,
          payment_method: selectedInvoice.payment_method,
          bank_account_id: selectedInvoice.bank_account_id,
        })
        .eq('id', selectedInvoice.id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      fetchInvoices();
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

  // Process payment for an invoice
  const processInvoicePayment = async (paymentMethod: PaymentMethod, bankAccountId?: string) => {
    if (!selectedInvoice || !user) return;
    
    setIsLoading(true);
    try {
      // Update the invoice with payment information
      const { error } = await supabase
        .from('invoices')
        .update({
          status: 'paid',
          payment_method: paymentMethod,
          bank_account_id: bankAccountId || null,
        })
        .eq('id', selectedInvoice.id);

      if (error) throw error;
      
      // If this was a cash payment, we need to update the undeposited funds
      if (paymentMethod === 'cash') {
        // Create a transaction for the cash payment
        await supabase
          .from('transactions')
          .insert([{
            date: new Date().toISOString().split('T')[0],
            type: 'deposit',
            description: `Cash payment for invoice ${selectedInvoice.invoice_number}`,
            amount: selectedInvoice.amount,
            fromAccount: null,
            toAccount: null, // Cash payment
            user_id: user.id,
          }]);
      }
      
      // If this was a bank payment, we need to update the bank account balance
      if (paymentMethod === 'bank' && bankAccountId) {
        // Get the bank account
        const { data: bankData } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('id', bankAccountId)
          .single();
          
        if (bankData) {
          // Update the bank account balance
          await supabase
            .from('bank_accounts')
            .update({
              balance: (bankData.balance || 0) + selectedInvoice.amount,
            })
            .eq('id', bankAccountId);
            
          // Create a transaction for the bank deposit
          await supabase
            .from('transactions')
            .insert([{
              date: new Date().toISOString().split('T')[0],
              type: 'deposit',
              description: `Bank deposit for invoice ${selectedInvoice.invoice_number}`,
              amount: selectedInvoice.amount,
              fromAccount: null,
              toAccount: bankAccountId,
              user_id: user.id,
            }]);
        }
      }
      
      setIsProcessPaymentDialogOpen(false);
      await fetchInvoices();
      toast({
        title: "Payment processed",
        description: "The invoice has been marked as paid",
      });
    } catch (error: any) {
      console.error('Error processing invoice payment:', error);
      toast({
        title: "Error processing payment",
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
      fetchInvoices();
      toast({
        title: "Invoice deleted",
        description: `Invoice #${selectedInvoice.invoice_number} has been deleted.`,
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

  return {
    invoices: filteredInvoices,
    searchTerm,
    statusFilter,
    newInvoice,
    selectedInvoice,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isViewDialogOpen,
    isProcessPaymentDialogOpen,
    isLoading,
    setSearchTerm,
    setStatusFilter,
    setSelectedInvoice,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
    setIsProcessPaymentDialogOpen,
    handleNewInvoiceChange,
    handleSelectedInvoiceChange,
    addInvoice,
    addBookingInvoice,
    updateInvoice,
    deleteInvoice,
    processInvoicePayment,
    fetchInvoices
  };
}
