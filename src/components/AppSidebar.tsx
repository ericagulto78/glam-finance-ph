
import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Receipt,
  TrendingDown,
  Wallet,
  ListTodo,
  Users,
  Settings
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Role-based menu items
  const getMenuItemsByRole = (role: UserRole) => {
    const baseMenuItems = [
      { 
        name: 'Dashboard', 
        path: '/', 
        icon: <LayoutDashboard size={20} />,
        minRole: 'client' as UserRole
      },
      { 
        name: 'Bookings', 
        path: '/bookings', 
        icon: <Calendar size={20} />,
        minRole: 'client' as UserRole
      },
    ];
    
    const adminMenuItems = [
      { 
        name: 'Service Types', 
        path: '/service-types', 
        icon: <ListTodo size={20} />,
        minRole: 'team_member' as UserRole
      },
      { 
        name: 'Invoices', 
        path: '/invoices', 
        icon: <Receipt size={20} />,
        minRole: 'team_member' as UserRole
      },
      { 
        name: 'Expenses', 
        path: '/expenses', 
        icon: <TrendingDown size={20} />,
        minRole: 'team_member' as UserRole
      },
      { 
        name: 'Bank Accounts', 
        path: '/bank-accounts', 
        icon: <Wallet size={20} />,
        minRole: 'studio_admin' as UserRole
      },
      { 
        name: 'User Management', 
        path: '/admin/users', 
        icon: <Users size={20} />,
        minRole: 'studio_admin' as UserRole
      },
      { 
        name: 'Settings', 
        path: '/settings', 
        icon: <Settings size={20} />,
        minRole: 'studio_admin' as UserRole
      },
    ];

    // Define role hierarchy for permission checks
    const roleHierarchy: Record<UserRole, number> = {
      'client': 0,
      'team_member': 1,
      'studio_admin': 2,
      'super_administrator': 3
    };

    // Filter menu items based on user role
    return [...baseMenuItems, ...adminMenuItems].filter(
      item => roleHierarchy[role] >= roleHierarchy[item.minRole]
    );
  };

  const menuItems = getMenuItemsByRole(userRole);

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
