
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type CategoryData = {
  name: string;
  value: number;
  color: string;
};

// Category colors
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#FF6B6B', '#747ECE', '#43AA8B', '#F28482'
];

const ExpensesByCategory: React.FC = () => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchExpensesByCategory = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('expenses')
          .select('category, amount');
          
        if (error) throw error;
        
        // Process data to group by category
        const categoryMap = new Map<string, number>();
        
        data?.forEach(expense => {
          const currentAmount = categoryMap.get(expense.category) || 0;
          categoryMap.set(expense.category, currentAmount + expense.amount);
        });
        
        // Format data for pie chart
        const chartData: CategoryData[] = Array.from(categoryMap.entries())
          .map(([name, value], index) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
            color: COLORS[index % COLORS.length]
          }))
          .sort((a, b) => b.value - a.value); // Sort by descending value
          
        setData(chartData);
      } catch (error) {
        console.error('Error fetching expenses by category:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpensesByCategory();
    
    // Set up a subscription to expenses table
    const subscription = supabase
      .channel('expenses_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'expenses' }, 
        fetchExpensesByCategory
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const formatCurrency = (value: number) => {
    return `₱${value.toLocaleString()}`;
  };
  
  const calculateTotal = () => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading expense data...</p>
          </div>
        ) : data.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(calculateTotal())}</p>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64 text-muted-foreground">
            <p>No expense data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesByCategory;
