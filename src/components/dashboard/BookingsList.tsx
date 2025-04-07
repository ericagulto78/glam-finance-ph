
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Calendar } from 'lucide-react';

// Define the status types and colors
const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

// Booking type definition
interface Booking {
  id: string;
  client: string;
  date: string;
  time: string;
  service: string;
  status: keyof typeof statusColors;
  amount: number;
}

// Sample data for upcoming bookings
const upcomingBookings: Booking[] = [
  {
    id: '1',
    client: 'Sophia Rivera',
    date: '2025-04-10',
    time: '10:00 AM',
    service: 'Bridal Makeup',
    status: 'upcoming',
    amount: 5000,
  },
  {
    id: '2',
    client: 'Isabella Cruz',
    date: '2025-04-12',
    time: '2:30 PM',
    service: 'Special Event Makeup',
    status: 'upcoming',
    amount: 3500,
  },
  {
    id: '3',
    client: 'Mia Santos',
    date: '2025-04-15',
    time: '9:00 AM',
    service: 'Engagement Photoshoot',
    status: 'upcoming',
    amount: 4200,
  },
];

const BookingsList: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded-lg hover:bg-accent/10 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{booking.client}</h4>
                    <p className="text-sm text-muted-foreground">{booking.service}</p>
                  </div>
                </div>
                <Badge className={statusColors[booking.status]}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar size={14} className="text-muted-foreground" />
                  <span>{new Date(booking.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock size={14} className="text-muted-foreground" />
                  <span>{booking.time}</span>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="font-medium">₱{booking.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsList;
