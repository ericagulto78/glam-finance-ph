
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { subDays, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const EarningsGraph: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Array<{ date: string; amount: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Get the date 30 days ago
        const startDate = subDays(new Date(), 30).toISOString().split('T')[0];
        
        // Fetch all paid invoices in the last 30 days
        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('amount, issue_date')
          .eq('status', 'paid')
          .gte('issue_date', startDate)
          .order('issue_date', { ascending: true });
        
        if (invoicesError) throw invoicesError;
        
        // Group by date and aggregate
        const dateMap = new Map();
        
        // Initialize the map with all dates in the last 30 days
        for (let i = 30; i >= 0; i--) {
          const date = subDays(new Date(), i).toISOString().split('T')[0];
          dateMap.set(date, 0);
        }
        
        // Add invoice amounts to their respective dates
        invoicesData?.forEach(invoice => {
          const date = invoice.issue_date;
          const currentAmount = dateMap.get(date) || 0;
          dateMap.set(date, currentAmount + invoice.amount);
        });
        
        // Convert map to array for the chart
        const chartData = Array.from(dateMap.entries()).map(([date, amount]) => ({
          date,
          amount,
          formattedDate: format(new Date(date), 'MMM dd')
        }));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEarningsData();
  }, [user]);

  const config = {
    earnings: {
      label: 'Earnings',
      theme: {
        light: 'hsl(var(--primary))',
        dark: 'hsl(var(--primary))',
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Earnings (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No earnings data available</p>
          </div>
        ) : (
          <ChartContainer config={config} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  tickFormatter={(value) => `₱${value.toLocaleString()}`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold text-foreground">
                                {format(new Date(payload[0].payload.date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Amount
                              </span>
                              <span className="font-bold text-foreground">
                                ₱{payload[0].value.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Earnings"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary)/.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EarningsGraph;
