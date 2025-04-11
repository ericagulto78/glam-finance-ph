
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/layout/PageHeader';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import ExpenseFilter from '@/components/expenses/ExpenseFilter';
import ExpenseDialogs from '@/components/expenses/ExpenseDialogs';
import { useExpenses } from '@/hooks/useExpenses';

const Expenses = () => {
  const [taxFilter, setTaxFilter] = useState<boolean>(false);
  
  const {
    expenses,
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
  } = useExpenses();

  const handleAddExpense = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditExpense = (expense: Partial<Expense>) => {
    setSelectedExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleDeleteExpense = (expense: Partial<Expense>) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  // Filter expenses by tax deductible status if the filter is active
  const filteredExpenses = taxFilter 
    ? expenses.filter(expense => expense.tax_deductible) 
    : expenses;

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
        <ExpenseFilter 
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          taxFilter={taxFilter}
          onSearchChange={setSearchTerm}
          onCategoryFilterChange={setCategoryFilter}
          onTaxFilterChange={setTaxFilter}
        />

        <Card>
          <CardContent className="p-0">
            <ExpenseTable 
              expenses={filteredExpenses}
              isLoading={isLoading}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          </CardContent>
        </Card>
      </div>

      <ExpenseDialogs 
        isAddDialogOpen={isAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        isLoading={isLoading}
        newExpense={newExpense}
        selectedExpense={selectedExpense}
        onAddDialogOpenChange={setIsAddDialogOpen}
        onEditDialogOpenChange={setIsEditDialogOpen}
        onDeleteDialogOpenChange={setIsDeleteDialogOpen}
        onNewExpenseChange={handleNewExpenseChange}
        onSelectedExpenseChange={handleSelectedExpenseChange}
        onSubmitNewExpense={addExpense}
        onUpdateExpense={updateExpense}
        onConfirmDelete={deleteExpense}
      />
    </div>
  );
};

export default Expenses;
