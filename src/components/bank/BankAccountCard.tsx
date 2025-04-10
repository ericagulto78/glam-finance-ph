
import React from 'react';
import { Building, Pencil, Trash2, CheckCircle, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BankAccount } from '@/integrations/supabase/client';

interface BankAccountCardProps {
  account: BankAccount;
  onEdit: (account: BankAccount) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onDeposit?: (id: string) => void;
  onWithdraw?: (id: string) => void;
  onTransfer?: (id: string) => void;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({
  account,
  onEdit,
  onDelete,
  onSetDefault,
  onDeposit,
  onWithdraw,
  onTransfer
}) => {
  return (
    <div 
      className={`p-4 border rounded-lg relative ${account.isDefault ? 'border-rose-500' : 'border-border'}`}
    >
      {account.isDefault && (
        <div className="absolute top-2 right-2 text-rose-500 flex items-center gap-1">
          <CheckCircle size={14} />
          <span className="text-xs font-medium">Default</span>
        </div>
      )}
      
      <div className="flex items-center mb-3">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-primary/10 text-primary">
          <Building size={18} />
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
      
      <div className="flex flex-wrap gap-2 mt-4">
        {onDeposit && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDeposit(account.id)}
            className="flex items-center"
          >
            <ArrowDownLeft size={16} className="mr-1 text-green-500" />
            Deposit
          </Button>
        )}
        
        {onWithdraw && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onWithdraw(account.id)}
            className="flex items-center"
          >
            <ArrowUpRight size={16} className="mr-1 text-red-500" />
            Withdraw
          </Button>
        )}
        
        {onTransfer && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onTransfer(account.id)}
            className="flex items-center"
          >
            <ArrowRightLeft size={16} className="mr-1 text-blue-500" />
            Transfer
          </Button>
        )}
        
        <div className="flex ml-auto gap-2">
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
    </div>
  );
};

export default BankAccountCard;
