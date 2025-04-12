
import React, { useState, useEffect } from 'react';
import { Booking } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import BookingForm, { BookingFormData } from './BookingForm';
import BookingDetails from './BookingDetails';
import { useInvoices } from '@/hooks/useInvoices';
import { supabase } from '@/integrations/supabase/client';

interface BookingDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isViewDialogOpen?: boolean;
  isLoading: boolean;
  newBooking: BookingFormData;
  selectedBooking: Booking | null;
  onAddDialogOpenChange: (open: boolean) => void;
  onEditDialogOpenChange: (open: boolean) => void;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onViewDialogOpenChange?: (open: boolean) => void;
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
  isViewDialogOpen = false,
  isLoading,
  newBooking,
  selectedBooking,
  onAddDialogOpenChange,
  onEditDialogOpenChange,
  onDeleteDialogOpenChange,
  onViewDialogOpenChange = () => {},
  onNewBookingChange,
  onSelectedBookingChange,
  onSubmitNewBooking,
  onUpdateBooking,
  onConfirmDelete,
}) => {
  const { addBookingInvoice } = useInvoices();
  const [hasInvoice, setHasInvoice] = useState(false);

  useEffect(() => {
    if (selectedBooking && isViewDialogOpen) {
      checkInvoiceExists(selectedBooking.id);
    }
  }, [selectedBooking, isViewDialogOpen]);

  const checkInvoiceExists = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id')
        .eq('booking_id', bookingId)
        .maybeSingle();

      if (error) throw error;
      setHasInvoice(!!data);
    } catch (error) {
      console.error('Error checking invoice:', error);
      setHasInvoice(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!selectedBooking) return;
    
    try {
      // Remove description field when creating invoice from booking
      await addBookingInvoice(selectedBooking);
      setHasInvoice(true);
    } catch (error) {
      console.error('Error creating invoice from booking:', error);
    }
  };

  return (
    <>
      {/* Add Booking Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px] max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Add New Booking</DialogTitle>
            <DialogDescription>
              Enter the details for the new booking.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(85vh-130px)]">
            <div className="p-6 pt-2">
              <BookingForm
                formData={newBooking}
                isLoading={isLoading}
                onFormChange={onNewBookingChange}
                onCancel={() => onAddDialogOpenChange(false)}
                onSubmit={onSubmitNewBooking}
                submitLabel="Add Booking"
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px] max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update the booking details below.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <ScrollArea className="max-h-[calc(85vh-130px)]">
              <div className="p-6 pt-2">
                <BookingForm
                  formData={selectedBooking}
                  isLoading={isLoading}
                  onFormChange={onSelectedBookingChange}
                  onCancel={() => onEditDialogOpenChange(false)}
                  onSubmit={onUpdateBooking}
                  submitLabel="Save Changes"
                />
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* View Booking Dialog */}
      {selectedBooking && (
        <Dialog open={isViewDialogOpen} onOpenChange={onViewDialogOpenChange}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(85vh-130px)]">
              <div className="p-6 pt-2">
                <BookingDetails 
                  booking={selectedBooking} 
                  onCreateInvoice={handleCreateInvoice}
                  hasInvoice={hasInvoice}
                />
              </div>
            </ScrollArea>
            <DialogFooter className="p-6 pt-4 border-t">
              <Button variant="outline" onClick={() => onViewDialogOpenChange(false)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  onViewDialogOpenChange(false);
                  onEditDialogOpenChange(true);
                }}
              >
                Edit Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
