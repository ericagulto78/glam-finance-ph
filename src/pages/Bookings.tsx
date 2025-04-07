import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, User, DollarSign, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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
  DialogTrigger,
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

const BOOKINGS_DATA: Booking[] = [
  {
    id: '1',
    client: 'Maria Santos',
    service: 'Bridal Makeup',
    date: '2025-04-15',
    time: '09:00 AM',
    location: 'Client\'s Home',
    amount: 5000,
    status: 'upcoming',
  },
  {
    id: '2',
    client: 'Sofia Garcia',
    service: 'Photoshoot Makeup',
    date: '2025-04-12',
    time: '01:30 PM',
    location: 'Studio',
    amount: 3500,
    status: 'upcoming',
  },
  {
    id: '3',
    client: 'Olivia Cruz',
    service: 'Special Event Makeup',
    date: '2025-04-08',
    time: '10:00 AM',
    location: 'Hotel Venue',
    amount: 4200,
    status: 'completed',
  },
  {
    id: '4',
    client: 'Isabella Reyes',
    service: 'Party Makeup',
    date: '2025-04-05',
    time: '07:00 PM',
    location: 'Client\'s Home',
    amount: 2800,
    status: 'completed',
  },
  {
    id: '5',
    client: 'Emma Fernandez',
    service: 'Bridal Trial',
    date: '2025-04-03',
    time: '02:00 PM',
    location: 'Studio',
    amount: 2500,
    status: 'cancelled',
  },
];

const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddBooking = () => {
    toast({
      title: "Add booking feature",
      description: "This feature will be implemented in a future update.",
    });
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBooking) {
      const updatedBookings = bookings.filter(booking => booking.id !== selectedBooking.id);
      setBookings(updatedBookings);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Booking deleted",
        description: `Booking for ${selectedBooking.client} has been deleted.`,
      });
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Select defaultValue="all">
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
                  {filteredBookings.length > 0 ? (
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
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog - Placeholder for now */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>
              Update the booking details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client Name</Label>
                <Input 
                  id="client" 
                  defaultValue={selectedBooking?.client} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Input 
                  id="service" 
                  defaultValue={selectedBooking?.service} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  defaultValue={selectedBooking?.date} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  defaultValue={selectedBooking?.time} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                defaultValue={selectedBooking?.location} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₱)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  defaultValue={selectedBooking?.amount.toString()} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={selectedBooking?.status}>
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
          <DialogFooter>
            <Button type="submit" onClick={() => {
              setIsEditDialogOpen(false);
              toast({
                title: "Booking updated",
                description: "The booking has been successfully updated.",
              });
            }}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;
