
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Scissors, ShoppingBag, Coffee, Tag } from 'lucide-react';

// Transaction type definition
interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
  icon: React.ReactNode;
}

const transactionIcons = {
  supplies: <ShoppingBag size={16} />,
  equipment: <Scissors size={16} />,
  food: <Coffee size={16} />,
  service: <Tag size={16} />,
};

// Sample data for recent transactions
const recentTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Makeup supplies',
    amount: 1200,
    date: '2025-04-06',
    type: 'expense',
    category: 'supplies',
    icon: transactionIcons.supplies,
  },
  {
    id: '2',
    description: 'Wedding makeup service',
    amount: 5000,
    date: '2025-04-05',
    type: 'income',
    category: 'service',
    icon: transactionIcons.service,
  },
  {
    id: '3',
    description: 'Beauty equipment',
    amount: 3500,
    date: '2025-04-03',
    type: 'expense',
    category: 'equipment',
    icon: transactionIcons.equipment,
  },
  {
    id: '4',
    description: 'Lunch with client',
    amount: 850,
    date: '2025-04-02',
    type: 'expense',
    category: 'food',
    icon: transactionIcons.food,
  },
];

const RecentTransactions: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span>{new Date(transaction.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                    <div className="flex items-center">
                      <span className="bg-muted px-1.5 py-0.5 rounded flex items-center gap-1">
                        {transaction.icon}
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <span className={`font-medium ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
