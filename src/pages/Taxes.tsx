
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/hooks/useExpenses';
import PhilippineTaxSummary from '@/components/dashboard/PhilippineTaxSummary';
import TaxSummary from '@/components/dashboard/TaxSummary';

const Taxes = () => {
  const [annualIncome, setAnnualIncome] = useState(450000);
  const { expenses } = useExpenses();

  const taxDeductibleExpenses = expenses.filter(expense => expense.tax_deductible);
  const totalTaxDeductible = taxDeductibleExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-3xl font-bold mb-6">Tax Planning</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Income & Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="annual-income">Annual Taxable Income (₱)</Label>
                <div className="flex mt-1">
                  <Input
                    id="annual-income"
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="mr-2"
                  />
                  <Button onClick={() => setAnnualIncome(450000)}>Reset</Button>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Tax Deductible Expenses</h3>
                <div className="space-y-2">
                  {taxDeductibleExpenses.length > 0 ? (
                    <>
                      {taxDeductibleExpenses.slice(0, 5).map((expense) => (
                        <div key={expense.id} className="flex justify-between">
                          <span>{expense.name}</span>
                          <span>₱{expense.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      {taxDeductibleExpenses.length > 5 && (
                        <div className="text-sm text-muted-foreground text-center mt-2">
                          +{taxDeductibleExpenses.length - 5} more expenses
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total Tax Deductible</span>
                        <span>₱{totalTaxDeductible.toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No tax deductible expenses found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <PhilippineTaxSummary annualIncome={annualIncome} />
      </div>
      
      <div className="mt-6">
        <TaxSummary />
      </div>
    </div>
  );
};

export default Taxes;
