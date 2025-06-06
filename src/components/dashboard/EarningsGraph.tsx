import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { addDays, subDays, format } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const formatCurrency = (value: number) => {
  return `₱${value.toLocaleString()}`;
};

type EarningsData = {
  date: string;
  revenue: number;
  expenses?: number;
};

const EarningsGraph = () => {
  const [data, setData] = useState<EarningsData[]>([]);
  const [timeframe, setTimeframe] = useState<'30days' | '90days' | '12months'>('30days');
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData(timeframe);
  }, [timeframe]);

  const fetchData = async (period: '30days' | '90days' | '12months') => {
    setIsLoading(true);
    
    try {
      let startDate: Date;
      let endDate = new Date();
      let dateFormat: string;
      let groupBy: string;
      
      // Set date ranges and formats based on selected timeframe
      if (period === '30days') {
        startDate = subDays(new Date(), 30);
        dateFormat = 'MMM dd';
        groupBy = 'day';
      } else if (period === '90days') {
        startDate = subDays(new Date(), 90);
        dateFormat = 'MMM dd';
        groupBy = 'week';
      } else {
        startDate = subDays(new Date(), 365);
        dateFormat = 'MMM yyyy';
        groupBy = 'month';
      }
      
      // Convert dates to strings for querying
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Fetch paid invoices for revenue data
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('amount, issue_date')
        .eq('status', 'paid')
        .gte('issue_date', startDateStr)
        .lte('issue_date', endDateStr)
        .order('issue_date', { ascending: true });
      
      if (invoiceError) throw invoiceError;
      
      // Fetch expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('amount, date')
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true });
      
      if (expenseError) throw expenseError;
      
      // Initialize data points for each date in the range
      const dataPoints: Record<string, EarningsData> = {};
      let currentDate = startDate;
      
      while (currentDate <= endDate) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        const formattedDate = format(currentDate, dateFormat);
        
        dataPoints[dateKey] = {
          date: formattedDate,
          revenue: 0,
          expenses: 0
        };
        
        currentDate = addDays(currentDate, 1);
      }
      
      // Aggregate invoice data
      invoiceData?.forEach(invoice => {
        const dateKey = invoice.issue_date;
        if (dataPoints[dateKey]) {
          dataPoints[dateKey].revenue += invoice.amount;
        }
      });
      
      // Aggregate expense data
      expenseData?.forEach(expense => {
        const dateKey = expense.date;
        if (dataPoints[dateKey]) {
          dataPoints[dateKey].expenses = (dataPoints[dateKey].expenses || 0) + expense.amount;
        }
      });
      
      // Convert to array and consolidate by time period if needed
      let formattedData: EarningsData[] = Object.values(dataPoints);
      
      // Consolidate data if grouping by week or month
      if (groupBy === 'week' || groupBy === 'month') {
        const consolidated: Record<string, EarningsData> = {};
        
        formattedData.forEach(item => {
          const date = new Date(item.date);
          let key;
          
          if (groupBy === 'week') {
            // Group by week (use the first day of the week)
            const weekStart = date.getDate() - date.getDay();
            const weekKey = format(new Date(date.setDate(weekStart)), 'MMM dd');
            key = weekKey;
          } else {
            // Group by month
            key = format(date, 'MMM yyyy');
          }
          
          if (!consolidated[key]) {
            consolidated[key] = {
              date: key,
              revenue: 0,
              expenses: 0
            };
          }
          
          consolidated[key].revenue += item.revenue;
          consolidated[key].expenses = (consolidated[key].expenses || 0) + (item.expenses || 0);
        });
        
        formattedData = Object.values(consolidated);
      }
      
      // Calculate total earnings
      const totalEarnings = formattedData.reduce((sum, item) => sum + item.revenue, 0);
      setTotal(totalEarnings);
      
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching earnings data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Chart config for styling
  const chartConfig = {
    revenue: {
      label: 'Revenue',
      theme: {
        light: 'rgba(124, 58, 237, 0.8)',
        dark: 'rgba(124, 58, 237, 0.9)'
      }
    },
    expenses: {
      label: 'Expenses',
      theme: {
        light: 'rgba(239, 68, 68, 0.7)',
        dark: 'rgba(239, 68, 68, 0.8)'
      }
    }
  };

  return (
    <Card className="col-span-4 overflow-hidden border-none shadow-md bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <div>
          <CardTitle className="text-xl font-serif uppercase tracking-tight">EARNINGS OVERVIEW</CardTitle>
          <CardDescription className="font-medium text-gray-500">
            {timeframe === '30days' ? 'Last 30 days' : 
             timeframe === '90days' ? 'Last 90 days' : 'Last 12 months'} revenue
          </CardDescription>
        </div>
        <Select
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as '30days' | '90days' | '12months')}
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6 h-80">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading data...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p>No earnings data available for this period</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-full">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                width={80}
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent 
                        active={active} 
                        payload={payload} 
                        label={label} 
                        nameKey="dataKey"
                      />
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  paddingBottom: 20
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue" 
                stroke="rgba(124, 58, 237, 0.8)" 
                fill="url(#colorRevenue)"
                fillOpacity={0.3}
                activeDot={{ r: 6, strokeWidth: 0 }}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                name="Expenses" 
                stroke="rgba(239, 68, 68, 0.7)" 
                fill="url(#colorExpenses)"
                fillOpacity={0.3}
                activeDot={{ r: 6, strokeWidth: 0 }}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t px-6 py-4 bg-gray-50/50">
        <div>
          <p className="text-muted-foreground text-xs uppercase font-semibold">TOTAL REVENUE</p>
          <p className="text-2xl font-bold font-serif">₱{total.toLocaleString()}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EarningsGraph;
