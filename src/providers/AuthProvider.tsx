"use client";

import React, {
    FC,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import {
    signInWithSolana,
    signOut as supabaseSignOut,
} from "@/lib/authService";

interface AuthContextType {
    user: User | null;
    walletAddress: string | null;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const wallet = useWallet();
    const { publicKey, connected, disconnect } = wallet;
    const { setVisible } = useWalletModal();
    const walletAddress = useMemo(
        () => publicKey?.toBase58() || null,
        [publicKey]
    );

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user || null);
                setIsLoading(false);
            }
        );

        // Check initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user || null);
            setIsLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [wallet, user]);

    const signIn = async () => {
        if (!connected) {
            setVisible(true);
            return;
        }

        try {
            console.log("About to signin user...");
            await signInWithSolana(wallet);
        } catch (error) {
            console.error("Failed to sign in:", error);
            throw new Error("Wallet not ready for signing.");
        }
    };

    const signOut = async () => {
        try {
            await supabaseSignOut();
            if (connected) {
                await disconnect();
            }
        } catch (error) {
            throw Error(`Failed to sign out: ${error}`);
        }
    };

    const value = useMemo(
        () => ({
            user,
            walletAddress,
            isLoading,
            signIn,
            signOut,
            isConnected: connected,
        }),
        [user, walletAddress, isLoading, connected, signIn, signOut]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
