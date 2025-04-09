
import React from 'react';
import { Booking } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BookingForm, { BookingFormData } from './BookingForm';

interface BookingDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  newBooking: BookingFormData;
  selectedBooking: Booking | null;
  onAddDialogOpenChange: (open: boolean) => void;
  onEditDialogOpenChange: (open: boolean) => void;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onNewBookingChange: (field: string, value: any) => void;
  onSelectedBookingChange: (field: string, value: any) => void;
  onSubmitNewBooking: () => void;
  onUpdateBooking: () => void;
  onConfirmDelete: () => void;
}

export const BookingDialogs: React.FC<BookingDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isLoading,
  newBooking,
  selectedBooking,
  onAddDialogOpenChange,
  onEditDialogOpenChange,
  onDeleteDialogOpenChange,
  onNewBookingChange,
  onSelectedBookingChange,
  onSubmitNewBooking,
  onUpdateBooking,
  onConfirmDelete,
}) => {
  return (
    <>
      {/* Add Booking Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Booking</DialogTitle>
            <DialogDescription>
              Enter the details for the new booking.
            </DialogDescription>
          </DialogHeader>
          <BookingForm
            formData={newBooking}
            isLoading={isLoading}
            onFormChange={onNewBookingChange}
            onCancel={() => onAddDialogOpenChange(false)}
            onSubmit={onSubmitNewBooking}
            submitLabel="Add Booking"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update the booking details below.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <BookingForm
              formData={selectedBooking}
              isLoading={isLoading}
              onFormChange={onSelectedBookingChange}
              onCancel={() => onEditDialogOpenChange(false)}
              onSubmit={onUpdateBooking}
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
              Are you sure you want to delete this booking? This action cannot be undone.
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

export default BookingDialogs;
