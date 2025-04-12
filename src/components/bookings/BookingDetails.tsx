
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

  // Parse service details (split by newlines)
  const serviceLines = booking.service.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">Booking Details</h2>
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
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Services</h3>
        <div className="bg-muted p-4 rounded-md">
          {serviceLines.map((line, index) => (
            <div key={index} className="mb-2 last:mb-0">
              {line}
            </div>
          ))}
        </div>
      </div>

      {booking.service_details && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Additional Service Details</h3>
          <p>{booking.service_details}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Fees</h3>
        <div className="space-y-2">
          <div className="grid grid-cols-2">
            <span>Service Fee:</span>
            <span className="text-right">₱{(booking.amount - (booking.transportation_fee || 0) - (booking.early_morning_fee || 0)).toLocaleString()}</span>
          </div>
          
          {booking.transportation_fee && booking.transportation_fee > 0 && (
            <div className="grid grid-cols-2">
              <span>Transportation Fee:</span>
              <span className="text-right">₱{booking.transportation_fee.toLocaleString()}</span>
            </div>
          )}
          
          {booking.early_morning_fee && booking.early_morning_fee > 0 && (
            <div className="grid grid-cols-2">
              <span>Early Morning Fee:</span>
              <span className="text-right">₱{booking.early_morning_fee.toLocaleString()}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 font-bold pt-2 border-t">
            <span>Total Amount:</span>
            <span className="text-right">₱{booking.amount.toLocaleString()}</span>
          </div>
          
          {booking.reservation_fee > 0 && (
            <div className="grid grid-cols-2 text-muted-foreground">
              <span>Reservation Fee:</span>
              <span className="text-right">₱{booking.reservation_fee.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

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
