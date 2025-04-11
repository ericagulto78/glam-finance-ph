
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TaxItem {
  name: string;
  amount: number;
  dueDate: string;
  progress: number;
}

// More realistic tax amounts that would make sense for a freelancer
const taxItems: TaxItem[] = [
  {
    name: 'Income Tax',
    amount: 5200,
    dueDate: '2025-04-15',
    progress: 65,
  },
  {
    name: 'VAT',
    amount: 1900,
    dueDate: '2025-04-25',
    progress: 40,
  },
  {
    name: 'Business Tax',
    amount: 1250,
    dueDate: '2025-06-30',
    progress: 25,
  },
];

const TaxSummary: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Tax Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {taxItems.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(item.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="font-medium">₱{item.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={item.progress} className="h-2" />
                <span className="text-xs font-medium w-12">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Tax Liability</span>
            <span className="font-bold text-lg">₱{taxItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSummary;
