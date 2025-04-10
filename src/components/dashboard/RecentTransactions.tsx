
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Transaction, castTransactionData } from '@/integrations/supabase/client';

const typeIcons = {
  deposit: <ArrowDownLeft size={16} className="text-green-500" />,
  withdrawal: <ArrowUpRight size={16} className="text-red-500" />,
  transfer: <RefreshCw size={16} className="text-blue-500" />,
};

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        // Cast the data to ensure it matches our Transaction type
        const typedTransactions = data?.map(transaction => castTransactionData(transaction)) || [];
        setTransactions(typedTransactions);
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentTransactions();
    
    // Set up a subscription to transactions table
    const subscription = supabase
      .channel('transactions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions' }, 
        fetchRecentTransactions
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatAmount = (amount: number, type: string) => {
    return type === 'deposit' ? `+₱${amount.toLocaleString()}` : `-₱${amount.toLocaleString()}`;
  };
  
  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      {typeIcons[transaction.type]}
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.description}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </span>
                    <Badge variant="outline" className="mt-1">
                      {getTypeLabel(transaction.type)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">No recent transactions</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
