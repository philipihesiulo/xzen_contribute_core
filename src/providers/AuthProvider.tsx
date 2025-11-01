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
import { resetAllStores } from "@/lib/utils/storeUtils";

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
    const { authUser, isLoading, userProfile } = useUserStore();
    const { openModal, closeModal } = useModalStore();
    const router = useRouter();

    useEffect(() => {
        // Check for the initial session on app load
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                useUserStore.getState().setAuthUser(session.user);
            }
        });

        // Listen for auth state changes (login, logout)
        supabase.auth.onAuthStateChange((event, session) => {
            const user = session?.user || null;
            const currentAuthUser = useUserStore.getState().authUser;
            if (user && user?.id !== currentAuthUser?.id) {
                useUserStore.getState().setAuthUser(user);
            }

            if (event === "SIGNED_OUT") {
                useUserStore.getState().reset();
            }
        });
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (connected && !session) {
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
            } else if (isLoading && session && connected) {
                openModal({
                    title: "Loading your profile, please wait...",
                    body: <LoadingSpinner />,
                });
            } else if (connected && session && userProfile) {
                closeModal();
                router.push("/dashboard");
            }
        });
    }, [connected, authUser, isLoading, userProfile]);

    const connectWallet = () => {
        if (!connected) {
            setVisible(true);
        }
    };

    const signIn = async () => {
        if (!wallet.connected || !wallet.publicKey) {
            throw new Error("Wallet not connected or public key not available.");
        }
        const address = wallet.publicKey.toBase58();

        const message = `Sign in to Xzenlabs Contribute with wallet ${address} at ${new Date().toISOString()}`;
        await supabase.auth.signInWithWeb3({
            chain: "solana",
            statement: message,
            wallet: wallet as SolanaWallet,
        });
    };

    const signOut = async () => {
        if (connected) {
            await disconnect();
        }
        await supabase.auth.signOut().then(() => {
            resetAllStores();
            router.push("/");
        });
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
