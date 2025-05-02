
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Expense } from '@/integrations/supabase/client';

interface ExpenseFormProps {
  expense: Partial<Expense>;
  isLoading: boolean;
  onFormChange: (field: string, value: any) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const DEFAULT_CATEGORIES = [
  "Supplies", 
  "Inventory", 
  "Equipment", 
  "Transportation", 
  "Meals", 
  "Utilities", 
  "Rent", 
  "Subscription", 
  "Other"
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expense,
  isLoading,
  onFormChange,
  onCancel,
  onSubmit,
  submitLabel,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      onFormChange('category', newCategory.trim());
      setNewCategory("");
      setIsAddingCategory(false);
    }
  };

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
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <div className="flex gap-2">
            <Select 
              value={expense.category || ''}
              onValueChange={(value) => onFormChange('category', value)}
            >
              <SelectTrigger id="category" className="flex-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  type="button"
                  title="Add new category"
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Add new category</h4>
                  <Input 
                    placeholder="New category name" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsAddingCategory(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleAddCategory}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input 
          id="description" 
          value={expense.description || ''}
          onChange={(e) => onFormChange('description', e.target.value)}
          required
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
            required
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
