
import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import BookingTable from '@/components/bookings/BookingTable';
import BookingFilter from '@/components/bookings/BookingFilter';
import BookingDialogs from '@/components/bookings/BookingDialogs';
import { useBookings } from '@/hooks/useBookings';

const Bookings = () => {
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

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBooking = (booking: any) => {
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
        isLoading={isLoading}
        newBooking={newBooking}
        selectedBooking={selectedBooking}
        onAddDialogOpenChange={setIsAddDialogOpen}
        onEditDialogOpenChange={setIsEditDialogOpen}
        onDeleteDialogOpenChange={setIsDeleteDialogOpen}
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
