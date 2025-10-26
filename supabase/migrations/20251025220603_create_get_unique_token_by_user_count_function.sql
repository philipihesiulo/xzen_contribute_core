
CREATE OR REPLACE FUNCTION get_unique_token_count(user_uuid uuid)
RETURNS bigint AS $$
  SELECT 
    COUNT(DISTINCT token_address)
  FROM 
    public.contributions
  WHERE 
    user_id = user_uuid;
$$ LANGUAGE sql STABLE;