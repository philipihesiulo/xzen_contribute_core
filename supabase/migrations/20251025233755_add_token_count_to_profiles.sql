-- 1. Add the new column to the 'profiles' table
ALTER TABLE public.profiles
ADD COLUMN unique_token_count integer NOT NULL DEFAULT 0;


-- 2. Create the trigger function
CREATE OR REPLACE FUNCTION public.update_profile_unique_token_count()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Determine which user_id to update based on the operation
  IF (TG_OP = 'DELETE') THEN
    v_user_id := OLD.user_id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  -- Re-calculate the count for that user and update the profiles table
  UPDATE public.profiles
  SET unique_token_count = (
    SELECT COUNT(DISTINCT token_address)
    FROM public.contributions
    WHERE user_id = v_user_id
  )
  WHERE id = v_user_id;

  -- This handles the rare case where a contribution's user_id is changed
  IF (TG_OP = 'UPDATE' AND NEW.user_id <> OLD.user_id) THEN
    -- Update the count for the OLD user as well
    UPDATE public.profiles
    SET unique_token_count = (
      SELECT COUNT(DISTINCT token_address)
      FROM public.contributions
      WHERE user_id = OLD.user_id
    )
    WHERE id = OLD.user_id;
  END IF;

  RETURN NULL; -- Result is ignored for AFTER triggers
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER is crucial to bypass RLS


-- 3. Create the trigger
-- This trigger fires the function after any change to the contributions table
CREATE TRIGGER on_contribution_change
AFTER INSERT OR UPDATE OR DELETE ON public.contributions
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_unique_token_count();