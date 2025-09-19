-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  organization TEXT,
  role TEXT CHECK (role IN ('ngo', 'admin', 'investor')) NOT NULL DEFAULT 'ngo',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_type TEXT CHECK (project_type IN ('reforestation', 'afforestation', 'mangrove_restoration', 'agroforestry', 'urban_forestry')) NOT NULL,
  location_name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  area_hectares DECIMAL(10, 2) NOT NULL,
  tree_species TEXT[] NOT NULL,
  planting_date DATE NOT NULL,
  estimated_co2_tons DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'under_review', 'verified', 'rejected', 'tokenized')) NOT NULL DEFAULT 'pending',
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  verified_by UUID REFERENCES public.profiles(id),
  verification_date TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  blockchain_hash TEXT,
  ipfs_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project media table
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'document')) NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carbon credits table
CREATE TABLE IF NOT EXISTS public.carbon_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  token_id TEXT UNIQUE NOT NULL,
  amount_tons DECIMAL(10, 2) NOT NULL,
  price_per_ton DECIMAL(10, 2) NOT NULL,
  total_value DECIMAL(12, 2) NOT NULL,
  status TEXT CHECK (status IN ('available', 'sold', 'retired')) NOT NULL DEFAULT 'available',
  owner_id UUID REFERENCES public.profiles(id),
  blockchain_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id UUID NOT NULL REFERENCES public.carbon_credits(id),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID REFERENCES public.profiles(id),
  amount_tons DECIMAL(10, 2) NOT NULL,
  price_per_ton DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  transaction_hash TEXT,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monitoring data table
CREATE TABLE IF NOT EXISTS public.monitoring_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  monitoring_date DATE NOT NULL,
  satellite_image_url TEXT,
  forest_cover_percentage DECIMAL(5, 2),
  tree_count_estimate INTEGER,
  health_score DECIMAL(3, 2) CHECK (health_score >= 0 AND health_score <= 10),
  co2_absorption_rate DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for projects
CREATE POLICY "Users can view all projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "NGOs can insert their own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = submitted_by OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for project media
CREATE POLICY "Users can view project media" ON public.project_media
  FOR SELECT USING (true);

CREATE POLICY "Project owners can insert media" ON public.project_media
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects WHERE id = project_id AND submitted_by = auth.uid()
  ));

-- Create RLS policies for carbon credits
CREATE POLICY "Users can view available credits" ON public.carbon_credits
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage credits" ON public.carbon_credits
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Create RLS policies for monitoring data
CREATE POLICY "Users can view monitoring data" ON public.monitoring_data
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage monitoring data" ON public.monitoring_data
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));
