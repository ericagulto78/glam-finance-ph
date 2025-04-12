
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useExpenses } from '@/hooks/useExpenses';
import PhilippineTaxSummary from '@/components/dashboard/PhilippineTaxSummary';
import { calculatePhilippineTax, calculatePhilippineGraduatedTax } from '@/lib/tax-calculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Taxes = () => {
  const [annualIncome, setAnnualIncome] = useState(450000);
  const { expenses } = useExpenses();

  const taxDeductibleExpenses = expenses.filter(expense => expense.tax_deductible);
  const totalTaxDeductible = taxDeductibleExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate taxes for both methods
  const flatRateTax = calculatePhilippineTax(annualIncome);
  const graduatedTax = calculatePhilippineGraduatedTax(annualIncome);
  
  // Determine which method results in lower tax
  const lowerTaxMethod = flatRateTax.taxDue <= graduatedTax.taxDue ? 'flat' : 'graduated';
  const taxSavings = Math.abs(flatRateTax.taxDue - graduatedTax.taxDue);

  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-3xl font-bold mb-6">Tax Planning</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
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
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Philippine Tax Rate Table (2023-2024)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Taxable Income Range</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead>Computation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Not over ₱250,000</TableCell>
                <TableCell>0%</TableCell>
                <TableCell>No tax</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Over ₱250,000 but not over ₱400,000</TableCell>
                <TableCell>15%</TableCell>
                <TableCell>15% of the excess over ₱250,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Over ₱400,000 but not over ₱800,000</TableCell>
                <TableCell>20%</TableCell>
                <TableCell>₱22,500 + 20% of the excess over ₱400,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Over ₱800,000 but not over ₱2,000,000</TableCell>
                <TableCell>25%</TableCell>
                <TableCell>₱102,500 + 25% of the excess over ₱800,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Over ₱2,000,000 but not over ₱8,000,000</TableCell>
                <TableCell>30%</TableCell>
                <TableCell>₱402,500 + 30% of the excess over ₱2,000,000</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Over ₱8,000,000</TableCell>
                <TableCell>35%</TableCell>
                <TableCell>₱2,202,500 + 35% of the excess over ₱8,000,000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tax Method Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comparison">
            <TabsList className="mb-4">
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="details">Method Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="comparison" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 border rounded-lg ${lowerTaxMethod === 'flat' ? 'bg-green-50 border-green-200' : ''}`}>
                  <h3 className="text-lg font-medium mb-2">8% Flat Tax Option</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Annual Income:</span>
                      <span>₱{annualIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Due:</span>
                      <span>₱{flatRateTax.taxDue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Effective Rate:</span>
                      <span>{flatRateTax.effectiveRate.toFixed(2)}%</span>
                    </div>
                  </div>
                  {lowerTaxMethod === 'flat' && (
                    <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-sm">
                      Recommended: Save ₱{taxSavings.toLocaleString()} with this method
                    </div>
                  )}
                </div>
                
                <div className={`p-4 border rounded-lg ${lowerTaxMethod === 'graduated' ? 'bg-green-50 border-green-200' : ''}`}>
                  <h3 className="text-lg font-medium mb-2">Graduated Tax Option</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Annual Income:</span>
                      <span>₱{annualIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Due:</span>
                      <span>₱{graduatedTax.taxDue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Effective Rate:</span>
                      <span>{graduatedTax.effectiveRate.toFixed(2)}%</span>
                    </div>
                  </div>
                  {lowerTaxMethod === 'graduated' && (
                    <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-sm">
                      Recommended: Save ₱{taxSavings.toLocaleString()} with this method
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                <h3 className="font-medium mb-2">Summary</h3>
                <p>
                  Based on your annual income of ₱{annualIncome.toLocaleString()}, the{' '}
                  <strong>{lowerTaxMethod === 'flat' ? '8% Flat Tax' : 'Graduated Tax'}</strong> method 
                  would save you approximately ₱{taxSavings.toLocaleString()} in taxes.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-3">8% Flat Tax Option</h3>
                <p className="mb-4">
                  The 8% tax option is available for self-employed individuals and professionals with gross 
                  annual sales or receipts not exceeding ₱3 million.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tax is computed as 8% of gross income</li>
                  <li>Income below ₱250,000 is exempt from tax</li>
                  <li>This replaces both the income tax and percentage tax</li>
                  <li>Simpler compliance - no need to file percentage tax returns</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-3">Graduated Tax Rates Option</h3>
                <p className="mb-4">
                  This option uses progressive tax rates based on income brackets, ranging from 0% to 35%.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You can deduct legitimate business expenses before computing tax</li>
                  <li>Effective tax rate may be lower if you have significant business expenses</li>
                  <li>Requires filing of percentage tax returns (unless VAT-registered)</li>
                  <li>More complex recordkeeping requirements</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Taxes;
