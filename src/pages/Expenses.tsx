
import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowDownUp, Calendar, Tag, Receipt } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  taxDeductible: boolean;
}

const EXPENSES_DATA: Expense[] = [
  {
    id: '1',
    date: '2025-04-06',
    description: 'Makeup brushes set',
    category: 'Supplies',
    amount: 2500,
    taxDeductible: true,
  },
  {
    id: '2',
    date: '2025-04-05',
    description: 'Foundation stock',
    category: 'Inventory',
    amount: 3800,
    taxDeductible: true,
  },
  {
    id: '3',
    date: '2025-04-03',
    description: 'Lighting equipment',
    category: 'Equipment',
    amount: 6500,
    taxDeductible: true,
  },
  {
    id: '4',
    date: '2025-04-02',
    description: 'Transportation to client',
    category: 'Transportation',
    amount: 800,
    taxDeductible: true,
  },
  {
    id: '5',
    date: '2025-04-01',
    description: 'Lunch with clients',
    category: 'Meals',
    amount: 1200,
    taxDeductible: false,
  },
];

const categoryColors: Record<string, string> = {
  'Supplies': 'bg-blue-100 text-blue-800',
  'Inventory': 'bg-purple-100 text-purple-800',
  'Equipment': 'bg-amber-100 text-amber-800',
  'Transportation': 'bg-green-100 text-green-800',
  'Meals': 'bg-red-100 text-red-800',
};

const Expenses = () => {
  const [expenses] = useState<Expense[]>(EXPENSES_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleAddExpense = () => {
    toast({
      title: "Add expense feature",
      description: "This feature will be implemented in a future update.",
    });
  };

  const filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      <PageHeader 
        title="Expenses" 
        subtitle="Track and manage your business expenses"
        action={{
          label: "Add Expense",
          onClick: handleAddExpense,
          icon: <Plus size={16} />,
        }}
      />

      <div className="p-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search expenses..."
                  className="pl-9 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[140px]">
                    <Tag size={16} className="mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="inventory">Inventory</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[140px]">
                    <Receipt size={16} className="mr-2" />
                    <SelectValue placeholder="Tax Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="deductible">Tax Deductible</SelectItem>
                    <SelectItem value="nondeductible">Non-Deductible</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex-1 md:flex-none">
                  <Calendar size={16} className="mr-2" />
                  Date Range
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[300px]">Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tax Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          {new Date(expense.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{expense.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={categoryColors[expense.category] || 'bg-gray-100 text-gray-800'}>
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={expense.taxDeductible ? 'outline' : 'secondary'}>
                            {expense.taxDeductible ? 'Deductible' : 'Non-Deductible'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₱{expense.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No expenses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Expenses;
