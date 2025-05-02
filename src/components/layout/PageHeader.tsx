
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 px-6 border-b mb-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden mr-2" />
        {icon && <div className="mr-2">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </div>
      </div>
      {action && (
        <Button 
          onClick={action.onClick} 
          className="mt-4 md:mt-0"
        >
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
