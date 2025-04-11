
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Booking } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface BookingDetailsProps {
  booking: Booking;
  onCreateInvoice: () => Promise<void>;
  hasInvoice: boolean;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  booking, 
  onCreateInvoice,
  hasInvoice
}) => {
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleCreateInvoice = async () => {
    setIsCreatingInvoice(true);
    try {
      await onCreateInvoice();
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{booking.service}</h2>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>
        <p className="text-muted-foreground">Booking ID: {booking.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Client Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {booking.client}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Date:</span> {format(new Date(booking.date), 'MMMM d, yyyy')}</p>
            <p><span className="font-medium">Time:</span> {booking.time}</p>
            <p><span className="font-medium">Location:</span> {booking.location}</p>
            <p><span className="font-medium">Amount:</span> ₱{booking.amount.toLocaleString()}</p>
            {booking.reservation_fee > 0 && (
              <p><span className="font-medium">Reservation Fee:</span> ₱{booking.reservation_fee.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>

      {booking.service_details && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Service Details</h3>
          <p>{booking.service_details}</p>
        </div>
      )}

      {/* Invoice creation section */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Invoice Status</h3>
            <p>{hasInvoice ? "Invoice has been created for this booking" : "No invoice created yet"}</p>
          </div>
          
          {!hasInvoice && (
            <Button 
              onClick={handleCreateInvoice} 
              disabled={isCreatingInvoice}
            >
              {isCreatingInvoice ? "Creating..." : "Create Invoice"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
