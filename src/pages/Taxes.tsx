
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BadgePlus, Printer, Calculator, FileText, TrendingUp, Search, Download, ChartBar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '@/components/dashboard/StatCard';

const Taxes = () => {
  const [taxes, setTaxes] = useState([
    { id: '1', name: 'Income Tax', rate: 0.15, type: 'Income' },
    { id: '2', name: 'VAT', rate: 0.12, type: 'Sales' },
    { id: '3', name: 'Business Tax', rate: 0.03, type: 'Business' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [taxableExpenses, setTaxableExpenses] = useState(0);
  const [estimatedTaxes, setEstimatedTaxes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Tax period data (monthly breakdown)
  const [taxData, setTaxData] = useState([
    { month: 'Jan', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Feb', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Mar', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Apr', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'May', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Jun', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Jul', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Aug', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Sep', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Oct', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Nov', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
    { month: 'Dec', income: 0, expenses: 0, deductions: 0, taxDue: 0 },
  ]);

  useEffect(() => {
    if (user) {
      fetchTaxData();
    }
  }, [user]);

  const fetchTaxData = async () => {
    setIsLoading(true);
    try {
      // Fetch bookings (income)
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*');
      
      if (bookingsError) throw bookingsError;
      
      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*');
      
      if (expensesError) throw expensesError;
      
      // Calculate taxable income (all bookings)
      const totalIncome = bookingsData.reduce((sum, booking) => sum + (booking.amount || 0), 0);
      
      // Calculate tax deductible expenses
      const totalDeductibleExpenses = expensesData
        .filter(expense => expense.tax_deductible)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
      // Estimate taxes (simple calculation - 15% of (income - deductible expenses))
      const taxableAmount = Math.max(0, totalIncome - totalDeductibleExpenses);
      const estimatedTax = taxableAmount * 0.15; // 15% tax rate for simplicity
      
      setTaxableIncome(totalIncome);
      setTaxableExpenses(totalDeductibleExpenses);
      setEstimatedTaxes(estimatedTax);
      
      // Process monthly data
      const monthlyData = [...taxData];
      
      // Process income by month
      bookingsData.forEach(booking => {
        const bookingDate = new Date(booking.date);
        const monthIndex = bookingDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].income += booking.amount || 0;
        }
      });
      
      // Process expenses by month
      expensesData.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const monthIndex = expenseDate.getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex].expenses += expense.amount || 0;
          if (expense.tax_deductible) {
            monthlyData[monthIndex].deductions += expense.amount || 0;
          }
        }
      });
      
      // Calculate tax due for each month (15% of income - deductions)
      monthlyData.forEach(month => {
        month.taxDue = Math.max(0, (month.income - month.deductions) * 0.15);
      });
      
      setTaxData(monthlyData);
    } catch (error: any) {
      console.error('Error fetching tax data:', error);
      toast({
        title: "Error loading tax data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTax = () => {
    toast({
      title: "Add tax feature",
      description: "This feature will be implemented in a future update.",
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download report",
      description: "This feature will be implemented in a future update.",
    });
  };

  const filteredTaxes = taxes.filter(tax =>
    tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      <PageHeader
        title="Taxes"
        subtitle="Manage tax rates and generate reports"
        action={{
          label: "Generate Report",
          onClick: handlePrintReport,
          icon: <Printer size={16} />,
        }}
      />

      <div className="p-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="rates">Tax Rates</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Tax Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Taxable Income" 
                value={`₱${taxableIncome.toLocaleString()}`}
                icon={<TrendingUp size={20} />}
                trend={{ value: "Year to date", positive: true }}
              />
              <StatCard 
                title="Tax Deductions" 
                value={`₱${taxableExpenses.toLocaleString()}`}
                icon={<Calculator size={20} />}
                trend={{ value: "Deductible expenses", positive: true }}
              />
              <StatCard 
                title="Estimated Taxes" 
                value={`₱${estimatedTaxes.toLocaleString()}`}
                icon={<FileText size={20} />}
                trend={{ value: "15% tax rate", positive: false }}
              />
            </div>

            {/* Tax Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Summary Chart</CardTitle>
                <CardDescription>
                  Monthly breakdown of income, expenses, and estimated taxes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={taxData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₱${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Bar name="Income" dataKey="income" fill="#4ade80" />
                      <Bar name="Expenses" dataKey="expenses" fill="#f87171" />
                      <Bar name="Tax Due" dataKey="taxDue" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tax Liability Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Tax Summary</CardTitle>
                <CardDescription>
                  Breakdown of monthly income, expenses, and tax liability
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Income</TableHead>
                        <TableHead className="text-right">Expenses</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                        <TableHead className="text-right">Tax Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {taxData.map((month, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{month.month}</TableCell>
                          <TableCell className="text-right">₱{month.income.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₱{month.expenses.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₱{month.deductions.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₱{month.taxDue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-medium">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">
                          ₱{taxData.reduce((sum, month) => sum + month.income, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱{taxData.reduce((sum, month) => sum + month.expenses, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱{taxData.reduce((sum, month) => sum + month.deductions, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ₱{taxData.reduce((sum, month) => sum + month.taxDue, 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rates">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tax Management</CardTitle>
                <CardDescription>
                  Configure and manage different tax rates for your business.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search taxes..."
                      className="pl-9 w-full md:w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full md:w-[140px]">
                        <ChartBar size={16} className="mr-2" />
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Income">Income</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="flex-1 md:flex-none" onClick={handleAddTax}>
                      <BadgePlus size={16} className="mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Rates</CardTitle>
                <CardDescription>
                  View and manage current tax rates applied to your products and services.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTaxes.length > 0 ? (
                        filteredTaxes.map((tax) => (
                          <TableRow key={tax.id}>
                            <TableCell className="font-medium">{tax.name}</TableCell>
                            <TableCell>{(tax.rate * 100).toFixed(2)}%</TableCell>
                            <TableCell>{tax.type}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={handlePrintReport}>
                                  <Printer size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleDownloadReport}>
                                  <Download size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No taxes found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Tax Reports</CardTitle>
                <CardDescription>
                  Generate and download tax reports for different periods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Annual Tax Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comprehensive yearly tax summary with all income and deductions.
                      </p>
                      <Button variant="outline" className="w-full" onClick={handleDownloadReport}>
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Quarterly Tax Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Quarterly breakdown of your tax obligations and payments.
                      </p>
                      <Button variant="outline" className="w-full" onClick={handleDownloadReport}>
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Deductions Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detailed report of all tax deductible expenses claimed.
                      </p>
                      <Button variant="outline" className="w-full" onClick={handleDownloadReport}>
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Custom Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <Select defaultValue="summary">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                          <SelectItem value="deductions">Deductions Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Format</label>
                      <Select defaultValue="pdf">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full md:w-auto">
                    <FileText size={16} className="mr-2" />
                    Generate Custom Report
                  </Button>
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
