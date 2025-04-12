import { create } from 'zustand';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Booking, BookingStatus, castBooking } from '@/integrations/supabase/client';
import { useInvoices } from '@/hooks/useInvoices';

export interface BookingFormData {
  id?: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: BookingStatus;
  reservation_fee?: number;
  service_details?: string;
  persons?: number;
  transportation_fee?: number;
  early_morning_fee?: number;
}

interface BookingStore {
  bookings: Booking[];
  searchTerm: string;
  statusFilter: string;
  selectedBooking: Booking | null;
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isViewDialogOpen: boolean;
  isLoading: boolean;
  
  // New booking form state
  newBooking: BookingFormData;
  
  // Actions
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: string) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setIsViewDialogOpen: (isOpen: boolean) => void;
  
  // Form handlers
  handleNewBookingChange: (field: string, value: any) => void;
  handleSelectedBookingChange: (field: string, value: any) => void;
  
  // API actions
  fetchBookings: () => Promise<void>;
  addBooking: () => Promise<void>;
  updateBooking: () => Promise<void>;
  deleteBooking: () => Promise<void>;
}

// Create the store
export const useBookingsStore = create<BookingStore>((set, get) => ({
  bookings: [],
  searchTerm: '',
  statusFilter: 'all',
  selectedBooking: null,
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  isViewDialogOpen: false,
  isLoading: false,
  
  // Initial booking form state
  newBooking: {
    client: '',
    service: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    location: '',
    amount: 0,
    status: 'upcoming',
    reservation_fee: 0,
    service_details: '',
    persons: 1,
    transportation_fee: 0,
    early_morning_fee: 0,
  },
  
  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  setIsAddDialogOpen: (isOpen) => set({ isAddDialogOpen: isOpen }),
  setIsEditDialogOpen: (isOpen) => set({ isEditDialogOpen: isOpen }),
  setIsDeleteDialogOpen: (isOpen) => set({ isDeleteDialogOpen: isOpen }),
  setIsViewDialogOpen: (isOpen) => set({ isViewDialogOpen: isOpen }),
  
  // Form handlers
  handleNewBookingChange: (field, value) => {
    set((state) => ({
      newBooking: {
        ...state.newBooking,
        [field]: value,
      }
    }));
  },
  
  handleSelectedBookingChange: (field, value) => {
    set((state) => {
      if (!state.selectedBooking) return state;
      
      return {
        selectedBooking: {
          ...state.selectedBooking,
          [field]: value,
        }
      };
    });
  },
  
  // API actions will be implemented in the custom hook
  fetchBookings: async () => {}, // This will be implemented in the useBookings hook
  addBooking: async () => {}, // This will be implemented in the useBookings hook
  updateBooking: async () => {}, // This will be implemented in the useBookings hook
  deleteBooking: async () => {}, // This will be implemented in the useBookings hook
}));

// Custom hook to extend the store with API actions
export function useBookings() {
  const store = useBookingsStore();
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
    reservation_fee: 0,
    service_details: '',
    persons: 1,
    transportation_fee: 0,
    early_morning_fee: 0,
  };
  
  // Fetch bookings
  const fetchBookings = async () => {
    if (!user) return;
    
    store.setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure it matches our Booking type
      const typedBookings = data?.map(booking => castBooking(booking)) || [];
      useBookingsStore.setState({ bookings: typedBookings });
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      store.setIsLoading(false);
    }
  };
  
  // Add a new booking
  const addBooking = async () => {
    if (!user) return;
    
    if (!store.newBooking.client || !store.newBooking.service || !store.newBooking.date || !store.newBooking.time || !store.newBooking.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    store.setIsLoading(true);
    try {
      const bookingToInsert = {
        client: store.newBooking.client,
        service: store.newBooking.service,
        date: store.newBooking.date,
        time: store.newBooking.time,
        location: store.newBooking.location,
        amount: store.newBooking.amount,
        status: store.newBooking.status,
        reservation_fee: store.newBooking.reservation_fee || 0,
        service_details: store.newBooking.service_details || '',
        persons: store.newBooking.persons || 1,
        transportation_fee: store.newBooking.transportation_fee || 0,
        early_morning_fee: store.newBooking.early_morning_fee || 0,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingToInsert])
        .select();

      if (error) throw error;
      
      store.setIsAddDialogOpen(false);
      // Immediately fetch bookings after adding
      await fetchBookings();
      
      // Reset newBooking to initial state
      store.newBooking = initialBookingState;
      
      // Create an invoice for this booking
      if (data && data.length > 0) {
        await addBookingInvoice(data[0] as Booking);
      }
      
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
      store.setIsLoading(false);
    }
  };
  
  // Update an existing booking
  const updateBooking = async () => {
    if (!store.selectedBooking || !user) return;
    
    store.setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          client: store.selectedBooking.client,
          service: store.selectedBooking.service,
          date: store.selectedBooking.date,
          time: store.selectedBooking.time,
          location: store.selectedBooking.location,
          amount: store.selectedBooking.amount,
          status: store.selectedBooking.status,
          reservation_fee: store.selectedBooking.reservation_fee || 0,
          service_details: store.selectedBooking.service_details || '',
          persons: store.selectedBooking.persons || 1,
          transportation_fee: store.selectedBooking.transportation_fee || 0,
          early_morning_fee: store.selectedBooking.early_morning_fee || 0
        })
        .eq('id', store.selectedBooking.id);

      if (error) throw error;
      
      store.setIsEditDialogOpen(false);
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
      store.setIsLoading(false);
    }
  };
  
  // Delete a booking
  const deleteBooking = async () => {
    if (!store.selectedBooking || !user) return;
    
    store.setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', store.selectedBooking.id);

      if (error) throw error;
      
      store.setIsDeleteDialogOpen(false);
      // Immediately fetch bookings after deleting
      await fetchBookings();
      toast({
        title: "Booking deleted",
        description: `Booking for ${store.selectedBooking.client} has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error deleting booking",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      store.setIsLoading(false);
    }
  };
  
  // Filter bookings based on search term and status
  const filteredBookings = store.bookings.filter(booking => {
    const matchesSearch = booking.client.toLowerCase().includes(store.searchTerm.toLowerCase()) || 
                         booking.service.toLowerCase().includes(store.searchTerm.toLowerCase());
    
    const matchesStatus = store.statusFilter === 'all' || booking.status === store.statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Override the API actions in the store
  store.fetchBookings = fetchBookings;
  store.addBooking = addBooking;
  store.updateBooking = updateBooking;
  store.deleteBooking = deleteBooking;
  
  return {
    ...store,
    bookings: filteredBookings,
  };
}
