
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, type Expense } from '@/integrations/supabase/client';

export const useExpenses = () => {
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

  const handleNewExpenseChange = (field: string, value: any) => {
    setNewExpense((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const addExpense = async () => {
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

  const updateExpense = async () => {
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

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    const matchesTaxStatus = taxFilter === 'all' || 
                           (taxFilter === 'deductible' && expense.tax_deductible) || 
                           (taxFilter === 'nondeductible' && !expense.tax_deductible);
    
    return matchesSearch && matchesCategory && matchesTaxStatus;
  });

  return {
    expenses: filteredExpenses,
    searchTerm,
    categoryFilter,
    taxFilter,
    newExpense,
    selectedExpense,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isLoading,
    setSearchTerm,
    setCategoryFilter,
    setTaxFilter,
    setNewExpense,
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
};
