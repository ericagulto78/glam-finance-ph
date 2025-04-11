
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ExpenseFilterProps {
  searchTerm: string;
  categoryFilter: string;
  taxFilter?: boolean;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onTaxFilterChange?: (value: boolean) => void;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  searchTerm,
  categoryFilter,
  taxFilter,
  onSearchChange,
  onCategoryFilterChange,
  onTaxFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search expenses..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-48">
        <Select
          value={categoryFilter}
          onValueChange={onCategoryFilterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="supplies">Supplies</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="travel">Travel</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="taxes">Taxes</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {onTaxFilterChange && (
        <div className="flex items-center space-x-2">
          <Switch 
            id="tax-deductible" 
            checked={taxFilter}
            onCheckedChange={onTaxFilterChange}
          />
          <Label htmlFor="tax-deductible">Tax Deductible Only</Label>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilter;
