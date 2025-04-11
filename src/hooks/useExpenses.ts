
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  supabase, 
  Expense, 
  ExpenseCategory,
  castExpense 
} from '@/integrations/supabase/client';

export interface ExpenseFormData {
  id?: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  tax_deductible: boolean;
  is_monthly: boolean;
  description: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedExpense, setSelectedExpense] = useState<Partial<Expense>>({
    name: '',
    amount: 0,
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    tax_deductible: false,
    is_monthly: false,
    description: ''
  });
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    name: '',
    amount: 0,
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    tax_deductible: false,
    is_monthly: false,
    description: ''
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Cast the data to ensure it matches our Expense type
      const typedExpenses = data?.map(expense => castExpense(expense)) || [];
      setExpenses(typedExpenses);
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

  // Add a new expense
  const addExpense = async () => {
    if (!user) return;
    
    if (!newExpense.name || !newExpense.category || !newExpense.date) {
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
        name: newExpense.name,
        amount: newExpense.amount || 0,
        category: newExpense.category,
        date: newExpense.date,
        tax_deductible: newExpense.tax_deductible || false,
        is_monthly: newExpense.is_monthly || false,
        description: newExpense.description || '',
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseToInsert])
        .select();

      if (error) throw error;
      
      setIsAddDialogOpen(false);
      // Immediately fetch expenses after adding
      await fetchExpenses();
      
      setNewExpense({
        name: '',
        amount: 0,
        category: 'other',
        date: new Date().toISOString().split('T')[0],
        tax_deductible: false,
        is_monthly: false,
        description: ''
      });
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

  // Update an existing expense
  const updateExpense = async () => {
    if (!selectedExpense || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          name: selectedExpense.name,
          amount: selectedExpense.amount || 0,
          category: selectedExpense.category,
          date: selectedExpense.date,
          tax_deductible: selectedExpense.tax_deductible || false,
          is_monthly: selectedExpense.is_monthly || false,
          description: selectedExpense.description || ''
        })
        .eq('id', selectedExpense.id);

      if (error) throw error;
      
      setIsEditDialogOpen(false);
      // Immediately fetch expenses after updating
      await fetchExpenses();
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

  // Delete an expense
  const deleteExpense = async () => {
    if (!selectedExpense || !user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', selectedExpense.id);

      if (error) throw error;
      
      setIsDeleteDialogOpen(false);
      // Immediately fetch expenses after deleting
      await fetchExpenses();
      toast({
        title: "Expense deleted",
        description: `Expense ${selectedExpense.name} has been deleted.`,
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
    setSelectedExpense((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return {
    expenses: filteredExpenses,
    searchTerm,
    categoryFilter,
    newExpense,
    selectedExpense,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isLoading,
    setSearchTerm,
    setCategoryFilter,
    setSelectedExpense,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    handleNewExpenseChange,
    handleSelectedExpenseChange,
    addExpense,
    updateExpense,
    deleteExpense
  };
}
