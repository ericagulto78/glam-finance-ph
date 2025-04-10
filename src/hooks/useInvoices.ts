
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  supabase, 
  Invoice, 
  InvoiceStatus,
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
    isLoading,
    setSearchTerm,
    setStatusFilter,
    setSelectedInvoice,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setIsViewDialogOpen,
    handleNewInvoiceChange,
    handleSelectedInvoiceChange,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    fetchInvoices
  };
}
