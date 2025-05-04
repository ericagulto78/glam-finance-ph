
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import UserProfile from '@/components/UserProfile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="p-4 border-b flex justify-end">
            <UserProfile />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
