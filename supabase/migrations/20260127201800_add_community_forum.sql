-- Migration: Add Community "Field Support" Forum
-- Description: Creates infrastructure for a technical exchange subsystem with posts, comments, and signal-boost likes.

-- 1. Community Posts Table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  device_category TEXT NOT NULL,
  device_model TEXT,
  signal_strength INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Community Comments Table
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_verified_solution BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Post Signal Boosts (Likes)
CREATE TABLE IF NOT EXISTS public.community_likes (
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);

-- 4. Enable RLS
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies

-- Posts: Everyone can see, authenticated users can create
CREATE POLICY "Public can view community posts" ON public.community_posts 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can broadcast posts" ON public.community_posts 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors and admins can update posts" ON public.community_posts 
  FOR UPDATE USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Comments: Everyone can see, authenticated users can post
CREATE POLICY "Public can view comments" ON public.community_comments 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can reply" ON public.community_comments 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Expert verification policy" ON public.community_comments 
  FOR UPDATE USING (
    (public.is_verified_technician(auth.uid()) AND is_verified_solution = true)
    OR auth.uid() = author_id 
    OR public.has_role(auth.uid(), 'admin')
  );

-- Likes: Authenticated users can boost signals
CREATE POLICY "Public can view signal strength" ON public.community_likes 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can boost signals" ON public.community_likes 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can remove their boost" ON public.community_likes 
  FOR DELETE USING (auth.uid() = user_id);

-- 6. RPC Functions
CREATE OR REPLACE FUNCTION public.increment_signal_strength(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.community_posts
  SET signal_strength = signal_strength + 1
  WHERE id = post_id;
END;
$$;

-- 7. Triggers for updated_at
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON public.community_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
