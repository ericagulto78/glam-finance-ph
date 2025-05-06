
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/layout/PageHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import BankAccountForm, { BankAccountFormData } from '@/components/bank/BankAccountForm';

const BankAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const accountId = queryParams.get('id');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BankAccountFormData>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    accountType: 'bank',
    balance: 0,
    undeposited: 0,
    isDefault: false,
  });

  // Load data if editing
  useEffect(() => {
    const loadAccountData = async () => {
      if (!accountId || !user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('id', accountId)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            bankName: data.bank_name,
            accountName: data.account_name,
            accountNumber: data.account_number,
            accountType: data.type,
            balance: data.balance,
            undeposited: data.undeposited,
            isDefault: data.is_default,
          });
        }
      } catch (error: any) {
        console.error('Error loading account:', error);
        toast({
          title: "Error loading account",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();
  }, [accountId, user, toast]);

  // Handle form submission
  const onSubmit = async (data: BankAccountFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (accountId) {
        // Update existing account
        const { error } = await supabase
          .from('bank_accounts')
          .update({
            bank_name: data.bankName,
            account_name: data.accountName,
            account_number: data.accountNumber,
            type: data.accountType,
            balance: data.balance,
            undeposited: data.undeposited,
            is_default: data.isDefault,
          })
          .eq('id', accountId);

        if (error) throw error;
        
        toast({
          title: "Account updated",
          description: "Bank account has been updated successfully",
        });
      } else {
        // Add new account
        const { error } = await supabase
          .from('bank_accounts')
          .insert({
            bank_name: data.bankName,
            account_name: data.accountName,
            account_number: data.accountNumber,
            type: data.accountType,
            balance: data.balance,
            undeposited: data.undeposited,
            is_default: data.isDefault,
            user_id: user.id,
          });

        if (error) throw error;
        
        toast({
          title: "Account added",
          description: "New bank account has been added successfully",
        });
      }
      
      // Navigate back to accounts list
      navigate('/bank-accounts');
    } catch (error: any) {
      console.error('Error saving account:', error);
      toast({
        title: "Error saving account",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/bank-accounts');
  };

  return (
    <div className="h-full">
      <PageHeader 
        title={accountId ? "Edit Bank Account" : "Add Bank Account"}
        subtitle={accountId ? "Update your bank account details" : "Add a new bank account"}
      />

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>{accountId ? 'Edit Bank Account' : 'Add Bank Account'}</CardTitle>
            <CardDescription>
              {accountId ? 'Update your bank account information' : 'Add a new bank account for receiving payments'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BankAccountForm
              defaultValues={formData}
              onSubmit={onSubmit}
              onCancel={handleCancel}
              isEdit={!!accountId}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankAccount;
