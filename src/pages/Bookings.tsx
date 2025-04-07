
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, User, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [bookings] = useState<Booking[]>(BOOKINGS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleAddBooking = () => {
    toast({
      title: "Add booking feature",
      description: "This feature will be implemented in a future update.",
    });
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
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
    </div>
  );
};

export default Bookings;
