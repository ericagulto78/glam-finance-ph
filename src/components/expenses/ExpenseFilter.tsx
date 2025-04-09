
import React from 'react';
import { Search, Tag, Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface ExpenseFilterProps {
  searchTerm: string;
  categoryFilter: string;
  taxFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onTaxFilterChange: (value: string) => void;
}

const ExpenseFilter: React.FC<ExpenseFilterProps> = ({
  searchTerm,
  categoryFilter,
  taxFilter,
  onSearchChange,
  onCategoryFilterChange,
  onTaxFilterChange
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search expenses..."
              className="pl-9 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select 
              value={categoryFilter}
              onValueChange={onCategoryFilterChange}
            >
              <SelectTrigger className="w-full md:w-[140px]">
                <Tag size={16} className="mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
                <SelectItem value="Inventory">Inventory</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Meals">Meals</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={taxFilter}
              onValueChange={onTaxFilterChange}
            >
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
  );
};

export default ExpenseFilter;
