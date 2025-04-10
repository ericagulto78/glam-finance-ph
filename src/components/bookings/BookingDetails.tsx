
import React from 'react';
import { Booking } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  CalendarDays, 
  Clock, 
  MapPin, 
  DollarSign, 
  FileText, 
  ArrowRight 
} from 'lucide-react';

interface BookingDetailsProps {
  booking: Booking;
  onCreateInvoice: () => void;
  hasInvoice: boolean;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onCreateInvoice, hasInvoice }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Status and header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold mb-1">{booking.service}</h3>
          <p className="text-lg text-muted-foreground">{booking.client}</p>
        </div>
        <div className="space-y-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
          {booking.status === 'upcoming' && !hasInvoice && (
            <Button 
              onClick={onCreateInvoice} 
              className="ml-2 flex items-center gap-1"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-1" />
              Create Invoice
            </Button>
          )}
          {hasInvoice && (
            <div className="flex items-center text-green-600 text-sm mt-1">
              <Check className="h-4 w-4 mr-1" />
              Invoice created
            </div>
          )}
        </div>
      </div>

      {/* Booking details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-b py-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(booking.date)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{booking.time}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{booking.location}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-medium">₱{booking.amount.toLocaleString()}</p>
            </div>
          </div>
          
          {booking.reservation_fee > 0 && (
            <div className="flex items-start gap-2">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Reservation Fee</p>
                <p className="font-medium">₱{booking.reservation_fee.toLocaleString()}</p>
              </div>
            </div>
          )}
          
          {booking.service_details && (
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Service Details</p>
                <p className="font-medium">{booking.service_details}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
