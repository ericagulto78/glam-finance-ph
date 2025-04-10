
import React from 'react';
import { Invoice } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import InvoiceForm, { InvoiceFormData } from './InvoiceForm';

interface InvoiceDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  newInvoice: InvoiceFormData;
  selectedInvoice: Invoice | null;
  onAddDialogOpenChange: (open: boolean) => void;
  onEditDialogOpenChange: (open: boolean) => void;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onNewInvoiceChange: (field: string, value: any) => void;
  onSelectedInvoiceChange: (field: string, value: any) => void;
  onSubmitNewInvoice: () => void;
  onUpdateInvoice: () => void;
  onConfirmDelete: () => void;
}

export const InvoiceDialogs: React.FC<InvoiceDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isLoading,
  newInvoice,
  selectedInvoice,
  onAddDialogOpenChange,
  onEditDialogOpenChange,
  onDeleteDialogOpenChange,
  onNewInvoiceChange,
  onSelectedInvoiceChange,
  onSubmitNewInvoice,
  onUpdateInvoice,
  onConfirmDelete,
}) => {
  return (
    <>
      {/* Add Invoice Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Invoice</DialogTitle>
            <DialogDescription>
              Enter the details for the new invoice.
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm
            formData={newInvoice}
            isLoading={isLoading}
            onFormChange={onNewInvoiceChange}
            onCancel={() => onAddDialogOpenChange(false)}
            onSubmit={onSubmitNewInvoice}
            submitLabel="Add Invoice"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update the invoice details below.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <InvoiceForm
              formData={selectedInvoice}
              isLoading={isLoading}
              onFormChange={onSelectedInvoiceChange}
              onCancel={() => onEditDialogOpenChange(false)}
              onSubmit={onUpdateInvoice}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onDeleteDialogOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvoiceDialogs;
