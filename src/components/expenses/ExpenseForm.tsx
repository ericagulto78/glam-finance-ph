
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Expense } from '@/integrations/supabase/client';

interface ExpenseFormProps {
  expense: Partial<Expense>;
  isLoading: boolean;
  onFormChange: (field: string, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  isLoading,
  onFormChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input 
            id="date" 
            type="date" 
            value={expense.date || ''}
            onChange={(e) => onFormChange('date', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={expense.category || ''}
            onValueChange={(value) => onFormChange('category', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Supplies">Supplies</SelectItem>
              <SelectItem value="Inventory">Inventory</SelectItem>
              <SelectItem value="Equipment">Equipment</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Meals">Meals</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="Subscription">Subscription</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          value={expense.description || ''}
          onChange={(e) => onFormChange('description', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₱)</Label>
          <Input 
            id="amount" 
            type="number" 
            value={(expense.amount || 0).toString()}
            onChange={(e) => onFormChange('amount', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="tax_deductible" 
          checked={expense.tax_deductible}
          onCheckedChange={(checked) => onFormChange('tax_deductible', checked)}
        />
        <Label htmlFor="tax_deductible">Tax Deductible</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="is_monthly" 
          checked={expense.is_monthly}
          onCheckedChange={(checked) => onFormChange('is_monthly', checked)}
        />
        <Label htmlFor="is_monthly">Monthly Fixed Expense</Label>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : submitLabel}
        </Button>
      </div>
    </div>
  );
};

export default ExpenseForm;
