
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <Card className={cn("overflow-hidden border-none shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-xs font-semibold text-gray-600 tracking-wider">{title}</h4>
            <p className="text-2xl font-bold mt-1.5 font-serif tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <span className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-emerald-600" : "text-rose-600"
                )}>
                  {trend.positive ? '↑' : '↓'} {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-accent/30 text-accent-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
