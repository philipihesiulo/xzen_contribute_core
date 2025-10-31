import { create } from "zustand";
import { UserProfile } from "@/types/user";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getWalletBalance, getOrCreateUser } from "@/lib/userService";
import Error from "next/error";

interface UserState {
    walletBalance: number;
    authUser: SupabaseUser | null;
    userProfile: UserProfile | null;
    error: Error | null;
    isLoading: boolean;
}

interface UserActions {
    setAuthUser: (authUser: SupabaseUser | null) => void;
    fetchUserProfile: (userId: string) => void;
    setError: (error: Error) => void;
    setIsLoading: (isLoading: boolean) => void;
    setWalletBalance: (walletAddress: string) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState & UserActions>((set, get) => ({
    walletBalance: 0,
    authUser: null,
    userProfile: null,
    error: null,
    isLoading: false,
    setWalletBalance: async (walletAddress: string) => {
        const balance = await getWalletBalance(walletAddress);
        set({ walletBalance: balance });
    },
    setAuthUser: (authUser: SupabaseUser | null) => {
        set({ authUser });
        if (authUser) {
            get().fetchUserProfile(authUser.id);
            get().setWalletBalance(authUser.user_metadata.custom_claims.address);
        }
    },
    setError: (error: Error) => set({ error }),
    fetchUserProfile: async (userId: string) => {
        const state = get();
        if (state.isLoading || state.userProfile?.id === userId) {
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const userProfile = await getOrCreateUser(state.authUser!);

            set({ userProfile, isLoading: false });
        } catch (error) {
            set({ error: error as Error, isLoading: false });
        }
    },
    clearUser: () => {
        set({
            walletBalance: 0,
            authUser: null,
            userProfile: null,
            error: null,
            isLoading: false,
        });
    },
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
