
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, FileText, DownloadCloud, Eye } from 'lucide-react';
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const INVOICES_DATA: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    client: 'Sofia Garcia',
    issueDate: '2025-04-01',
    dueDate: '2025-04-15',
    amount: 3500,
    status: 'paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    client: 'Maria Santos',
    issueDate: '2025-04-02',
    dueDate: '2025-04-16',
    amount: 5000,
    status: 'pending',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-003',
    client: 'Isabella Reyes',
    issueDate: '2025-04-03',
    dueDate: '2025-04-17',
    amount: 2800,
    status: 'pending',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-004',
    client: 'Olivia Cruz',
    issueDate: '2025-03-15',
    dueDate: '2025-03-29',
    amount: 4200,
    status: 'overdue',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2025-005',
    client: 'Emma Fernandez',
    issueDate: '2025-03-20',
    dueDate: '2025-04-03',
    amount: 2500,
    status: 'paid',
  },
];

const statusColors = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  overdue: "bg-red-100 text-red-800",
};

const Invoices = () => {
  const [invoices] = useState<Invoice[]>(INVOICES_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleAddInvoice = () => {
    toast({
      title: "Add invoice feature",
      description: "This feature will be implemented in a future update.",
    });
  };

  const handleViewInvoice = (invoiceId: string) => {
    toast({
      title: "View invoice",
      description: `Viewing invoice ${invoiceId} will be implemented in a future update.`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download invoice",
      description: `Downloading invoice ${invoiceId} will be implemented in a future update.`,
    });
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      <PageHeader 
        title="Invoices" 
        subtitle="Generate and manage client invoices"
        action={{
          label: "Create Invoice",
          onClick: handleAddInvoice,
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
                  placeholder="Search invoices..."
                  className="pl-9 w-full md:w-80"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[140px]">
                    <Filter size={16} className="mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
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
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>
                          {new Date(invoice.issueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="text-right">₱{invoice.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[invoice.status]}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewInvoice(invoice.id)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <DownloadCloud size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No invoices found.
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

export default Invoices;
