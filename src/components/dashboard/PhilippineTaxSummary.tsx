
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePhilippineTax } from '@/lib/tax-calculations';

interface PhilippineTaxSummaryProps {
  annualIncome: number;
}

const PhilippineTaxSummary: React.FC<PhilippineTaxSummaryProps> = ({ annualIncome }) => {
  // Calculate tax details using the 8% flat tax rate
  const taxExemptThreshold = 250000; // PHP 250,000
  const flatTaxRate = 0.08; // 8%
  
  // Calculate tax using 8% flat rate
  let taxDue = 0;
  let effectiveRate = 0;
  
  if (annualIncome > taxExemptThreshold) {
    taxDue = annualIncome * flatTaxRate;
    effectiveRate = (taxDue / annualIncome) * 100;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Philippine Tax Summary (8% Flat Rate)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
            <p className="text-2xl font-bold">₱{annualIncome.toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tax Due</p>
            <p className="text-2xl font-bold">₱{taxDue.toLocaleString()}</p>
            {annualIncome <= taxExemptThreshold && (
              <p className="text-sm font-medium text-green-600 mt-1">
                No tax due (Income below ₱250,000 threshold)
              </p>
            )}
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Flat Tax Rate</p>
              <p className="text-sm">8%</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Effective Tax Rate</p>
              <p className="text-sm">{effectiveRate.toFixed(2)}%</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              For freelancers with gross annual sales/receipts not exceeding PHP 3,000,000, you may opt for the 8% flat income tax in lieu of graduated rates and percentage tax. Income not exceeding PHP 250,000 is tax exempt.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhilippineTaxSummary;
