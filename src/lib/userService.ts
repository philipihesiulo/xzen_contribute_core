import { PublicKey, LAMPORTS_PER_SOL, Connection } from "@solana/web3.js";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export const getWalletBalance = async (walletAddress: string) => {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!, "confirmed");
    if (!walletAddress) return 0;
    const balance = await connection.getBalance(new PublicKey(walletAddress));
    return balance / LAMPORTS_PER_SOL;
};

export const getOrCreateUser = async (user: User) => {
    console.log("Fetching user profile for:", user);

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error && error.code !== "PGRST116") {
        throw error;
    }

    if (profile) {
        console.log("Existing user profile found:", profile);
        return profile;
    }

    console.log("Creating new user profile for:", user);

    const { data: newUser, error: insertError } = await supabase
        .from("profiles")
        .insert({
            id: user.id,
            wallet_address: user.user_metadata.custom_claims.address,
            referral_code: Math.random().toString(36).substring(2, 12),
        })
        .select("*")
        .single();

    if (insertError) {
        throw insertError;
    }
    console.log("New user profile created:", newUser);

    return newUser;
};
