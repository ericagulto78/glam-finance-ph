
import React from 'react';
import { Calendar, DollarSign, TrendingUp, UserCheck } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import BookingsList from '@/components/dashboard/BookingsList';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import ExpensesByCategory from '@/components/dashboard/ExpensesByCategory';
import TaxSummary from '@/components/dashboard/TaxSummary';

const Dashboard = () => {
  return (
    <div className="h-full">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back! Here's an overview of your business finances and bookings."
      />
      
      <div className="p-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total Revenue" 
            value="₱48,500"
            icon={<DollarSign size={20} />}
            trend={{ value: "12% from last month", positive: true }}
          />
          <StatCard 
            title="Total Expenses" 
            value="₱18,200"
            icon={<TrendingUp size={20} />}
            trend={{ value: "5% from last month", positive: false }}
          />
          <StatCard 
            title="Upcoming Bookings" 
            value="12"
            icon={<Calendar size={20} />}
          />
          <StatCard 
            title="Total Clients" 
            value="32"
            icon={<UserCheck size={20} />}
            trend={{ value: "3 new this month", positive: true }}
          />
        </div>
        
        {/* Main content row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BookingsList />
          <RecentTransactions />
        </div>
        
        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpensesByCategory />
          <TaxSummary />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
