import { ContributionToken } from "@/types/token";
import { supabase } from "@/lib/supabaseClient";
import { NextApiRequest, NextApiResponse } from "next";

// --- Solana-specific imports ---
import nacl from "tweetnacl"; // For signature verification
import bs58 from "bs58"; // For decoding base58 strings (like addresses and signatures)

// Define the shape of the request
interface RecordContributionRequest {
    userWalletAddress: string; // Base58 public key string
    signature: string; // Base58 encoded signature string
    message: string; // The clear-text message that was signed
    tokens: ContributionToken[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).end("Method Not Allowed");
    }

    const { userWalletAddress, signature, message, tokens } = req.body as RecordContributionRequest;

    if (!userWalletAddress || !signature || !message || !tokens || tokens.length === 0) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        // -----------------------------------------------------------------
        // 1. (CRITICAL) Verify the Solana signature
        // -----------------------------------------------------------------
        let isVerified: boolean;
        try {
            // Convert the message string to a Uint8Array (bytes)
            const messageBytes = new TextEncoder().encode(message);

            // Decode the base58 signature to bytes
            const signatureBytes = bs58.decode(signature);

            // Decode the base58 public key (wallet address) to bytes
            const publicKeyBytes = bs58.decode(userWalletAddress);

            // Verify the signature
            isVerified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
        } catch (error) {
            // This will catch errors from bs58.decode (e.g., "Invalid base58 string")
            return res.status(400).json({ error: "Invalid signature or wallet format." });
        }

        if (!isVerified) {
            return res.status(401).json({ error: "Signature verification failed." });
        }

        // --- Signature is VALID ---

        // -----------------------------------------------------------------
        // 2. Find user profile by wallet address (same as before)
        // -----------------------------------------------------------------
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("wallet_address", userWalletAddress)
            .single();

        if (profileError || !profile) {
            return res.status(404).json({ error: "User profile not found." });
        }

        const userId = profile.id;

        // -----------------------------------------------------------------
        // 3. Call the atomic database function (same as before)
        // -----------------------------------------------------------------
        const { data: pointsEarned, error: rpcError } = await supabase.rpc(
            "record_contributions_and_calculate_points",
            {
                p_user_id: userId,
                p_tokens: tokens,
                p_signature: signature, // We store the base58 signature
            }
        );

        if (rpcError) {
            throw rpcError;
        }

        // -----------------------------------------------------------------
        // 4. Return the successful result (same as before)
        // -----------------------------------------------------------------
        return res.status(200).json({
            message: "Contribution recorded successfully.",
            pointsEarned: pointsEarned,
        });
    } catch (error) {
        console.error("Error in /api/record-contribution:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return res.status(500).json({ error: "Internal Server Error", details: errorMessage });
    }
}
