
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isAdmin } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    userStatus, 
    setUserStatus, 
    checkUserApprovalStatus, 
    approveUser: approveUserProfile,
    rejectUser: rejectUserProfile
  } = useUserProfile();

  useEffect(() => {
    async function getInitialSession() {
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error.message);
          throw error;
        }
        
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Check if user is admin
          const userIsAdmin = isAdmin(session.user.email);
          setIsCurrentUserAdmin(userIsAdmin);
          
          // If admin, automatically approved
          if (userIsAdmin) {
            setUserStatus('approved');
          } else {
            // Check approval status
            const status = await checkUserApprovalStatus(session.user.id);
            setUserStatus(status);
          }
        } else {
          setUser(null);
          setUserStatus('pending');
          setIsCurrentUserAdmin(false);
        }
      } catch (error: any) {
        console.error('Error getting session:', error.message);
      } finally {
        setLoading(false);
      }
    }
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Check if user is admin
          const userIsAdmin = isAdmin(session.user.email);
          setIsCurrentUserAdmin(userIsAdmin);
          
          // If admin, automatically approved
          if (userIsAdmin) {
            setUserStatus('approved');
          } else {
            // Use setTimeout to prevent Supabase auth deadlock
            setTimeout(async () => {
              // Check approval status
              const status = await checkUserApprovalStatus(session.user.id);
              setUserStatus(status);
            }, 0);
          }
        } else {
          setUser(null);
          setUserStatus('pending');
          setIsCurrentUserAdmin(false);
        }
      }
    );
    
    // Then check for existing session
    getInitialSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkUserApprovalStatus, setUserStatus]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error.message);
        throw error;
      }
      
    } catch (error: any) {
      console.error('Google sign in exception:', error);
      toast({
        title: "Google sign in failed",
        description: error.message || "An error occurred during Google sign in",
        variant: "destructive",
      });
    }
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  const approveUser = async (userId: string) => {
    try {
      if (!isCurrentUserAdmin) {
        throw new Error("Only administrators can approve users");
      }

      await approveUserProfile(userId);
      
      toast({
        title: "User approved",
        description: "The user has been approved and can now access the system.",
      });
    } catch (error: any) {
      toast({
        title: "Approval failed",
        description: error.message || "An error occurred during user approval",
        variant: "destructive",
      });
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      if (!isCurrentUserAdmin) {
        throw new Error("Only administrators can reject users");
      }
      
      await rejectUserProfile(userId);
      
      toast({
        title: "User rejected",
        description: "The user has been rejected and cannot access the system.",
      });
    } catch (error: any) {
      toast({
        title: "Rejection failed",
        description: error.message || "An error occurred during user rejection",
        variant: "destructive",
      });
    }
  };
  
  const value = {
    session,
    user,
    userStatus,
    loading,
    isAdmin: isCurrentUserAdmin,
    signOut,
    signInWithGoogle,
    approveUser,
    rejectUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
