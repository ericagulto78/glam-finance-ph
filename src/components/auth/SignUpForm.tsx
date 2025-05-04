
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase, ADMIN_EMAIL } from '@/integrations/supabase/client';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

const SignUpForm = ({ email, setEmail, password, setPassword }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get the deployed URL or fallback to current origin
      const currentUrl = window.location.origin;
      const productionUrl = currentUrl.includes('localhost') ? 'https://your-production-domain.com' : currentUrl;
      console.log("Using redirect URL:", productionUrl);
      
      // Clean up the email by trimming whitespace
      const trimmedEmail = email.trim();
      
      // Sign up the user with proper redirect
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${productionUrl}/login`
        }
      });

      if (authError) throw authError;
      
      if (authData?.user) {
        // Note: We're not inserting directly to user_profiles here
        // The handle_new_user() database trigger will create the profile
        // Based on the auth.user that was just created
        
        // Check if it's the admin email for special messaging
        const isAdminUser = trimmedEmail === ADMIN_EMAIL;
        
        toast({
          title: isAdminUser ? "Admin account created" : "Account pending approval",
          description: isAdminUser 
            ? "Admin account created successfully."
            : "Your account has been created and is pending administrator approval. Please check your email to confirm your address.",
        });
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Check if it's a network error
      if (error.message?.includes('fetch') || error.message === 'Failed to fetch' || error.message?.includes('network')) {
        setSignupError("Network error: Unable to connect to authentication service. Please check your internet connection and try again.");
      } else {
        setSignupError(error.message || "An error occurred during sign up");
      }
      
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {signupError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{signupError}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="signup-email"
            type="email"
            placeholder="name@example.com"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            id="signup-password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Password must be at least 6 characters
        </p>
      </div>
      <div className="space-y-2">
        <Alert>
          <AlertDescription className="text-xs">
            New accounts require administrator approval before access is granted.
          </AlertDescription>
        </Alert>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
