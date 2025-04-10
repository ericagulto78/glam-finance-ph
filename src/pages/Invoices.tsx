
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import InvoiceTable from '@/components/invoices/InvoiceTable';
import InvoiceFilter from '@/components/invoices/InvoiceFilter';
import InvoiceDialogs from '@/components/invoices/InvoiceDialogs';
import { useInvoices } from '@/hooks/useInvoices';

const Invoices = () => {
  const {
    invoices,
    searchTerm,
    statusFilter,
    newInvoice,
    selectedInvoice,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isLoading,
    setSearchTerm,
    setStatusFilter,
    setSelectedInvoice,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleNewInvoiceChange,
    handleSelectedInvoiceChange,
    addInvoice,
    updateInvoice,
    deleteInvoice
  } = useInvoices();

  const handleAddInvoice = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsEditDialogOpen(true);
  };

  const handleDeleteInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="h-full">
      <PageHeader 
        title="Invoices" 
        subtitle="Track and manage your client invoices"
        action={{
          label: "Add Invoice",
          onClick: handleAddInvoice,
          icon: <Plus size={16} />,
        }}
      />

      <div className="p-6">
        <InvoiceFilter 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        <Card>
          <CardContent className="p-0">
            <InvoiceTable 
              invoices={invoices}
              isLoading={isLoading}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
            />
          </CardContent>
        </Card>
      </div>

      <InvoiceDialogs 
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isLoading={isLoading}
        newInvoice={newInvoice}
        selectedInvoice={selectedInvoice}
        onAddDialogOpenChange={setIsAddDialogOpen}
        onEditDialogOpenChange={setIsEditDialogOpen}
        onDeleteDialogOpenChange={setIsDeleteDialogOpen}
        onNewInvoiceChange={handleNewInvoiceChange}
        onSelectedInvoiceChange={handleSelectedInvoiceChange}
        onSubmitNewInvoice={addInvoice}
        onUpdateInvoice={updateInvoice}
        onConfirmDelete={deleteInvoice}
      />
    </div>
  );
};

export default Invoices;
