-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create subscription status enum
CREATE TYPE public.subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'inactive');

-- Create technician status enum
CREATE TYPE public.technician_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_pro BOOLEAN DEFAULT false,
  subscription_status subscription_status DEFAULT 'inactive',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create technician_applications table
CREATE TABLE public.technician_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  credentials TEXT NOT NULL,
  experience_years INTEGER,
  specialties TEXT[],
  status technician_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create repair_guides table (community-submitted)
CREATE TABLE public.repair_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  device_category TEXT NOT NULL,
  device_model TEXT,
  device_brand TEXT,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  estimated_time TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  parts JSONB DEFAULT '[]',
  tools JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT false,
  is_pro_only BOOLEAN DEFAULT false,
  rating_sum INTEGER DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create guide_ratings table
CREATE TABLE public.guide_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES public.repair_guides(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guide_id, user_id)
);

-- Create alternate_techniques table
CREATE TABLE public.alternate_techniques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES public.repair_guides(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  steps JSONB,
  upvotes INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create repair_progress table (before/after timeline)
CREATE TABLE public.repair_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  guide_id UUID REFERENCES public.repair_guides(id) ON DELETE SET NULL,
  device_info JSONB NOT NULL,
  photos JSONB DEFAULT '[]',
  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT '{}',
  notes TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'in_progress'
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technician_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alternate_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_progress ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is pro
CREATE OR REPLACE FUNCTION public.is_pro_user(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND is_pro = true
      AND (subscription_expires_at IS NULL OR subscription_expires_at > now())
  )
$$;

-- Function to check if user is verified technician
CREATE OR REPLACE FUNCTION public.is_verified_technician(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.technician_applications
    WHERE user_id = _user_id
      AND status = 'approved'
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User roles policies (admins only can modify)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Technician applications policies
CREATE POLICY "Users can view own applications"
  ON public.technician_applications FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can submit applications"
  ON public.technician_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update applications"
  ON public.technician_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Repair guides policies
CREATE POLICY "Anyone can view public guides"
  ON public.repair_guides FOR SELECT
  USING (
    is_pro_only = false 
    OR public.is_pro_user(auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Verified technicians can create guides"
  ON public.repair_guides FOR INSERT
  WITH CHECK (
    public.is_verified_technician(auth.uid()) 
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Authors and admins can update guides"
  ON public.repair_guides FOR UPDATE
  USING (
    auth.uid() = author_id 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Guide ratings policies
CREATE POLICY "Anyone can view ratings"
  ON public.guide_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can rate"
  ON public.guide_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON public.guide_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Alternate techniques policies
CREATE POLICY "Anyone can view techniques"
  ON public.alternate_techniques FOR SELECT
  USING (true);

CREATE POLICY "Verified technicians can submit techniques"
  ON public.alternate_techniques FOR INSERT
  WITH CHECK (
    public.is_verified_technician(auth.uid()) 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Repair progress policies
CREATE POLICY "Users can view own progress"
  ON public.repair_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress"
  ON public.repair_progress FOR ALL
  USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  -- Give default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_repair_guides_updated_at
  BEFORE UPDATE ON public.repair_guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();