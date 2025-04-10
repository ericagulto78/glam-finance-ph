
import React from 'react';
import { Bank, Pencil, Trash2, ChevronDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BankAccount } from '@/integrations/supabase/client';

interface BankAccountCardProps {
  account: BankAccount;
  onEdit: (account: BankAccount) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onSetDefault
}) => {
  return (
    <div 
      className={`p-4 border rounded-lg relative ${account.isDefault ? 'border-rose' : 'border-border'}`}
    >
      {account.isDefault && (
        <div className="absolute top-2 right-2 text-rose-500 flex items-center gap-1">
          <CheckCircle size={14} />
          <span className="text-xs font-medium">Default</span>
        </div>
      )}
      
      <div className="flex items-center mb-3">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-primary/10 text-primary">
          <Bank size={18} />
        </div>
        <div className="ml-3">
          <h3 className="font-medium">{account.bankName}</h3>
          <p className="text-xs text-muted-foreground">{account.accountNumber}</p>
        </div>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Account Name:</span>
          <span>{account.accountName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Balance:</span>
          <span className="font-medium">₱{account.balance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Undeposited:</span>
          <span>₱{account.undeposited.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-semibold">₱{(account.balance + account.undeposited).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        {!account.isDefault && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSetDefault(account.id)}
          >
            Set as Default
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit(account)}
        >
          <Pencil size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete(account.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default BankAccountCard;
