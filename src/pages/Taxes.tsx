
import React, { useState } from 'react';
import { Calculator, PieChart, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Philippine Tax Constants
const VAT_RATE = 0.12; // 12%
const INCOME_TAX_RATES = [
  { bracket: 250000, rate: 0 },    // 0% for first 250,000
  { bracket: 400000, rate: 0.20 }, // 20% for 250,001 to 400,000
  { bracket: 800000, rate: 0.25 }, // 25% for 400,001 to 800,000
  { bracket: 2000000, rate: 0.30 }, // 30% for 800,001 to 2,000,000
  { bracket: 8000000, rate: 0.32 }, // 32% for 2,000,001 to 8,000,000
  { bracket: Infinity, rate: 0.35 }, // 35% for over 8,000,000
];

interface TaxDeadline {
  description: string;
  deadline: string;
  form: string;
}

const TAX_DEADLINES: TaxDeadline[] = [
  {
    description: "Annual Income Tax",
    deadline: "2025-04-15",
    form: "BIR Form 1701",
  },
  {
    description: "Q1 Percentage Tax",
    deadline: "2025-04-25", 
    form: "BIR Form 2551Q",
  },
  {
    description: "Q1 VAT",
    deadline: "2025-04-25",
    form: "BIR Form 2550Q",
  },
  {
    description: "April Monthly VAT",
    deadline: "2025-05-20",
    form: "BIR Form 2550M",
  },
  {
    description: "Q2 Income Tax",
    deadline: "2025-07-15",
    form: "BIR Form 1701Q",
  },
];

const transactionTypes = [
  { name: 'Revenue', amount: 48500, icon: '📈' },
  { name: 'Expenses', amount: 18200, icon: '📉' },
  { name: 'Net Income', amount: 30300, icon: '💰' },
  { name: 'VAT Payable', amount: 5820, icon: '💲' },
];

const Taxes = () => {
  const [activeTab, setActiveTab] = useState('summary');
  const { toast } = useToast();

  const handleCalculateTax = () => {
    toast({
      title: "Tax Calculator",
      description: "The tax calculator feature will be implemented in a future update.",
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <div className="h-full">
      <PageHeader 
        title="Taxes" 
        subtitle="Philippine tax management and computations"
        action={{
          label: "Calculate Taxes",
          onClick: handleCalculateTax,
          icon: <Calculator size={16} />,
        }}
      />
      
      <div className="p-6">
        <Tabs defaultValue="summary" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
            <TabsTrigger value="calculator">Tax Calculator</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {transactionTypes.map(item => (
                <Card key={item.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
                        <h3 className="text-2xl font-bold mt-1">₱{item.amount.toLocaleString()}</h3>
                      </div>
                      <div className="text-3xl">{item.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Breakdown</CardTitle>
                  <CardDescription>
                    Based on current Philippine tax regulations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Income Tax</h4>
                        <span className="font-medium">₱3,960</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={65} className="h-2" />
                        <span className="text-xs font-medium w-8">65%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">VAT</h4>
                        <span className="font-medium">₱5,820</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={100} className="h-2" />
                        <span className="text-xs font-medium w-8">100%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Business Tax</h4>
                        <span className="font-medium">₱970</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress value={25} className="h-2" />
                        <span className="text-xs font-medium w-8">25%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Tax Liability</span>
                      <span className="font-bold text-lg">₱10,750</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estimated Quarterly Taxes</CardTitle>
                  <CardDescription>
                    For planning your tax payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">2025 Q1</span>
                      <span className="text-xl font-bold">₱4,300</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">2025 Q2</span>
                      <span className="text-xl font-bold">₱3,800</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">2025 Q3</span>
                      <span className="text-xl font-bold">₱5,200</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">2025 Q4</span>
                      <span className="text-xl font-bold">₱6,100</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <PieChart className="h-32 w-32 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="deadlines" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tax Deadlines</CardTitle>
                <CardDescription>
                  Based on BIR calendar for 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Type</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Form</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TAX_DEADLINES.map((item) => {
                      const daysRemaining = getDaysRemaining(item.deadline);
                      let status;
                      
                      if (daysRemaining < 0) {
                        status = <Badge variant="destructive">Overdue</Badge>;
                      } else if (daysRemaining <= 7) {
                        status = <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Due Soon</Badge>;
                      } else {
                        status = <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{daysRemaining} days left</Badge>;
                      }
                      
                      return (
                        <TableRow key={item.form}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>
                            {new Date(item.deadline).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>{item.form}</TableCell>
                          <TableCell>{status}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Philippine Tax Calculator</CardTitle>
                <CardDescription>
                  Calculate your tax liability based on Philippine tax laws
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/30">
                  <Calculator className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Tax Calculator Coming Soon</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Our Philippine tax calculator feature is currently under development.
                    It will include computations for income tax, VAT, percentage tax, and other BIR requirements.
                  </p>
                  <Button className="mt-6" onClick={handleCalculateTax}>
                    Notify Me When Available
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg bg-accent/10">
                  <h4 className="font-medium mb-2">Philippine Tax Rates at a Glance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium mb-1">Income Tax</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>0% on first ₱250,000</li>
                        <li>20% on ₱250,001 to ₱400,000</li>
                        <li>25% on ₱400,001 to ₱800,000</li>
                        <li>30% on ₱800,001 to ₱2,000,000</li>
                        <li>32% on ₱2,000,001 to ₱8,000,000</li>
                        <li>35% on over ₱8,000,000</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Other Taxes</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>VAT: 12% on taxable sales</li>
                        <li>Percentage Tax: 3% for non-VAT entities</li>
                        <li>Business Tax: Varies by LGU</li>
                        <li>Withholding Tax: Varies by payment type</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Taxes;
