
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'client' | 'team_member' | 'studio_admin' | 'super_administrator';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userStatus: UserStatus;
  userRole: UserRole;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
}
