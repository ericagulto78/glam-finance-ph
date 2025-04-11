
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Booking, castBooking } from '@/integrations/supabase/client';

// Define the status types and colors
const statusColors = {
  upcoming: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const BookingsList: React.FC = () => {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('status', 'upcoming')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(3);
          
        if (error) throw error;
        
        // Cast the data to ensure it matches our Booking type
        const typedBookings = data?.map(booking => castBooking(booking)) || [];
        setUpcomingBookings(typedBookings);
      } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUpcomingBookings();
  }, [user]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading bookings...</div>
          ) : upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
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
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">No upcoming bookings</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsList;
