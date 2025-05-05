import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isAdmin } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import { AuthContextType, UserRole } from '@/types/auth';

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
    userRole,
    setUserStatus,
    setUserRole,
    checkUserApprovalStatus, 
    checkUserRole,
    approveUser: approveUserProfile,
    rejectUser: rejectUserProfile,
    updateUserRole: updateUserRoleProfile,
    createUser: createUserProfile
  } = useUserProfile();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change event:", event);
        setSession(session);
        
        if (session?.user) {
          console.log("User authenticated:", session.user.email);
          setUser(session.user);
          
          // Check if user is admin
          const userIsAdmin = isAdmin(session.user.email);
          setIsCurrentUserAdmin(userIsAdmin);
          
          // If admin, automatically approved
          if (userIsAdmin) {
            setUserStatus('approved');
            setUserRole('super_administrator');
          } else {
            // Use setTimeout to prevent Supabase auth deadlock
            setTimeout(async () => {
              // Check approval status
              const status = await checkUserApprovalStatus(session.user.id);
              console.log("User status from check:", status);
              setUserStatus(status);
              
              // Check user role
              const role = await checkUserRole(session.user.id);
              console.log("User role from check:", role);
              setUserRole(role);
            }, 0);
          }
        } else {
          setUser(null);
          setUserStatus('pending');
          setUserRole('client');
          setIsCurrentUserAdmin(false);
        }
      }
    );
    
    // Then check for existing session
    async function getInitialSession() {
      setLoading(true);
      
      try {
        console.log("Getting initial session...");
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error.message);
          throw error;
        }
        
        console.log("Session data:", session ? "Session exists" : "No session");
        setSession(session);
        
        if (session?.user) {
          console.log("User found in session:", session.user.email);
          setUser(session.user);
          
          // Check if user is admin by email
          const userIsAdmin = isAdmin(session.user.email);
          console.log("Is admin:", userIsAdmin);
          setIsCurrentUserAdmin(userIsAdmin);
          
          // Special handling for ericagulto@gmail.com to ensure admin access
          if (userIsAdmin || session.user.email === 'ericagulto@gmail.com') {
            setUserStatus('approved');
            setUserRole('super_administrator');
            // Update the database as well to ensure consistency
            try {
              await supabase
                .from('user_profiles')
                .upsert({ 
                  user_id: session.user.id, 
                  email: session.user.email,
                  status: 'approved', 
                  role: 'super_administrator' 
                }, { onConflict: 'user_id' });
            } catch (err) {
              console.error("Error updating admin user profile:", err);
            }
          } else {
            // Check approval status
            const status = await checkUserApprovalStatus(session.user.id);
            console.log("User approval status:", status);
            setUserStatus(status);
            
            // Check user role
            const role = await checkUserRole(session.user.id);
            console.log("User role:", role);
            setUserRole(role);
          }
        } else {
          setUser(null);
          setUserStatus('pending');
          setUserRole('client');
          setIsCurrentUserAdmin(false);
        }
      } catch (error: any) {
        console.error('Error getting session:', error.message);
      } finally {
        setLoading(false);
      }
    }
    
    getInitialSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkUserApprovalStatus, checkUserRole, setUserStatus, setUserRole]);

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
      if (!isCurrentUserAdmin && userRole !== 'studio_admin' && userRole !== 'super_administrator') {
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
      if (!isCurrentUserAdmin && userRole !== 'studio_admin' && userRole !== 'super_administrator') {
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

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      if (userRole !== 'studio_admin' && userRole !== 'super_administrator') {
        throw new Error("Only administrators can update user roles");
      }
      
      // Super administrators can assign any role, studio admins can only assign client and team_member
      if (userRole === 'studio_admin' && (newRole === 'super_administrator' || newRole === 'studio_admin')) {
        throw new Error("You don't have permission to assign this role");
      }
      
      await updateUserRoleProfile(userId, newRole);
      
      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}.`,
      });
    } catch (error: any) {
      toast({
        title: "Role update failed",
        description: error.message || "An error occurred while updating the user role",
        variant: "destructive",
      });
    }
  };

  const createUser = async (email: string, password: string, initialRole: UserRole = 'client'): Promise<{ success: boolean; message: string; userId?: string }> => {
    try {
      if (!isCurrentUserAdmin && userRole !== 'studio_admin' && userRole !== 'super_administrator') {
        throw new Error("Only administrators can create users");
      }
      
      // Super administrators can assign any role, studio admins can only assign client and team_member
      if (userRole === 'studio_admin' && (initialRole === 'super_administrator' || initialRole === 'studio_admin')) {
        throw new Error("You don't have permission to assign this role");
      }

      const result = await createUserProfile(email, password, initialRole);
      
      if (result.success) {
        toast({
          title: "User created",
          description: result.message,
        });
      }
      
      return result;
    } catch (error: any) {
      toast({
        title: "User creation failed",
        description: error.message || "An error occurred during user creation",
        variant: "destructive",
      });
      
      return {
        success: false,
        message: error.message || "An error occurred during user creation"
      };
    }
  };
  
  const value = {
    session,
    user,
    userStatus,
    userRole,
    loading,
    isAdmin: isCurrentUserAdmin || userRole === 'super_administrator' || userRole === 'studio_admin',
    signOut,
    signInWithGoogle,
    approveUser,
    rejectUser,
    updateUserRole,
    createUser // Add the new function to the context value
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
