
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus, UserRole } from '@/types/auth';

export const useUserProfile = () => {
  const [status, setStatus] = useState<UserStatus>('pending');
  const [role, setRole] = useState<UserRole>('client');

  const checkUserApprovalStatus = useCallback(async (userId: string): Promise<UserStatus> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return 'pending';
      }

      return (data?.status || 'pending') as UserStatus;
    } catch (error) {
      console.error('Error in checkUserApprovalStatus:', error);
      return 'pending';
    }
  }, []);

  const checkUserRole = useCallback(async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'client';
      }

      return (data?.role || 'client') as UserRole;
    } catch (error) {
      console.error('Error in checkUserRole:', error);
      return 'client';
    }
  }, []);

  const approveUser = useCallback(async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: 'approved' })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // If approving the current user, update state
      setStatus('approved');
    } catch (error: any) {
      console.error('Error approving user:', error.message);
      throw error;
    }
  }, []);

  const rejectUser = useCallback(async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ status: 'rejected' })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // If rejecting the current user, update state
      setStatus('rejected');
    } catch (error: any) {
      console.error('Error rejecting user:', error.message);
      throw error;
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, newRole: UserRole): Promise<void> => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // If updating the current user's role, update state
      setRole(newRole);
    } catch (error: any) {
      console.error('Error updating user role:', error.message);
      throw error;
    }
  }, []);

  // New function to create a user
  const createUser = useCallback(async (email: string, password: string, initialRole: UserRole = 'client'): Promise<{ success: boolean; message: string; userId?: string }> => {
    try {
      // Create user in auth system
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authError) {
        return { 
          success: false, 
          message: authError.message 
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          message: 'User created but no user data returned' 
        };
      }

      // Create profile for the new user
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: authData.user.id,
          email: email,
          role: initialRole,
          status: 'approved'
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        return { 
          success: false, 
          message: `User created but profile creation failed: ${profileError.message}` 
        };
      }

      return { 
        success: true, 
        message: 'User successfully created and approved', 
        userId: authData.user.id 
      };
    } catch (error: any) {
      console.error('Error in createUser:', error);
      return { 
        success: false, 
        message: `Error creating user: ${error.message}` 
      };
    }
  }, []);

  return {
    userStatus: status,
    userRole: role,
    setUserStatus: setStatus,
    setUserRole: setRole,
    checkUserApprovalStatus,
    checkUserRole,
    approveUser,
    rejectUser,
    updateUserRole,
    createUser
  };
};
