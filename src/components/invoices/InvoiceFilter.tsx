
import React, { useState } from 'react';
import { Search, Receipt, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceStatus } from '@/integrations/supabase/client';

interface InvoiceFilterProps {
  onStatusChange: (status: InvoiceStatus | 'all') => void;
  onDateRangeChange: (range: [Date | null, Date | null]) => void;
  onSearch: (query: string) => void;
}

const InvoiceFilter: React.FC<InvoiceFilterProps> = ({
  onStatusChange,
  onDateRangeChange,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    onStatusChange(value as InvoiceStatus | 'all');
  };

  const handleDateClick = () => {
    // For now, just using a 30-day window as a simple implementation
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    onDateRangeChange([start, end]);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search invoices..."
              className="pl-9 w-full md:w-80"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select 
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-full md:w-[140px]">
                <Receipt size={16} className="mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex-1 md:flex-none" onClick={handleDateClick}>
              <Calendar size={16} className="mr-2" />
              Date Range
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceFilter;
