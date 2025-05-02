
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import ExpenseForm from './ExpenseForm';
import type { Expense } from '@/integrations/supabase/client';

interface ExpenseDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  isLoading: boolean;
  newExpense: Partial<Expense>;
  selectedExpense: Partial<Expense> | null;
  onAddDialogOpenChange: (open: boolean) => void;
  onEditDialogOpenChange: (open: boolean) => void;
  onDeleteDialogOpenChange: (open: boolean) => void;
  onNewExpenseChange: (field: string, value: any) => void;
  onSelectedExpenseChange: (field: string, value: any) => void;
  onSubmitNewExpense: () => void;
  onUpdateExpense: () => void;
  onConfirmDelete: () => void;
}

const ExpenseDialogs: React.FC<ExpenseDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  isDeleteDialogOpen,
  isLoading,
  newExpense,
  selectedExpense,
  onAddDialogOpenChange,
  onEditDialogOpenChange,
  onDeleteDialogOpenChange,
  onNewExpenseChange,
  onSelectedExpenseChange,
  onSubmitNewExpense,
  onUpdateExpense,
  onConfirmDelete
}) => {
  return (
    <>
      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details for the new expense.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm
            expense={newExpense}
            isLoading={isLoading}
            onFormChange={onNewExpenseChange}
            onCancel={() => onAddDialogOpenChange(false)}
            onSubmit={onSubmitNewExpense}
            submitLabel="Add Expense"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the expense details below.
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <ExpenseForm
              expense={selectedExpense}
              isLoading={isLoading}
              onFormChange={onSelectedExpenseChange}
              onCancel={() => onEditDialogOpenChange(false)}
              onSubmit={onUpdateExpense}
              submitLabel="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={onDeleteDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onDeleteDialogOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirmDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseDialogs;
