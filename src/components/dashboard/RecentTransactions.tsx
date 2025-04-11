import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { supabase, Transaction, castTransaction } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        const typedTransactions = data?.map(transaction => castTransaction(transaction)) || [];
        setTransactions(typedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading transactions...</div>
        ) : transactions.length > 0 ? (
          <ul className="space-y-3">
            {transactions.map((transaction) => (
              <li key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {transaction.type === 'deposit' ? (
                    <ArrowUp size={16} className="text-green-500" />
                  ) : (
                    <ArrowDown size={16} className="text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="font-medium">
                  {transaction.type === 'deposit' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-muted-foreground">No recent transactions</div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
