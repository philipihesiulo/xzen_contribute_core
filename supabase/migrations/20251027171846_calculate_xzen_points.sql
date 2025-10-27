/**
 * REUSABLE BATCH-CALCULATION FUNCTION
 *
 * Calculates the XZN points for an *array* of token contributions by a 
 * specific user. This function is read-only and highly efficient,
 * avoiding N+1 query problems.
 *
 * @param p_user_id The UUID of the contributing user.
 * @param p_token_mints A PostgreSQL array of token mint addresses (e.g., '{"mint1", "mint2"}').
 * @returns A table of records (mint text, points numeric).
 */
CREATE OR REPLACE FUNCTION public.calculate_xzen_points(
    p_user_id uuid,
    p_token_mints text[]
)
RETURNS TABLE(mint text, points numeric)
LANGUAGE sql
STABLE -- Indicates the function is read-only and safe.
SECURITY INVOKER
SET search_path = public
AS $$
    WITH 
    -- 1. Unpack the input array of mints, keeping their original order (ordinality)
    input_tokens AS (
        SELECT mint, ordinality
        FROM unnest(p_token_mints) WITH ORDINALITY AS t(mint, ordinality)
    ),
    -- 2. Get the unique set of mints to avoid redundant calculations
    unique_mints AS (
        SELECT DISTINCT mint FROM input_tokens
    ),
    -- 3. Get user-specific contribution counts for each unique mint
    user_counts AS (
        SELECT
            um.mint,
            count(c.id) AS user_count
        FROM unique_mints AS um
        LEFT JOIN contributions AS c 
            ON um.mint = c.token_address AND c.user_id = p_user_id
        GROUP BY um.mint
    ),
    -- 4. Get global (total) contribution counts for each unique mint
    total_counts AS (
        SELECT
            um.mint,
            count(c.id) AS total_count
        FROM unique_mints AS um
        LEFT JOIN contributions AS c 
            ON um.mint = c.token_address
        GROUP BY um.mint
    ),
    -- 5. Apply the points logic for each unique mint
    mint_points AS (
        SELECT
            uc.mint,
            CASE
                WHEN uc.user_count = 0 THEN 100  -- New token for this user
                WHEN tc.total_count < 5 THEN 20   -- Rare token
                ELSE 5                             -- Common token
            END AS points
        FROM user_counts AS uc
        JOIN total_counts AS tc ON uc.mint = tc.mint
    )
    -- 6. Map the calculated points back to the original (non-unique) input list
    -- This ensures if the input was ['A', 'B', 'A'], the output has 3 rows.
    SELECT
        it.mint,
        mp.points
    FROM input_tokens AS it
    JOIN mint_points AS mp ON it.mint = mp.mint
    ORDER BY it.ordinality; -- Return points in the same order as the input array
$$;

-- Grant execute permission so your other functions (and app) can use it
GRANT EXECUTE ON FUNCTION public.calculate_points(uuid, text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_points(uuid, text[]) TO service_role;