
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { calculatePhilippineTax } from '@/lib/tax-calculations';

const TaxSummary: React.FC = () => {
  // Use more realistic income values that would make sense for a freelancer
  const annualIncome = 450000; // Estimated annual income
  const { taxDue, isExempt } = calculatePhilippineTax(annualIncome);
  
  // Only show tax items if not exempt
  const taxItems = !isExempt ? [
    {
      name: 'Income Tax (8% Flat Rate)',
      amount: taxDue,
      dueDate: '2025-04-15',
      progress: 65,
    },
    {
      name: 'Business Tax',
      amount: 1250,
      dueDate: '2025-06-30',
      progress: 25,
    },
  ] : [];

  const totalTaxLiability = taxItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Tax Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isExempt ? (
          <div className="py-8 text-center">
            <h3 className="text-lg font-medium text-green-600 mb-2">Tax Exempt</h3>
            <p className="text-muted-foreground">
              Your estimated annual income is below ₱250,000, making you exempt from income tax under the 8% flat rate option.
            </p>
          </div>
        ) : (
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
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Tax Liability</span>
                <span className="font-bold text-lg">₱{totalTaxLiability.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxSummary;
