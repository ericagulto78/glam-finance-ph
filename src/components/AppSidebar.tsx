import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Receipt,
  TrendingDown,
  Wallet,
  ListTodo
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AppSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: 'Bookings', 
      path: '/bookings', 
      icon: <Calendar size={20} /> 
    },
    { 
      name: 'Service Types', 
      path: '/service-types', 
      icon: <ListTodo size={20} /> 
    },
    { 
      name: 'Invoices', 
      path: '/invoices', 
      icon: <Receipt size={20} /> 
    },
    { 
      name: 'Expenses', 
      path: '/expenses', 
      icon: <TrendingDown size={20} /> 
    },
    { 
      name: 'Bank Accounts', 
      path: '/bank-accounts', 
      icon: <Wallet size={20} /> 
    },
  ];

  return (
    <div className="flex flex-col h-full py-4">
      <div className="px-3 py-2 text-center">
        <h1 className="text-lg font-semibold">Business Manager</h1>
      </div>
      <div className="space-y-1 mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-x-2 py-2 px-3 font-medium text-sm hover:bg-accent hover:text-accent-foreground",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AppSidebar;
