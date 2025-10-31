import { create } from "zustand";
import { UserProfile } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";
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
        console.log("Setting auth user:", authUser);
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
            console.log("Fetching user profile for:", userId);
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

// 1. Check for the initial session on app load
supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
        console.log("Initial session found:", session);
        useUserStore.getState().setAuthUser(session.user);
    }
});

// 2. Listen for auth state changes (login, logout)
supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    const currentAuthUser = useUserStore.getState().authUser;

    // Only update if the user ID is different, to avoid unnecessary fetches
    if (user && user?.id !== currentAuthUser?.id) {
        console.log("New session found:", user);
        useUserStore.getState().setAuthUser(user);
    }

    // Ensure user is cleared on SIGNED_OUT
    if (event === "SIGNED_OUT") {
        console.log("User signed out:", user);
        useUserStore.getState().clearUser();
    }
});

console.log("UserStore Getting called", useUserStore.getState());
