
import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, UserCheck, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import BookingsList from '@/components/dashboard/BookingsList';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import ExpensesByCategory from '@/components/dashboard/ExpensesByCategory';
import TaxSummary from '@/components/dashboard/TaxSummary';
import EarningsGraph from '@/components/dashboard/EarningsGraph';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    upcomingBookings: 0,
    totalClients: 0
  });
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch business profile to display personalized greeting
        const { data: businessProfile } = await supabase
          .from('business_profiles')
          .select('name')
          .eq('user_id', user.id)
          .single();
          
        if (businessProfile?.name) {
          setBusinessName(businessProfile.name);
        }
        
        // Fetch total revenue (from invoices paid)
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('amount')
          .eq('status', 'paid')
          .eq('user_id', user.id);
        
        if (invoicesError) throw invoicesError;
        
        // Fetch total expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id);
        
        if (expensesError) throw expensesError;
        
        // Fetch upcoming bookings count
        const { count: upcomingCount, error: upcomingError } = await supabase
          .from('bookings')
          .select('*', { count: 'exact' })
          .eq('status', 'upcoming')
          .eq('user_id', user.id);
        
        if (upcomingError) throw upcomingError;
        
        // Fetch unique clients
        const { data: clientsData, error: clientsError } = await supabase
          .from('bookings')
          .select('client')
          .eq('user_id', user.id);
        
        if (clientsError) throw clientsError;
        
        // Calculate unique clients
        const uniqueClients = new Set(clientsData.map(booking => booking.client)).size;
        
        // Calculate total revenue from paid invoices
        const totalRevenue = invoicesData?.reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
        
        // Calculate total expenses
        const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
        
        setStats({
          totalRevenue,
          totalExpenses,
          upcomingBookings: upcomingCount || 0,
          totalClients: uniqueClients
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  // Get current time to display appropriate greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="h-full">
      <PageHeader 
        title={`${getTimeBasedGreeting()}, ${user?.email?.split('@')[0] || 'there'}!`}
        subtitle={businessName ? `Welcome to your ${businessName} dashboard` : "Welcome to your business dashboard"}
      />
      
      <div className="p-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Revenue" 
            value={`₱${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            trend={{ value: "From paid invoices", positive: true }}
          />
          <StatCard 
            title="Total Expenses" 
            value={`₱${stats.totalExpenses.toLocaleString()}`}
            icon={<TrendingUp size={20} />}
            trend={{ value: "All expenses", positive: false }}
          />
          <StatCard 
            title="Upcoming Bookings" 
            value={stats.upcomingBookings.toString()}
            icon={<Calendar size={20} />}
          />
          <StatCard 
            title="Total Clients" 
            value={stats.totalClients.toString()}
            icon={<UserCheck size={20} />}
          />
        </div>
        
        {/* New Earnings Graph Row */}
        <div className="mb-6">
          <EarningsGraph />
        </div>
        
        {/* Main content row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BookingsList />
          <RecentTransactions />
        </div>
        
        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpensesByCategory />
          <div className="relative">
            <TaxSummary />
            <div className="absolute top-6 right-6">
              <Link to="/taxes">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Calculator size={16} />
                  <span>Tax Planner</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
