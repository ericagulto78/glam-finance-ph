
import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, TrendingUp, UserCheck, Calculator, CircleDollarSign, ChartLine } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, subMonths, startOfYear } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    upcomingBookings: 0,
    totalClients: 0,
    ytdGross: 0,
    ytdNet: 0,
    currentMonthEarnings: 0,
    previousMonthEarnings: 0
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
        
        // Get current date info for filtering
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPreviousMonth = subMonths(startOfCurrentMonth, 1);
        const endOfPreviousMonth = new Date(startOfCurrentMonth.getTime() - 1);
        const startOfYearDate = startOfYear(now);
        
        const currentMonthStr = format(startOfCurrentMonth, 'yyyy-MM-dd');
        const previousMonthStartStr = format(startOfPreviousMonth, 'yyyy-MM-dd');
        const previousMonthEndStr = format(endOfPreviousMonth, 'yyyy-MM-dd');
        const startOfYearStr = format(startOfYearDate, 'yyyy-MM-dd');
        
        // Fetch total revenue (from invoices paid)
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('amount, issue_date')
          .eq('status', 'paid')
          .eq('user_id', user.id);
        
        if (invoicesError) throw invoicesError;
        
        // Fetch total expenses
        const { data: expensesData, error: expensesError } = await supabase
          .from('expenses')
          .select('amount, date')
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
        
        // Calculate YTD gross revenue
        const ytdGross = invoicesData
          ?.filter(invoice => invoice.issue_date >= startOfYearStr)
          .reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
        
        // Calculate YTD expenses
        const ytdExpenses = expensesData
          ?.filter(expense => expense.date >= startOfYearStr)
          .reduce((sum, expense) => sum + expense.amount, 0) || 0;
        
        // Calculate YTD net earnings
        const ytdNet = ytdGross - ytdExpenses;
        
        // Calculate current month earnings
        const currentMonthRevenue = invoicesData
          ?.filter(invoice => invoice.issue_date >= currentMonthStr)
          .reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
        
        const currentMonthExpenses = expensesData
          ?.filter(expense => expense.date >= currentMonthStr)
          .reduce((sum, expense) => sum + expense.amount, 0) || 0;
        
        const currentMonthEarnings = currentMonthRevenue - currentMonthExpenses;
        
        // Calculate previous month earnings
        const previousMonthRevenue = invoicesData
          ?.filter(invoice => 
            invoice.issue_date >= previousMonthStartStr && 
            invoice.issue_date <= previousMonthEndStr)
          .reduce((sum, invoice) => sum + invoice.amount, 0) || 0;
        
        const previousMonthExpenses = expensesData
          ?.filter(expense => 
            expense.date >= previousMonthStartStr && 
            expense.date <= previousMonthEndStr)
          .reduce((sum, expense) => sum + expense.amount, 0) || 0;
        
        const previousMonthEarnings = previousMonthRevenue - previousMonthExpenses;
        
        // Calculate total expenses
        const totalExpenses = expensesData?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
        
        setStats({
          totalRevenue,
          totalExpenses,
          upcomingBookings: upcomingCount || 0,
          totalClients: uniqueClients,
          ytdGross,
          ytdNet,
          currentMonthEarnings,
          previousMonthEarnings
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
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
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
            title="TOTAL REVENUE" 
            value={`₱${stats.totalRevenue.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            trend={{ value: "From paid invoices", positive: true }}
            className="bg-gradient-to-br from-rose-50 to-white"
          />
          <StatCard 
            title="TOTAL EXPENSES" 
            value={`₱${stats.totalExpenses.toLocaleString()}`}
            icon={<TrendingUp size={20} />}
            trend={{ value: "All expenses", positive: false }}
            className="bg-gradient-to-br from-blue-50 to-white"
          />
          <StatCard 
            title="UPCOMING BOOKINGS" 
            value={stats.upcomingBookings.toString()}
            icon={<Calendar size={20} />}
            className="bg-gradient-to-br from-amber-50 to-white"
          />
          <StatCard 
            title="TOTAL CLIENTS" 
            value={stats.totalClients.toString()}
            icon={<UserCheck size={20} />}
            className="bg-gradient-to-br from-emerald-50 to-white"
          />
        </div>
        
        {/* Earnings Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-violet-50 to-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase">YTD GROSS EARNINGS</h3>
                  <p className="text-2xl font-bold tracking-tight mt-1 font-serif">₱{stats.ytdGross.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Year to date revenue</p>
                </div>
                <div className="p-3 rounded-full bg-violet-100 text-violet-600">
                  <CircleDollarSign size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-50 to-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase">YTD NET EARNINGS</h3>
                  <p className="text-2xl font-bold tracking-tight mt-1 font-serif">₱{stats.ytdNet.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">After expenses</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <ChartLine size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-50 to-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase">CURRENT MONTH</h3>
                  <p className="text-2xl font-bold tracking-tight mt-1 font-serif">₱{stats.currentMonthEarnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(), 'MMMM yyyy')}</p>
                </div>
                <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
                  <CircleDollarSign size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase">PREVIOUS MONTH</h3>
                  <p className="text-2xl font-bold tracking-tight mt-1 font-serif">₱{stats.previousMonthEarnings.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{format(subMonths(new Date(), 1), 'MMMM yyyy')}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <CircleDollarSign size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
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
                <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white hover:bg-gray-50">
                  <Calculator size={16} />
                  <span className="font-medium">Tax Planner</span>
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
