
import { Session, User } from '@supabase/supabase-js';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userStatus: UserStatus;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
}
