import { User as SupabaseUser } from "@supabase/supabase-js";
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
    wallet_balance?: number;
};

export interface UserState {
    walletBalance: number;
    authUser: SupabaseUser | null;
    userProfile: UserProfile | null;
    error: Error | null;
    isLoading: boolean;
}

export interface UserActions {
    setAuthUser: (authUser: SupabaseUser | null) => void;
    fetchUserProfile: (userId: string) => void;
    setError: (error: Error) => void;
    setWalletBalance: (walletAddress: string) => void;
    reset: () => void;
}
