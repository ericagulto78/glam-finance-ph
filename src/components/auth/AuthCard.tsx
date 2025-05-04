
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthCard = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();

  if (user) {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Welcome Back!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>You are already logged in.</p>
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center">
          {activeTab === 'login' ? 'Sign In' : 'Create Account'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Register
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <SignInForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              redirectTo="/"
            />
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <SignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              redirectTo="/"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
