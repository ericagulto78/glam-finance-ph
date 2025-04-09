
import React from 'react';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type Expense } from '@/integrations/supabase/client';

interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
}

const categoryColors: Record<string, string> = {
  'Supplies': 'bg-blue-100 text-blue-800',
  'Inventory': 'bg-purple-100 text-purple-800',
  'Equipment': 'bg-amber-100 text-amber-800',
  'Transportation': 'bg-green-100 text-green-800',
  'Meals': 'bg-red-100 text-red-800',
};

const ExpenseTable: React.FC<ExpenseTableProps> = ({ 
  expenses, 
  isLoading, 
  onEditExpense, 
  onDeleteExpense 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead className="w-[300px]">Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Tax Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Loading expenses...
              </TableCell>
            </TableRow>
          ) : expenses.length > 0 ? (
            expenses.map((expense) => (
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
                  <Badge variant={expense.tax_deductible ? 'outline' : 'secondary'}>
                    {expense.tax_deductible ? 'Deductible' : 'Non-Deductible'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ₱{expense.amount.toLocaleString()}
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
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteExpense(expense)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
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
