
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, DollarSign, FileText, Settings, PieChart, CircleUser, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Bookings",
    path: "/bookings",
    icon: Calendar,
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: DollarSign,
  },
  {
    title: "Invoices",
    path: "/invoices",
    icon: FileText,
  },
  {
    title: "Taxes",
    path: "/taxes",
    icon: PieChart,
  },
  {
    title: "Bank Accounts",
    path: "/bank-accounts",
    icon: CreditCard,
  }
];

const accountNavItems = [
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  }
];

const AppSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.path ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={location.pathname === item.path ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-3">
            <CircleUser size={24} className="text-gray-500" />
            <div>
              <p className="text-sm font-medium">
                {user?.email ? user.email.split('@')[0] : 'Makeup Artist'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email || 'manager@example.com'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={signOut}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
