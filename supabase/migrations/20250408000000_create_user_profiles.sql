
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add Row Level Security policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy allowing admins to view all user profiles
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles FOR SELECT 
USING (
  auth.jwt() ->> 'email' = 'ericagulto@gmail.com'
);

-- Create a policy allowing users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles FOR SELECT 
USING (
  auth.uid() = user_id
);

-- Create a policy allowing admins to update any profile status
CREATE POLICY "Admins can update profile status" 
ON public.user_profiles FOR UPDATE 
USING (
  auth.jwt() ->> 'email' = 'ericagulto@gmail.com'
);

-- Create a policy allowing users to update their own profile (except status)
CREATE POLICY "Users can update own profile" 
ON public.user_profiles FOR UPDATE 
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id AND
  -- Prevent users from changing their own status
  (OLD.status = NEW.status)
);

-- Create a policy allowing users to insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.user_profiles FOR INSERT 
WITH CHECK (
  auth.uid() = user_id
);
