
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TaxBracket {
  threshold: number;
  rate: number;
  fixedAmount: number;
  excessRate: number;
}

const PHILIPPINE_TAX_BRACKETS: TaxBracket[] = [
  { threshold: 250000, rate: 0, fixedAmount: 0, excessRate: 0 },
  { threshold: 400000, rate: 0.15, fixedAmount: 0, excessRate: 0.15 },
  { threshold: 800000, rate: 0.20, fixedAmount: 22500, excessRate: 0.20 },
  { threshold: 2000000, rate: 0.25, fixedAmount: 102500, excessRate: 0.25 },
  { threshold: 8000000, rate: 0.30, fixedAmount: 402500, excessRate: 0.30 },
  { threshold: Infinity, rate: 0.35, fixedAmount: 2202500, excessRate: 0.35 },
];

const computeTax = (annualIncome: number): number => {
  let bracket = PHILIPPINE_TAX_BRACKETS.find(
    (bracket, index, arr) => 
      annualIncome <= bracket.threshold || 
      index === arr.length - 1
  );
  
  if (!bracket) {
    bracket = PHILIPPINE_TAX_BRACKETS[PHILIPPINE_TAX_BRACKETS.length - 1];
  }
  
  const previousBracket = PHILIPPINE_TAX_BRACKETS[PHILIPPINE_TAX_BRACKETS.indexOf(bracket) - 1];
  
  if (!previousBracket) {
    return 0; // No tax for the first bracket
  }
  
  const excessIncome = annualIncome - previousBracket.threshold;
  const tax = bracket.fixedAmount + (excessIncome * bracket.excessRate);
  
  return tax;
};

interface PhilippineTaxSummaryProps {
  annualIncome?: number;
}

const PhilippineTaxSummary: React.FC<PhilippineTaxSummaryProps> = ({ 
  annualIncome = 450000 // Default annual income for freelancers
}) => {
  const annualTax = computeTax(annualIncome);
  const monthlyTax = annualTax / 12;
  const quarterlyTax = annualTax / 4;
  
  // Calculate effective tax rate
  const effectiveRate = annualIncome > 0 ? annualTax / annualIncome * 100 : 0;
  
  // Find current tax bracket
  const currentBracket = PHILIPPINE_TAX_BRACKETS.find(
    (bracket, index, arr) => 
      annualIncome <= bracket.threshold || 
      index === arr.length - 1
  );
  
  // Generate percentage of bracket filled
  const bracketProgress = () => {
    if (!currentBracket) return 0;
    
    const bracketIndex = PHILIPPINE_TAX_BRACKETS.indexOf(currentBracket);
    if (bracketIndex === 0) return 0;
    
    const previousThreshold = PHILIPPINE_TAX_BRACKETS[bracketIndex - 1].threshold;
    const bracketSize = currentBracket.threshold - previousThreshold;
    const position = annualIncome - previousThreshold;
    
    return Math.min(100, (position / bracketSize) * 100);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Philippine Tax Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Annual Income</h4>
              <span className="font-medium">₱{annualIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Tax Bracket</h4>
              <span className="font-medium">{currentBracket?.rate ? `${currentBracket.rate * 100}%` : '0%'}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Progress value={bracketProgress()} className="h-2" />
              <span className="text-xs font-medium w-12">{Math.round(bracketProgress())}%</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Annual Tax Liability</h4>
              <p className="text-2xl font-bold mt-1">₱{annualTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Effective Rate: {effectiveRate.toFixed(2)}%</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h5 className="text-sm text-muted-foreground">Quarterly Payment</h5>
                <p className="text-lg font-semibold">₱{quarterlyTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <h5 className="text-sm text-muted-foreground">Monthly Equivalent</h5>
                <p className="text-lg font-semibold">₱{monthlyTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Quarterly Deadlines</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Q1 (January - March)</span>
                <span>April 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Q2 (April - June)</span>
                <span>July 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Q3 (July - September)</span>
                <span>October 15, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Q4 (October - December)</span>
                <span>January 15, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhilippineTaxSummary;
