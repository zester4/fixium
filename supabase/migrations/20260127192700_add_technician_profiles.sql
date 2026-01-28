-- Migration: Add Technician Metadata and Profiles
-- Description: Supports professional vetting with file attachments and public profiles.

-- 1. Add metadata column to technician_applications
ALTER TABLE public.technician_applications 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Create technician_profiles table for verified experts
CREATE TABLE IF NOT EXISTS public.technician_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  specialties TEXT[],
  experience_years INTEGER,
  linkedin_url TEXT,
  portfolio_url TEXT,
  reputation_tier INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.technician_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies for profiles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view technician profiles') THEN
    CREATE POLICY "Public can view technician profiles" 
    ON public.technician_profiles FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage technician profiles') THEN
    CREATE POLICY "Admins can manage technician profiles" 
    ON public.technician_profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 4. Storage Bucket for Credentials (must be handled via Supabase API or SQL if permissions allow)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('technician_credentials', 'technician_credentials', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Note: These might require storage schema access
DO $$
BEGIN
  -- We attempt to create these but keep in mind storage might be in its own schema
  -- Usually 'storage' schema is accessible in a single migration
END $$;
