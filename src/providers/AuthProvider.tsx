"use client";

import React, { FC, createContext, useContext, useEffect, useMemo } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "@/lib/supabaseClient";
import { SolanaWallet } from "@supabase/supabase-js";
import { useUserStore } from "@/stores/userStore";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useModalStore } from "@/stores/modalStore";
import { useRouter } from "next/navigation";

interface AuthContextType {
    connectWallet: () => void;
    signOut: () => Promise<void>;
    walletConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const wallet = useWallet();
    const { connected, disconnect } = wallet;
    const { setVisible } = useWalletModal();
    const { authUser, userProfile, clearUser, isLoading } = useUserStore();
    const { openModal, closeModal } = useModalStore();
    const router = useRouter();

    useEffect(() => {
        console.log("User Auth", authUser);
        console.log("User Profile", userProfile);
        console.log("Auth User", authUser);
        console.log("Connected", connected);
        if (connected && !authUser) {
            openModal({
                title: "Sign wallet",
                body: (
                    <>
                        <p>Approve the wallet message to continue...</p>
                    </>
                ),
            });
            (async () => {
                await signIn();
            })();
        } else if (isLoading && authUser) {
            openModal({
                title: "Please wait...",
                body: <LoadingSpinner />,
            });
        } else if (connected && authUser) {
            closeModal();
            router.push("/dashboard");
        }
    }, [connected, authUser, isLoading]);

    const connectWallet = () => {
        if (!connected) {
            setVisible(true);
        }
    };

    const signIn = async () => {
        try {
            if (!wallet.connected || !wallet.publicKey) {
                throw new Error("Wallet not connected or public key not available.");
            }
            const address = wallet.publicKey.toBase58();

            const message = `Sign in to Xzenlabs Contribute with wallet ${address} at ${new Date().toISOString()}`;
            console.log("About To");
            await supabase.auth.signInWithWeb3({
                chain: "solana",
                statement: message,
                wallet: wallet as SolanaWallet,
            });
        } catch (error) {
            console.error("Error signing in with Solana:", error);
            throw error;
        }
    };

    const signOut = async () => {
        if (connected) {
            console.log("Disconnecting wallet...");
            await disconnect();
        }
        clearUser();
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
            throw error;
        }
    };

    const value = useMemo(
        () => ({
            connectWallet,
            signOut,
            walletConnected: connected,
        }),
        [connected, connectWallet, signOut]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
