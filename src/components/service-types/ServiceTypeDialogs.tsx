
import React from 'react';
import { ServiceType, ServiceTypeFormData } from '@/hooks/useServiceTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ServiceTypeForm from './ServiceTypeForm';

interface ServiceTypeDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  newServiceType: ServiceTypeFormData;
  selectedServiceType: ServiceType | null;
  onAddDialogOpenChange: (open: boolean) => void;
  onEditDialogOpenChange: (open: boolean) => void;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onNewServiceTypeChange: (field: string, value: any) => void;
  onSelectedServiceTypeChange: (field: string, value: any) => void;
  onSubmitNewServiceType: () => void;
  onUpdateServiceType: () => void;
  onConfirmDelete: () => void;
}

export const ServiceTypeDialogs: React.FC<ServiceTypeDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isLoading,
  newServiceType,
  selectedServiceType,
  onAddDialogOpenChange,
  onEditDialogOpenChange,
  onDeleteDialogOpenChange,
  onNewServiceTypeChange,
  onSelectedServiceTypeChange,
  onSubmitNewServiceType,
  onUpdateServiceType,
  onConfirmDelete,
}) => {
  return (
    <>
      {/* Add Service Type Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Service Type</DialogTitle>
            <DialogDescription>
              Enter the details for the new service type.
            </DialogDescription>
          </DialogHeader>
          <ServiceTypeForm
            formData={newServiceType}
            isLoading={isLoading}
            onFormChange={onNewServiceTypeChange}
            onCancel={() => onAddDialogOpenChange(false)}
            onSubmit={onSubmitNewServiceType}
            submitLabel="Add Service Type"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Service Type Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Service Type</DialogTitle>
            <DialogDescription>
              Update the service type details below.
            </DialogDescription>
          </DialogHeader>
          {selectedServiceType && (
            <ServiceTypeForm
              formData={selectedServiceType}
              isLoading={isLoading}
              onFormChange={onSelectedServiceTypeChange}
              onCancel={() => onEditDialogOpenChange(false)}
              onSubmit={onUpdateServiceType}
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
              Are you sure you want to delete this service type? This action cannot be undone.
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

export default ServiceTypeDialogs;
