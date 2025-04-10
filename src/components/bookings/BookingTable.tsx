
import React from 'react';
import { Booking } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BookingTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onViewBooking?: (booking: Booking) => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (booking: Booking) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  isLoading,
  onViewBooking,
  onEditBooking,
  onDeleteBooking,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No bookings found. Create a new booking to get started.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id} className="cursor-pointer hover:bg-accent/30" onClick={() => onViewBooking && onViewBooking(booking)}>
            <TableCell className="font-medium">{booking.client}</TableCell>
            <TableCell>{booking.service}</TableCell>
            <TableCell>{formatDate(booking.date)}</TableCell>
            <TableCell>{booking.time}</TableCell>
            <TableCell>{getStatusBadge(booking.status)}</TableCell>
            <TableCell className="text-right">₱{booking.amount.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                      <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onViewBooking && (
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onViewBooking(booking);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEditBooking(booking);
                  }}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBooking(booking);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BookingTable;
