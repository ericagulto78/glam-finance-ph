
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

// Array of friendly greetings
const greetings = [
  'Hello',
  'Hi there',
  'Welcome back',
  'Good to see you',
  'Howdy',
  'Nice to see you',
  'Greetings',
  'Hey there'
];

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [greeting, setGreeting] = useState('');
  
  // Generate a random greeting when the component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setGreeting(greetings[randomIndex]);
  }, []);

  // Extract first name from email or use default
  const firstName = user?.email?.split('@')[0] || 'User';
  
  // Generate initials from email for avatar fallback
  const getInitials = () => {
    if (!user?.email) return 'U';
    const parts = user.email.split('@')[0].split(/[._-]/);
    return parts.map(part => part[0]?.toUpperCase() || '').join('').slice(0, 2);
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex flex-col px-2 py-1.5">
            <span className="text-sm font-medium">{greeting}, {firstName}!</span>
            <span className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile" className="cursor-pointer flex w-full items-center">
              <User className="mr-2 h-4 w-4" /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer flex w-full items-center">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfile;
