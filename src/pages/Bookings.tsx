
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, User, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface Booking {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  location: string;
  amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  // New booking form state
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    client: '',
    service: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM',
    location: '',
    amount: 0,
    status: 'upcoming',
  });

  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setBookings(data || []);
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

  const handleAddBooking = () => {
    setNewBooking({
      client: '',
      service: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM',
      location: '',
      amount: 0,
      status: 'upcoming',
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmitNewBooking = async () => {
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
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            ...newBooking,
            user_id: user.id,
          }
        ])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      fetchBookings();
      toast({
        title: "Booking added",
        description: "The booking has been successfully added",
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

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
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
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      fetchBookings();
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

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBooking || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', selectedBooking.id);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      fetchBookings();
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

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search bookings..."
                  className="pl-9 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select 
                  defaultValue="all"
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full md:w-[140px]">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Calendar size={16} className="mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Client & Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading bookings...
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User size={14} className="text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{booking.client}</div>
                              <div className="text-sm text-muted-foreground">{booking.service}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div className="text-sm text-muted-foreground">{booking.time}</div>
                        </TableCell>
                        <TableCell>{booking.location}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <DollarSign size={14} className="text-muted-foreground" />
                            <span>₱{booking.amount.toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={statusColors[booking.status]}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditBooking(booking)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteBooking(booking)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No bookings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Booking Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Booking</DialogTitle>
            <DialogDescription>
              Enter the details for the new booking.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-client">Client Name</Label>
                <Input 
                  id="new-client" 
                  value={newBooking.client}
                  onChange={(e) => handleNewBookingChange('client', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-service">Service</Label>
                <Input 
                  id="new-service" 
                  value={newBooking.service}
                  onChange={(e) => handleNewBookingChange('service', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-date">Date</Label>
                <Input 
                  id="new-date" 
                  type="date" 
                  value={newBooking.date}
                  onChange={(e) => handleNewBookingChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-time">Time</Label>
                <Input 
                  id="new-time" 
                  value={newBooking.time}
                  onChange={(e) => handleNewBookingChange('time', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-location">Location</Label>
              <Input 
                id="new-location" 
                value={newBooking.location}
                onChange={(e) => handleNewBookingChange('location', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-amount">Amount (₱)</Label>
                <Input 
                  id="new-amount" 
                  type="number" 
                  value={newBooking.amount?.toString()}
                  onChange={(e) => handleNewBookingChange('amount', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <Select 
                  value={newBooking.status} 
                  onValueChange={(value) => handleNewBookingChange('status', value)}
                >
                  <SelectTrigger id="new-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmitNewBooking}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Booking'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update the booking details below.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input 
                    id="client" 
                    value={selectedBooking.client}
                    onChange={(e) => handleSelectedBookingChange('client', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Input 
                    id="service" 
                    value={selectedBooking.service}
                    onChange={(e) => handleSelectedBookingChange('service', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={selectedBooking.date}
                    onChange={(e) => handleSelectedBookingChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    value={selectedBooking.time}
                    onChange={(e) => handleSelectedBookingChange('time', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={selectedBooking.location}
                  onChange={(e) => handleSelectedBookingChange('location', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₱)</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    value={selectedBooking.amount.toString()}
                    onChange={(e) => handleSelectedBookingChange('amount', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={selectedBooking.status}
                    onValueChange={(value) => handleSelectedBookingChange('status', value as any)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleUpdateBooking}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;
