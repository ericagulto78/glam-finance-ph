
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices } from '@/hooks/useInvoices';
import { 
  supabase, 
  Booking, 
  BookingStatus,
  castBookingData 
} from '@/integrations/supabase/client';

export interface BookingFormData {
  id?: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
  reservation_fee?: number; // Added reservation fee
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { addBookingInvoice } = useInvoices();
  
  // Initial booking form state
  const initialBookingState: BookingFormData = {
    client: '',
    service: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    location: '',
    amount: 0,
    status: 'upcoming',
    reservation_fee: 0, // Default reservation fee
  };
  
  const [newBooking, setNewBooking] = useState<BookingFormData>(initialBookingState);

  // Fetch bookings
  const fetchBookings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure it matches our Booking type
      const typedBookings = data?.map(booking => castBookingData(booking)) || [];
      setBookings(typedBookings);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // Add a new booking
  const addBooking = async () => {
    if (!user) return;
    
    if (!newBooking.client || !newBooking.service || !newBooking.date || !newBooking.time || !newBooking.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const bookingToInsert = {
        client: newBooking.client,
        service: newBooking.service,
        date: newBooking.date,
        time: newBooking.time,
        location: newBooking.location,
        amount: newBooking.amount,
        status: newBooking.status,
        reservation_fee: newBooking.reservation_fee || 0,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingToInsert])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      // Immediately fetch bookings after adding
      await fetchBookings();
      
      // Create an invoice for this booking
      if (data && data.length > 0) {
        await addBookingInvoice(data[0] as Booking);
      }
      
      setNewBooking(initialBookingState);
      toast({
        title: "Booking added",
        description: "The booking has been successfully added with an invoice",
      });
    } catch (error: any) {
      console.error('Error adding booking:', error);
      toast({
        title: "Error adding booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing booking
  const updateBooking = async () => {
    if (!selectedBooking || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          client: selectedBooking.client,
          service: selectedBooking.service,
          date: selectedBooking.date,
          time: selectedBooking.time,
          location: selectedBooking.location,
          amount: selectedBooking.amount,
          status: selectedBooking.status,
          reservation_fee: selectedBooking.reservation_fee || 0
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      // Immediately fetch bookings after updating
      await fetchBookings();
      toast({
        title: "Booking updated",
        description: "The booking has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error updating booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a booking
  const deleteBooking = async () => {
    if (!selectedBooking || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      // Immediately fetch bookings after deleting
      await fetchBookings();
      toast({
        title: "Booking deleted",
        description: `Booking for ${selectedBooking.client} has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error deleting booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes for new booking
  const handleNewBookingChange = (field: string, value: any) => {
    setNewBooking((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form input changes for edit booking
  const handleSelectedBookingChange = (field: string, value: any) => {
    if (!selectedBooking) return;
    
    setSelectedBooking((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Filter bookings based on search term and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return {
    bookings: filteredBookings,
    searchTerm,
    statusFilter,
    newBooking,
    selectedBooking,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isLoading,
    setSearchTerm,
    setStatusFilter,
    setSelectedBooking,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleNewBookingChange,
    handleSelectedBookingChange,
    addBooking,
    updateBooking,
    deleteBooking,
    fetchBookings
  };
}
