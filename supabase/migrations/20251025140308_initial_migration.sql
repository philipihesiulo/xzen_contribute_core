-- 1. Create the 'profiles' table
-- This table links to auth.users and holds user-specific data.
CREATE TABLE public.profiles (
    id uuid NOT NULL PRIMARY KEY, -- Primary key, references auth.users
    wallet_address text UNIQUE,
    username text UNIQUE,
    avatar_url text,
    total_xzn_points numeric DEFAULT 0,
    current_streak integer DEFAULT 0,
    last_contribution_date date,
    referral_code text UNIQUE,
    referred_by uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),

    -- Foreign key to the auth.users table
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Self-referencing foreign key for referrals
    CONSTRAINT profiles_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Comment: Allow Supabase to manage the 'profiles' table
ALTER TABLE public.profiles OWNER TO postgres;
GRANT ALL ON TABLE public.profiles TO postgres;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.profiles TO authenticated;
GRANT SELECT ON TABLE public.profiles TO anon;


-- 2. Create the 'contributions' table
-- This table stores contribution records for each user.
CREATE TABLE public.contributions (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(), -- Primary key with a default UUID
    user_id uuid NOT NULL, -- Foreign key to the profiles table
    token_address text,
    amount numeric,
    xzn_points_earned numeric DEFAULT 0,
    transaction_id text,
    created_at timestamptz DEFAULT now(),

    -- Foreign key to the profiles.id
    CONSTRAINT contributions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Comment: Allow Supabase to manage the 'contributions' table
ALTER TABLE public.contributions OWNER TO postgres;
GRANT ALL ON TABLE public.contributions TO postgres;
GRANT ALL ON TABLE public.contributions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.contributions TO authenticated;
GRANT SELECT ON TABLE public.contributions TO anon;


-- 3. Set up the 'updated_at' trigger function
-- This function automatically updates 'updated_at' columns on any row update.
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Apply the trigger to the 'profiles' table
-- (The 'contributions' table doesn't have an 'updated_at' column)
CREATE TRIGGER on_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();


-- 5. Enable Row Level Security (RLS) on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;


-- 6. Create RLS policies for the 'profiles' table
CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles
FOR SELECT TO public
USING (true);

CREATE POLICY "Users can insert their own profile."
ON public.profiles
FOR INSERT TO public
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
ON public.profiles
FOR UPDATE TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- 7. Create RLS policies for the 'contributions' table
CREATE POLICY "Contributions are viewable by everyone."
ON public.contributions
FOR SELECT TO public
USING (true);

CREATE POLICY "Users can insert their own contribution."
ON public.contributions
FOR INSERT TO public
WITH CHECK (auth.uid() = user_id);