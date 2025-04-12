
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePhilippineTax, calculatePhilippineGraduatedTax } from '@/lib/tax-calculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PhilippineTaxSummaryProps {
  annualIncome: number;
}

const PhilippineTaxSummary: React.FC<PhilippineTaxSummaryProps> = ({ annualIncome }) => {
  // Calculate tax using 8% flat rate
  const { taxDue: flatTaxDue, effectiveRate: flatEffectiveRate, isExempt: flatIsExempt } = calculatePhilippineTax(annualIncome);
  
  // Calculate tax using graduated rates
  const { taxDue: gradTaxDue, effectiveRate: gradEffectiveRate, isExempt: gradIsExempt } = calculatePhilippineGraduatedTax(annualIncome);
  
  // Determine which method results in lower tax
  const lowerTaxMethod = flatTaxDue <= gradTaxDue ? 'flat' : 'graduated';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Philippine Tax Calculation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compare" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="compare">Compare Options</TabsTrigger>
            <TabsTrigger value="flat">8% Flat Rate</TabsTrigger>
            <TabsTrigger value="graduated">Graduated Rates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compare" className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
              <p className="text-2xl font-bold">₱{annualIncome.toLocaleString()}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className={`p-4 rounded-lg ${lowerTaxMethod === 'flat' ? 'bg-green-50 border border-green-200' : ''}`}>
                <h3 className="font-medium mb-2">8% Flat Rate Option</h3>
                <p className="text-lg font-bold">₱{flatTaxDue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Effective rate: {flatEffectiveRate.toFixed(2)}%</p>
                {lowerTaxMethod === 'flat' && (
                  <p className="text-sm font-medium text-green-600 mt-2">Recommended (Lower Tax)</p>
                )}
              </div>
              
              <div className={`p-4 rounded-lg ${lowerTaxMethod === 'graduated' ? 'bg-green-50 border border-green-200' : ''}`}>
                <h3 className="font-medium mb-2">Graduated Rates Option</h3>
                <p className="text-lg font-bold">₱{gradTaxDue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Effective rate: {gradEffectiveRate.toFixed(2)}%</p>
                {lowerTaxMethod === 'graduated' && (
                  <p className="text-sm font-medium text-green-600 mt-2">Recommended (Lower Tax)</p>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                You could save ₱{Math.abs(flatTaxDue - gradTaxDue).toLocaleString()} by choosing the {lowerTaxMethod === 'flat' ? '8% flat rate' : 'graduated rates'} method.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="flat" className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
              <p className="text-2xl font-bold">₱{annualIncome.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tax Due (8% Flat Rate)</p>
              <p className="text-2xl font-bold">₱{flatTaxDue.toLocaleString()}</p>
              {flatIsExempt && (
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
                <p className="text-sm">{flatEffectiveRate.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                For freelancers with gross annual sales/receipts not exceeding PHP 3,000,000, you may opt for the 8% flat income tax in lieu of graduated rates and percentage tax. Income not exceeding PHP 250,000 is tax exempt.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="graduated" className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
              <p className="text-2xl font-bold">₱{annualIncome.toLocaleString()}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tax Due (Graduated Rates)</p>
              <p className="text-2xl font-bold">₱{gradTaxDue.toLocaleString()}</p>
              {gradIsExempt && (
                <p className="text-sm font-medium text-green-600 mt-1">
                  No tax due (Income below ₱250,000 threshold)
                </p>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Tax Bracket</p>
                <p className="text-sm">{getTaxBracket(annualIncome)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Effective Tax Rate</p>
                <p className="text-sm">{gradEffectiveRate.toFixed(2)}%</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                The graduated tax rates apply based on your income bracket. Income not exceeding PHP 250,000 is tax exempt. After that, rates range from 15% to 35% depending on your income level.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

function getTaxBracket(income: number): string {
  if (income <= 250000) return "0%";
  if (income <= 400000) return "15%";
  if (income <= 800000) return "20%";
  if (income <= 2000000) return "25%";
  if (income <= 8000000) return "30%";
  return "35%";
}

export default PhilippineTaxSummary;
