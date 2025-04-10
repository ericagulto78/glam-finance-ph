import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import InvoiceFilter from '@/components/invoices/InvoiceFilter';
import InvoiceDialog from '@/components/invoices/InvoiceDialog';
import InvoiceView from '@/components/invoices/InvoiceView';
import InvoicePaymentDialog from '@/components/invoices/InvoicePaymentDialog';
import { 
  Invoice, 
  InvoiceStatus, 
  BankAccount,
  Booking,
  PaymentMethod,
  supabase 
} from '@/integrations/supabase/client';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useBankAccounts } from '@/hooks/useBankAccounts';

const Invoices = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { bankAccounts, fetchBankAccounts } = useBankAccounts();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInvoices();
    fetchBookings();
    fetchBankAccounts();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data as Invoice[]);
    } catch (error: any) {
      toast({
        title: "Error fetching invoices",
        description: error.message || "An error occurred while fetching invoices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data as Booking[]);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message || "An error occurred while fetching bookings",
        variant: "destructive",
      });
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBankAccounts(data as BankAccount[]);
    } catch (error: any) {
      toast({
        title: "Error fetching bank accounts",
        description: error.message || "An error occurred while fetching bank accounts",
        variant: "destructive",
      });
    }
  };

  const handleCreateInvoice = async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) throw error;

      setInvoices(prevInvoices => [data as Invoice, ...prevInvoices]);
      setIsCreateModalOpen(false);
      toast({
        title: "Invoice created",
        description: `Invoice #${data.invoice_number} has been successfully created.`,
      });
    } catch (error: any) {
      toast({
        title: "Error creating invoice",
        description: error.message || "An error occurred while creating the invoice",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInvoice = async (invoiceData: Invoice) => {
    if (!invoiceData.id) {
      toast({
        title: "Error updating invoice",
        description: "Invoice ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', invoiceData.id)
        .select()
        .single();

      if (error) throw error;

      setInvoices(prevInvoices =>
        prevInvoices.map(invoice => (invoice.id === invoiceData.id ? data as Invoice : invoice))
      );
      setIsEditModalOpen(false);
      toast({
        title: "Invoice updated",
        description: `Invoice #${data.invoice_number} has been successfully updated.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating invoice",
        description: error.message || "An error occurred while updating the invoice",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting invoice",
        description: error.message || "An error occurred while deleting the invoice",
        variant: "destructive",
      });
    }
  };

  const handleProcessPayment = async (paymentMethod: PaymentMethod, bankAccountId?: string) => {
    try {
      if (!currentInvoice) return;
      
      // Optimistically update the invoice status to 'paid'
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === currentInvoice.id ? { 
            ...invoice, 
            status: 'paid' as InvoiceStatus, 
            payment_method: paymentMethod, 
            bank_account_id: bankAccountId 
          } : invoice
        )
      );

      // Update the invoice in the database
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid', 
          payment_method: paymentMethod, 
          bank_account_id: bankAccountId 
        })
        .eq('id', currentInvoice.id);

      if (error) {
        // If there's an error, revert the optimistic update
        setInvoices(prevInvoices =>
          prevInvoices.map(invoice =>
            invoice.id === currentInvoice.id ? { 
              ...invoice, 
              status: 'pending', 
              payment_method: 'unpaid', 
              bank_account_id: null 
            } : invoice
          )
        );
        throw error;
      }

      setIsPaymentModalOpen(false);
      toast({
        title: "Payment processed",
        description: "The payment has been successfully processed and the invoice status updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error processing payment",
        description: error.message || "An error occurred while processing the payment",
        variant: "destructive",
      });
    }
  };

  const handleNewInvoice = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleStatusFilter = (status: InvoiceStatus | 'all') => {
    setStatusFilter(status);
  };

  const handleDateRangeFilter = (range: [Date | null, Date | null]) => {
    setDateRange(range);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const statusMatch = statusFilter === 'all' || invoice.status === statusFilter;
    
    const dateMatch = 
      !dateRange[0] || !dateRange[1] ||
      (new Date(invoice.issue_date) >= dateRange[0] && new Date(invoice.issue_date) <= dateRange[1]);

    const searchMatch =
      invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && dateMatch && searchMatch;
  });

  return (
    <div className="h-full">
      <PageHeader 
        title="Invoices" 
        subtitle="Manage client invoices and payments"
        action={{
          label: "New Invoice",
          onClick: handleNewInvoice,
          icon: <Plus className="mr-2 h-4 w-4" />
        }}
      />
      
      <div className="px-6 py-4">
        <InvoiceFilter 
          onStatusChange={handleStatusFilter} 
          onDateRangeChange={handleDateRangeFilter}
          onSearch={handleSearch}
        />
        
        <InvoiceTable 
          invoices={filteredInvoices} 
          isLoading={isLoading}
          onViewInvoice={handleViewInvoice}
          onEditInvoice={handleEditInvoice}
          onDeleteInvoice={handleDeleteInvoice}
        />
      </div>
      
      {isCreateModalOpen && (
        <InvoiceDialog
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateInvoice}
          bookings={bookings}
          title="Create New Invoice"
          buttonText="Create Invoice"
        />
      )}
      
      {currentInvoice && isEditModalOpen && (
        <InvoiceDialog
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateInvoice}
          bookings={bookings}
          initialData={currentInvoice}
          title="Edit Invoice"
          buttonText="Save Changes"
        />
      )}
      
      {currentInvoice && isViewModalOpen && (
        <Dialog
          open={isViewModalOpen}
          onOpenChange={(open) => {
            if (!open) setIsViewModalOpen(false);
          }}
        >
          <DialogContent className="max-w-3xl">
            <InvoiceView 
              invoice={currentInvoice} 
              onProcessPayment={() => {
                setIsViewModalOpen(false);
                setIsPaymentModalOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {currentInvoice && isPaymentModalOpen && (
        <InvoicePaymentDialog
          isOpen={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          onProcessPayment={handleProcessPayment}
          invoice={currentInvoice}
          isLoading={isLoading}
        />
      )}
      
      {isDeleteDialogOpen && currentInvoice && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete invoice 
                #{currentInvoice.invoice_number} for {currentInvoice.client}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleConfirmDelete(currentInvoice.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Invoices;
