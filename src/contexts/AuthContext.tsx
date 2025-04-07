
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, Provider } from '@supabase/supabase-js';
import { supabase, ADMIN_EMAIL, isAdmin } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

type UserStatus = 'pending' | 'approved' | 'rejected';

type UserMetadata = {
  status?: UserStatus;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userStatus: UserStatus;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus>('pending');
  const [loading, setLoading] = useState(true);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkUserApprovalStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('status')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return 'pending' as UserStatus;
      }

      return (data?.status || 'pending') as UserStatus;
    } catch (error) {
      console.error('Error in checkUserApprovalStatus:', error);
      return 'pending' as UserStatus;
    }
  };

  useEffect(() => {
    async function getInitialSession() {
      setLoading(true);
      
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
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
    
    getInitialSession();
    
    // Set up auth state listener
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
            // Check approval status
            const status = await checkUserApprovalStatus(session.user.id);
            setUserStatus(status);
          }
        } else {
          setUser(null);
          setUserStatus('pending');
          setIsCurrentUserAdmin(false);
        }
        
        setLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`
        }
      });
      
      if (error) throw error;
      
    } catch (error: any) {
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

      const { error } = await supabase
        .from('user_profiles')
        .update({ status: 'approved' })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User approved",
        description: "The user has been approved and can now access the system.",
      });
      
      // If approving the current user, update state
      if (user?.id === userId) {
        setUserStatus('approved');
      }
      
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
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: 'rejected' })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User rejected",
        description: "The user has been rejected and cannot access the system.",
      });
      
      // If rejecting the current user, update state
      if (user?.id === userId) {
        setUserStatus('rejected');
      }
      
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
