
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
        .single();

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
        .single();

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

  return {
    userStatus: status,
    userRole: role,
    setUserStatus: setStatus,
    setUserRole: setRole,
    checkUserApprovalStatus,
    checkUserRole,
    approveUser,
    rejectUser,
    updateUserRole
  };
};
