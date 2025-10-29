/**
 *
 * Atomically records multiple contributions. This function is now highly
 * efficient, calling the batch 'calculate_xzen_points' function 
 * only once and performing a single batch insert.
 *
 * @param p_user_id The UUID of the contributing user.
 * @param p_tokens A JSONB array of token objects: [{ "mint": "...", "amount": ... }]
 * @param p_signature The transaction signature.
 * @returns The total number of XZN points the user earned.
 */
CREATE OR REPLACE FUNCTION public.record_contributions(
    p_user_id uuid,
    p_tokens jsonb,
    p_signature text
)
RETURNS numeric
LANGUAGE plpgsql
-- Must be SECURITY DEFINER to insert contributions and update referrer's profile
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_points_earned numeric := 0;
    referral_bonus numeric;
    referrer_id uuid;
BEGIN
    -- 1. Create a temporary table to hold all contribution data,
    -- including the points calculated from the new batch function.
    CREATE TEMPORARY TABLE temp_contributions (
        mint text,
        amount numeric,
        points numeric
    ) ON COMMIT DROP; -- Table is automatically dropped when the function ends

    -- 2. This is the core logic:
    --    a. Unpack the input JSON
    --    b. Create an array of mints
    --    c. Call the batch-calculate function *once* with that array
    --    d. Join the results back to the input data
    --    e. Insert everything into the temp table
    WITH
    -- Unpack the JSONB input, adding an 'ordinality' to keep order
    input_data AS (
        SELECT 
            (row_number() over()) as ordinality,
            t.mint,
            t.amount
        FROM jsonb_to_recordset(p_tokens) AS t(mint text, amount numeric)
    ),
    -- Create the text array of mints to pass to the calculate function
    mints_array AS (
        SELECT array_agg(mint ORDER BY ordinality) as arr
        FROM input_data
    ),
    -- Call the batch function *once*
    calculated_points AS (
        SELECT 
            (row_number() over()) as ordinality,
            cp.mint,
            cp.points
        FROM public.calculate_xzen_points(
            p_user_id,
            (SELECT arr FROM mints_array)
        ) AS cp
    )
    -- Insert the combined data into the temp table
    INSERT INTO temp_contributions (mint, amount, points)
    SELECT
        id.mint,
        id.amount,
        cp.points
    FROM input_data AS id
    -- Join on the ordinality (row number) to map points back correctly
    JOIN calculated_points AS cp ON id.ordinality = cp.ordinality;

    -- 3. Now that all data is staged, insert it into the real table in one batch
    INSERT INTO public.contributions
        (user_id, token_address, amount, xzn_points_earned, transaction_id)
    SELECT
        p_user_id,
        mint,
        amount,
        points,
        p_signature
    FROM temp_contributions;

    -- 4. Calculate the total points earned from the temp table
    SELECT sum(points) INTO total_points_earned FROM temp_contributions;

    -- 5. Update user's total points (if any)
    IF total_points_earned > 0 THEN
        UPDATE public.profiles
        SET total_xzn_points = total_xzn_points + total_points_earned
        WHERE id = p_user_id;

        -- 6. Handle referral bonus
        SELECT referred_by INTO referrer_id FROM public.profiles WHERE id = p_user_id;

        IF referrer_id IS NOT NULL THEN
            referral_bonus := floor(total_points_earned * 0.1);
            IF referral_bonus > 0 THEN
                UPDATE public.profiles
                SET total_xzn_points = total_xzn_points + referral_bonus
                WHERE id = referrer_id;
            END IF;
        END IF;
    END IF;

    -- 7. Return the total points earned
    RETURN total_points_earned;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_contributions(uuid, jsonb, text) TO service_role;