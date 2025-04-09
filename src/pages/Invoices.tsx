import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, FileText, DownloadCloud, Eye, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Invoice, type InvoiceStatus, castInvoiceData } from '@/integrations/supabase/client';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const statusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
};

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  // New invoice form state
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    invoice_number: '',
    client: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: 0,
    status: 'pending',
  });

  // Generate invoice number
  useEffect(() => {
    if (isAddDialogOpen) {
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed
      const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setNewInvoice(prev => ({
        ...prev,
        invoice_number: `INV-${year}-${month.toString().padStart(2, '0')}${randomDigits}`
      }));
    }
  }, [isAddDialogOpen]);

  // Fetch invoices from Supabase
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

  const handleAddInvoice = () => {
    setIsAddDialogOpen(true);
  };

  const handleSubmitNewInvoice = async () => {
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
        invoice_number: newInvoice.invoice_number || '',
        client: newInvoice.client || '',
        issue_date: newInvoice.issue_date || '',
        due_date: newInvoice.due_date || '',
        amount: newInvoice.amount || 0,
        status: newInvoice.status || 'pending',
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceToInsert])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      fetchInvoices();
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

  const handleViewInvoice = (invoiceId: string) => {
    toast({
      title: "View invoice",
      description: `Viewing invoice ${invoiceId} will be implemented in a future update.`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download invoice",
      description: `Downloading invoice ${invoiceId} will be implemented in a future update.`,
    });
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleUpdateInvoice = async () => {
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

  const handleDeleteInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
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
        description: `Invoice ${selectedInvoice.invoice_number} has been deleted.`,
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full">
      <PageHeader 
        title="Invoices" 
        subtitle="Generate and manage client invoices"
        action={{
          label: "Create Invoice",
          onClick: handleAddInvoice,
          icon: <Plus size={16} />,
        }}
      />

      <div className="p-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search invoices..."
                  className="pl-9 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select 
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full md:w-[140px]">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Calendar size={16} className="mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Loading invoices...
                      </TableCell>
                    </TableRow>
                  ) : filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>
                          {new Date(invoice.issue_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">₱{invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[invoice.status]}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewInvoice(invoice.id)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <DownloadCloud size={16} />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No invoices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Invoice Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Enter the details for the new invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-invoice-number">Invoice Number</Label>
                <Input 
                  id="new-invoice-number" 
                  value={newInvoice.invoice_number}
                  onChange={(e) => handleNewInvoiceChange('invoice_number', e.target.value)}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-client">Client</Label>
                <Input 
                  id="new-client" 
                  value={newInvoice.client}
                  onChange={(e) => handleNewInvoiceChange('client', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-issue-date">Issue Date</Label>
                <Input 
                  id="new-issue-date" 
                  type="date" 
                  value={newInvoice.issue_date}
                  onChange={(e) => handleNewInvoiceChange('issue_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-due-date">Due Date</Label>
                <Input 
                  id="new-due-date" 
                  type="date" 
                  value={newInvoice.due_date}
                  onChange={(e) => handleNewInvoiceChange('due_date', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-amount">Amount (₱)</Label>
                <Input 
                  id="new-amount" 
                  type="number" 
                  value={newInvoice.amount?.toString()}
                  onChange={(e) => handleNewInvoiceChange('amount', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <Select 
                  value={newInvoice.status} 
                  onValueChange={(value) => handleNewInvoiceChange('status', value)}
                >
                  <SelectTrigger id="new-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmitNewInvoice}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update the invoice details below.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-invoice-number">Invoice Number</Label>
                  <Input 
                    id="edit-invoice-number" 
                    value={selectedInvoice.invoice_number}
                    onChange={(e) => handleSelectedInvoiceChange('invoice_number', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-client">Client</Label>
                  <Input 
                    id="edit-client" 
                    value={selectedInvoice.client}
                    onChange={(e) => handleSelectedInvoiceChange('client', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-issue-date">Issue Date</Label>
                  <Input 
                    id="edit-issue-date" 
                    type="date" 
                    value={selectedInvoice.issue_date}
                    onChange={(e) => handleSelectedInvoiceChange('issue_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-due-date">Due Date</Label>
                  <Input 
                    id="edit-due-date" 
                    type="date" 
                    value={selectedInvoice.due_date}
                    onChange={(e) => handleSelectedInvoiceChange('due_date', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount (₱)</Label>
                  <Input 
                    id="edit-amount" 
                    type="number" 
                    value={selectedInvoice.amount.toString()}
                    onChange={(e) => handleSelectedInvoiceChange('amount', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedInvoice.status}
                    onValueChange={(value) => handleSelectedInvoiceChange('status', value as any)}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleUpdateInvoice}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
