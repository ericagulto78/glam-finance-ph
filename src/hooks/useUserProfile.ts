
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus } from '@/types/auth';

export const useUserProfile = () => {
  const [status, setStatus] = useState<UserStatus>('pending');

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

  return {
    userStatus: status,
    setUserStatus: setStatus,
    checkUserApprovalStatus,
    approveUser,
    rejectUser
  };
};
