import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowDownUp, Calendar, Tag, Receipt } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Expense } from '@/integrations/supabase/client';
import PageHeader from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';

const categoryColors: Record<string, string> = {
  'Supplies': 'bg-blue-100 text-blue-800',
  'Inventory': 'bg-purple-100 text-purple-800',
  'Equipment': 'bg-amber-100 text-amber-800',
  'Transportation': 'bg-green-100 text-green-800',
  'Meals': 'bg-red-100 text-red-800',
};

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [taxFilter, setTaxFilter] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  // New expense form state
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Supplies',
    amount: 0,
    tax_deductible: true,
  });

  // Fetch expenses from Supabase
  const fetchExpenses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setExpenses(data || []);
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast({
        title: "Error fetching expenses",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const handleAddExpense = () => {
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'Supplies',
      amount: 0,
      tax_deductible: true,
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmitNewExpense = async () => {
    if (!user) return;
    
    if (!newExpense.description || !newExpense.category || !newExpense.date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const expenseToInsert = {
        date: newExpense.date || '',
        description: newExpense.description || '',
        category: newExpense.category || '',
        amount: newExpense.amount || 0,
        tax_deductible: newExpense.tax_deductible ?? true,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseToInsert])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      fetchExpenses();
      toast({
        title: "Expense added",
        description: "The expense has been successfully added",
      });
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleUpdateExpense = async () => {
    if (!selectedExpense || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          date: selectedExpense.date,
          description: selectedExpense.description,
          category: selectedExpense.category,
          amount: selectedExpense.amount,
          tax_deductible: selectedExpense.tax_deductible,
        })
        .eq('id', selectedExpense.id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      fetchExpenses();
      toast({
        title: "Expense updated",
        description: "The expense has been successfully updated",
      });
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast({
        title: "Error updating expense",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedExpense || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', selectedExpense.id);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      fetchExpenses();
      toast({
        title: "Expense deleted",
        description: `Expense "${selectedExpense.description}" has been deleted.`,
      });
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: "Error deleting expense",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes for new expense
  const handleNewExpenseChange = (field: string, value: any) => {
    setNewExpense((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form input changes for edit expense
  const handleSelectedExpenseChange = (field: string, value: any) => {
    if (!selectedExpense) return;
    
    setSelectedExpense((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    const matchesTaxStatus = taxFilter === 'all' || 
                           (taxFilter === 'deductible' && expense.tax_deductible) || 
                           (taxFilter === 'nondeductible' && !expense.tax_deductible);
    
    return matchesSearch && matchesCategory && matchesTaxStatus;
  });

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
                <Select 
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
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
                  onValueChange={setTaxFilter}
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
                  ) : filteredExpenses.length > 0 ? (
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
                              <DropdownMenuItem onClick={() => handleEditExpense(expense)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteExpense(expense)}>
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
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details for the new expense.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Input 
                id="new-description" 
                value={newExpense.description}
                onChange={(e) => handleNewExpenseChange('description', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-date">Date</Label>
                <Input 
                  id="new-date" 
                  type="date" 
                  value={newExpense.date}
                  onChange={(e) => handleNewExpenseChange('date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-category">Category</Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={(value) => handleNewExpenseChange('category', value)}
                >
                  <SelectTrigger id="new-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Meals">Meals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-amount">Amount (₱)</Label>
                <Input 
                  id="new-amount" 
                  type="number" 
                  value={newExpense.amount?.toString()}
                  onChange={(e) => handleNewExpenseChange('amount', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="new-tax-deductible" 
                    checked={newExpense.tax_deductible}
                    onCheckedChange={(checked) => handleNewExpenseChange('tax_deductible', !!checked)}
                  />
                  <label
                    htmlFor="new-tax-deductible"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Tax Deductible
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmitNewExpense}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the expense details below.
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description" 
                  value={selectedExpense.description}
                  onChange={(e) => handleSelectedExpenseChange('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input 
                    id="edit-date" 
                    type="date" 
                    value={selectedExpense.date}
                    onChange={(e) => handleSelectedExpenseChange('date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={selectedExpense.category}
                    onValueChange={(value) => handleSelectedExpenseChange('category', value)}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supplies">Supplies</SelectItem>
                      <SelectItem value="Inventory">Inventory</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Meals">Meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount (₱)</Label>
                  <Input 
                    id="edit-amount" 
                    type="number" 
                    value={selectedExpense.amount.toString()}
                    onChange={(e) => handleSelectedExpenseChange('amount', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="edit-tax-deductible" 
                      checked={selectedExpense.tax_deductible}
                      onCheckedChange={(checked) => handleSelectedExpenseChange('tax_deductible', !!checked)}
                    />
                    <label
                      htmlFor="edit-tax-deductible"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Tax Deductible
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={handleUpdateExpense}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
