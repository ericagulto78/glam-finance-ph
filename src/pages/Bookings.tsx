
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import BookingTable from '@/components/bookings/BookingTable';
import BookingFilter from '@/components/bookings/BookingFilter';
import BookingDialogs from '@/components/bookings/BookingDialogs';
import { useBookings } from '@/hooks/useBookings';
import { Booking } from '@/integrations/supabase/client';

const Bookings = () => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const {
    bookings,
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
    deleteBooking
  } = useBookings();

  const handleAddBooking = () => {
    setIsAddDialogOpen(true);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="h-full">
      <PageHeader 
        title="Bookings" 
        subtitle="Manage your makeup service appointments"
        action={{
          label: "Add Booking",
          onClick: handleAddBooking,
          icon: <Plus size={16} />,
        }}
      />

      <div className="p-6">
        <BookingFilter 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        <Card>
          <CardContent className="p-0">
            <BookingTable 
              bookings={bookings}
              isLoading={isLoading}
              onViewBooking={handleViewBooking}
              onEditBooking={handleEditBooking}
              onDeleteBooking={handleDeleteBooking}
            />
          </CardContent>
        </Card>
      </div>

      <BookingDialogs 
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isViewDialogOpen={isViewDialogOpen}
        isLoading={isLoading}
        newBooking={newBooking}
        selectedBooking={selectedBooking}
        onAddDialogOpenChange={setIsAddDialogOpen}
        onEditDialogOpenChange={setIsEditDialogOpen}
        onDeleteDialogOpenChange={setIsDeleteDialogOpen}
        onViewDialogOpenChange={setIsViewDialogOpen}
        onNewBookingChange={handleNewBookingChange}
        onSelectedBookingChange={handleSelectedBookingChange}
        onSubmitNewBooking={addBooking}
        onUpdateBooking={updateBooking}
        onConfirmDelete={deleteBooking}
      />
    </div>
  );
};

export default Bookings;
