export type UserProfile = {
    id: string;
    wallet_address: string;
    username: string | null;
    avatar_url: string | null;
    total_xzn_points: number;
    current_streak: number;
    last_contribution_date: string | null;
    unique_token_count: number;
    referral_code: string | null;
    referred_by: string | null;
    created_at: string;
    updated_at: string;
};
