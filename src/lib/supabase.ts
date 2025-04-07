
import { createClient } from '@supabase/supabase-js';

// Using environment variables or fallback to demo values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set admin email for the application
export const ADMIN_EMAIL = 'ericagulto@gmail.com';

// Helper function to check if a user is an admin
export const isAdmin = (email: string | undefined) => {
  return email === ADMIN_EMAIL;
};
