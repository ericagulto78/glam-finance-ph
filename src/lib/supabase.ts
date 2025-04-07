
import { createClient } from '@supabase/supabase-js';

// Using environment variables with more robust fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Authentication will not work properly.');
}

// Create the Supabase client with the URL and key
export const supabase = createClient(
  supabaseUrl || 'https://your-supabase-project-url.supabase.co',
  supabaseAnonKey || 'your-supabase-anon-key'
);

// Set admin email for the application
export const ADMIN_EMAIL = 'ericagulto@gmail.com';

// Helper function to check if a user is an admin
export const isAdmin = (email: string | undefined) => {
  return email === ADMIN_EMAIL;
};
