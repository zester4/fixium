-- Migration: Repair Marketplace Core
-- Description: Implements tables for Jobs, Proposals, and Contracts.

-- 1. Create repair_jobs table
CREATE TABLE IF NOT EXISTS public.repair_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  device_category TEXT NOT NULL,
  device_model TEXT,
  budget_range TEXT,
  location TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'completed', 'canceled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create repair_proposals table
CREATE TABLE IF NOT EXISTS public.repair_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.repair_jobs(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proposed_cost NUMERIC(10, 2) NOT NULL,
  estimated_days INTEGER NOT NULL,
  methodology TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(job_id, technician_id)
);

-- 3. Create repair_contracts table
CREATE TABLE IF NOT EXISTS public.repair_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.repair_jobs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  proposal_id UUID REFERENCES public.repair_proposals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  technician_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  terms TEXT NOT NULL,
  signed_at TIMESTAMPTZ DEFAULT now(),
  blockchain_hash TEXT, -- For audit trail simulation
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'fulfilled', 'disputed'))
);

-- 4. Enhance technician_profiles with more professional data
ALTER TABLE public.technician_profiles 
ADD COLUMN IF NOT EXISTS certification_details JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS workshop_inventory JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS preferred_categories TEXT[] DEFAULT '{}'::text[];

-- Enable RLS
ALTER TABLE public.repair_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_contracts ENABLE ROW LEVEL SECURITY;

-- 5. Marketplace RLS Policies

-- Jobs: Anyone can read open jobs, only authors can manage theirs
CREATE POLICY "Anyone can view open jobs" ON public.repair_jobs FOR SELECT USING (status = 'open' OR auth.uid() = user_id);
CREATE POLICY "Users can create jobs" ON public.repair_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage own jobs" ON public.repair_jobs FOR ALL USING (auth.uid() = user_id);

-- Proposals: Only job authors and technicians can see relevant proposals
CREATE POLICY "Job authors can view proposals" ON public.repair_proposals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.repair_jobs WHERE id = job_id AND user_id = auth.uid())
);
CREATE POLICY "Technicians can view own proposals" ON public.repair_proposals FOR SELECT USING (auth.uid() = technician_id);
CREATE POLICY "Verified technicians can propose" ON public.repair_proposals FOR INSERT WITH CHECK (
  public.is_verified_technician(auth.uid())
);

-- Contracts: Only involved parties can view/manage
CREATE POLICY "Involved parties can view contracts" ON public.repair_contracts FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = technician_id
);

-- Update timestamp triggers
CREATE TRIGGER update_repair_jobs_updated_at BEFORE UPDATE ON public.repair_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_repair_proposals_updated_at BEFORE UPDATE ON public.repair_proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
