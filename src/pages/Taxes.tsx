import React, { useState } from 'react';
import { BadgePlus, Printer, Filter, Search, Plus, Download } from 'lucide-react';
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

interface Tax {
  id: string;
  name: string;
  rate: number;
  type: 'GST' | 'VAT' | 'Sales Tax';
}

const TAXES_DATA: Tax[] = [
  {
    id: '1',
    name: 'GST',
    rate: 0.05,
    type: 'GST',
  },
  {
    id: '2',
    name: 'VAT',
    rate: 0.10,
    type: 'VAT',
  },
  {
    id: '3',
    name: 'Sales Tax',
    rate: 0.08,
    type: 'Sales Tax',
  },
];

const Taxes = () => {
  const [taxes, setTaxes] = useState<Tax[]>(TAXES_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleAddTax = () => {
    toast({
      title: "Add tax feature",
      description: "This feature will be implemented in a future update.",
    });
  };

  const handlePrintReport = () => {
    toast({
      title: "Print report",
      description: "This feature will be implemented in a future update.",
    });
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
          label: "Add Tax",
          onClick: handleAddTax,
          icon: <Plus size={16} />,
        }}
      />

      <div className="p-6">
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
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="GST">GST</SelectItem>
                    <SelectItem value="VAT">VAT</SelectItem>
                    <SelectItem value="Sales Tax">Sales Tax</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="flex-1 md:flex-none">
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
                            <Button variant="ghost" size="icon">
                              <Printer size={16} onClick={handlePrintReport} />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download size={16} onClick={handleDownloadReport} />
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
      </div>
    </div>
  );
};

export default Taxes;
