
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/layout/PageHeader';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Define the form data type
interface BankAccountFormData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  undeposited: number;
  isDefault: boolean;
}

const BankAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryParams = new URLSearchParams(location.search);
  const accountId = queryParams.get('id');
  
  // Initialize form
  const form = useForm<BankAccountFormData>({
    defaultValues: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      accountType: 'bank',
      balance: 0,
      undeposited: 0,
      isDefault: false,
    }
  });

  // Load data if editing
  useEffect(() => {
    const loadAccountData = async () => {
      if (!accountId || !user) return;

      try {
        const { data, error } = await supabase
          .from('bank_accounts')
          .select('*')
          .eq('id', accountId)
          .single();

        if (error) throw error;

        if (data) {
          form.reset({
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
      }
    };

    loadAccountData();
  }, [accountId, user, form, toast]);

  // Handle form submission
  const onSubmit = async (formData: BankAccountFormData) => {
    if (!user) return;
    
    try {
      if (accountId) {
        // Update existing account
        const { error } = await supabase
          .from('bank_accounts')
          .update({
            bank_name: formData.bankName,
            account_name: formData.accountName,
            account_number: formData.accountNumber,
            type: formData.accountType,
            balance: formData.balance,
            undeposited: formData.undeposited,
            is_default: formData.isDefault,
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
            bank_name: formData.bankName,
            account_name: formData.accountName,
            account_number: formData.accountNumber,
            type: formData.accountType,
            balance: formData.balance,
            undeposited: formData.undeposited,
            is_default: formData.isDefault,
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
    }
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., BDO, BPI, UnionBank" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Name on the account" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Your account number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank</SelectItem>
                            <SelectItem value="e-wallet">E-Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field: { value, onChange, ...restField } }) => (
                      <FormItem>
                        <FormLabel>Current Balance (₱)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={value}
                            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                            {...restField}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="undeposited"
                    render={({ field: { value, onChange, ...restField } }) => (
                      <FormItem>
                        <FormLabel>Undeposited Amount (₱)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            value={value}
                            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                            {...restField}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Set as default account</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/bank-accounts')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {accountId ? 'Update Account' : 'Add Account'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BankAccount;
