
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, 
  FormLabel, FormMessage 
} from '@/components/ui/form';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { UserRole } from '@/types/auth';
import { PlusCircle } from 'lucide-react';

interface AddUserFormValues {
  email: string;
  password: string;
  role: UserRole;
}

interface AddUserDialogProps {
  onUserAdded: () => void;
  createUser: (email: string, password: string, role: UserRole) => Promise<{ 
    success: boolean; 
    message: string; 
    userId?: string 
  }>;
  currentUserRole: UserRole;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ 
  onUserAdded, 
  createUser,
  currentUserRole 
}) => {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<AddUserFormValues>({
    defaultValues: {
      email: '',
      password: '',
      role: 'client'
    }
  });

  // Role hierarchy to determine what roles this user can assign
  const roleHierarchy: Record<UserRole, number> = {
    'client': 0,
    'team_member': 1,
    'studio_admin': 2,
    'super_administrator': 3
  };

  const canAssignRole = (userRole: UserRole, targetRole: UserRole): boolean => {
    return roleHierarchy[userRole] > roleHierarchy[targetRole];
  };

  const availableRoles = Object.keys(roleHierarchy).filter(role => {
    // Super admins can assign any role, other admins can only assign roles lower than theirs
    return currentUserRole === 'super_administrator' || 
           (canAssignRole(currentUserRole, role as UserRole) && role !== 'super_administrator');
  }) as UserRole[];

  const onSubmit = async (values: AddUserFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await createUser(values.email, values.password, values.role);
      
      if (result.success) {
        toast({
          title: "User created successfully",
          description: result.message,
        });
        onUserAdded();
        setOpen(false);
        form.reset();
      } else {
        toast({
          title: "Failed to create user",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with specified role and permissions.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="user@example.com" 
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    The user will receive notifications at this email address
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              rules={{ 
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field}
                      disabled={isSubmitting} 
                    />
                  </FormControl>
                  <FormDescription>
                    User can change their password later
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Defines what permissions this user will have
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
