import { create } from "zustand";
import { PublicKey, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { UserProfile } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";
import { User as SupabaseUser } from "@supabase/supabase-js";
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
    setUserProfile: (userProfile: UserProfile) => void;
    setError: (error: Error) => void;
    setIsLoading: (isLoading: boolean) => void;
    setWalletBalance: (walletAddress: string, connection: Connection) => void;
    clearUser: () => void;
}

export const getWalletBalance = async (walletAddress: string, connection: Connection) => {
    console.log(connection);
    if (!walletAddress) return 0;
    const balance = await connection.getBalance(new PublicKey(walletAddress));
    return balance / LAMPORTS_PER_SOL;
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
    walletBalance: 0,
    authUser: null,
    userProfile: null,
    error: null,
    isLoading: false,
    setWalletBalance: async (walletAddress: string, connection: Connection) => {
        const balance = await getWalletBalance(walletAddress, connection);
        set({ walletBalance: balance });
    },
    setAuthUser: (authUser: SupabaseUser | null) => {
        set({ authUser });
        if (authUser) {
            get().fetchUserProfile(authUser.id);
        }
    },
    setUserProfile: (userProfile: UserProfile) => set({ userProfile }),
    setError: (error: Error) => set({ error }),
    fetchUserProfile: async (userId: string) => {
        const state = get();
        if (state.isLoading || state.userProfile?.id === userId) {
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) throw error;

            set({ userProfile: data, isLoading: false });
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
        useUserStore.getState().setAuthUser(session.user);
    }
});

// 2. Listen for auth state changes (login, logout)
supabase.auth.onAuthStateChange((event, session) => {
    const user = session?.user || null;
    const currentAuthUser = useUserStore.getState().authUser;

    // Only update if the user ID is different, to avoid unnecessary fetches
    if (user && user?.id !== currentAuthUser?.id) {
        useUserStore.getState().setAuthUser(user);
    }

    // Ensure user is cleared on SIGNED_OUT
    if (event === "SIGNED_OUT") {
        useUserStore.getState().clearUser();
    }
});
