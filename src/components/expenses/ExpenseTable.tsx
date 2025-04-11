
import React from 'react';
import { MoreHorizontal, DollarSign, Calendar, Receipt, ArrowUp, Clock } from 'lucide-react';
import { Expense } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEditExpense: (expense: Partial<Expense>) => void;
  onDeleteExpense: (expense: Partial<Expense>) => void;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  isLoading,
  onEditExpense,
  onDeleteExpense,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Supplies':
        return <Receipt size={14} className="text-blue-500" />;
      case 'Inventory':
        return <ArrowUp size={14} className="text-green-500" />;
      case 'Equipment':
        return <DollarSign size={14} className="text-purple-500" />;
      case 'Transportation':
        return <Calendar size={14} className="text-orange-500" />;
      case 'Meals':
        return <Calendar size={14} className="text-yellow-500" />;
      case 'Utilities':
        return <Calendar size={14} className="text-teal-500" />;
      case 'Rent':
        return <Calendar size={14} className="text-red-500" />;
      case 'Subscription':
        return <Clock size={14} className="text-indigo-500" />;
      default:
        return <Receipt size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Tax</TableHead>
            <TableHead className="text-right">Monthly</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Loading expenses...
              </TableCell>
            </TableRow>
          ) : expenses.length > 0 ? (
            expenses.map((expense) => (
              <TableRow key={expense.id} className="hover:bg-muted/50">
                <TableCell>
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="font-medium">{expense.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(expense.category)}
                    <span>{expense.category}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {expense.tax_deductible ? (
                    <Badge className="bg-green-100 text-green-800">Deductible</Badge>
                  ) : (
                    <Badge variant="outline">Non-Deductible</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {expense.is_monthly ? (
                    <Badge className="bg-blue-100 text-blue-800">Monthly Fixed</Badge>
                  ) : (
                    <Badge variant="outline">One-time</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <DollarSign size={14} className="text-muted-foreground" />
                    <span>₱{expense.amount.toLocaleString()}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditExpense(expense)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteExpense(expense)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No expenses found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseTable;
