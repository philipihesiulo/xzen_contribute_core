import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

// Define the shape of the request
interface RecordContributionRequest {
    userWalletAddress: string;
    signature: string; // This is now the transaction ID
}

// Create a new Solana Connection
const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!);
const DEV_WALLET_PK_STRING = process.env.NEXT_PUBLIC_DEVELOPER_WALLET_ADDRESS!;

if (!DEV_WALLET_PK_STRING) {
    throw new Error("Missing DEV_WALLET_ADDRESS from .env");
}

export async function POST(req: NextRequest) {
    // 1. Get the body by awaiting req.json()
    const { userWalletAddress, signature } = (await req.json()) as RecordContributionRequest;

    if (!userWalletAddress || !signature) {
        // 2. Return errors using NextResponse.json()
        return NextResponse.json(
            { error: "Missing userWalletAddress or signature." },
            { status: 400 }
        );
    }

    try {
        // -----------------------------------------------------------------
        // 3. (CRITICAL) Check for Replay Attack
        // -----------------------------------------------------------------
        // Has this signature already been used to claim points?
        const { count, error: countError } = await supabase
            .from("contributions")
            .select("*", { count: "exact", head: true })
            .eq("transaction_id", signature);

        if (countError) throw countError;
        if (count !== null && count > 0) {
            return NextResponse.json(
                { error: "This transaction has already been recorded." },
                { status: 400 }
            );
        }

        // -----------------------------------------------------------------
        // 4. Fetch and Verify the Transaction from the Blockchain
        // -----------------------------------------------------------------
        let tx;
        try {
            tx = await connection.getTransaction(signature, {
                maxSupportedTransactionVersion: 0, // Required for new transaction formats
            });
        } catch (error) {
            return NextResponse.json(
                { error: `Failed to fetch transaction. It may not be confirmed. ${error}` },
                { status: 400 }
            );
        }

        if (!tx) {
            return NextResponse.json(
                { error: "Transaction not found or not yet confirmed." },
                { status: 400 }
            );
        }

        if (tx.meta?.err) {
            return NextResponse.json({ error: "Transaction failed on-chain." }, { status: 400 });
        }

        // -----------------------------------------------------------------
        // 5. Verify the Signer (Fee Payer)
        // -----------------------------------------------------------------
        const signer = tx.transaction.message.getAccountKeys().staticAccountKeys[0].toBase58();
        console.log("Transaction signer:", signer);
        if (signer !== userWalletAddress) {
            return NextResponse.json(
                { error: "Transaction signer does not match user." },
                { status: 401 }
            );
        }

        // -----------------------------------------------------------------
        // 6. Parse Balances to Find *Actual* Contributions (Source of Truth)
        // -----------------------------------------------------------------
        // We will build our own 'tokens' array based on what *actually* happened.
        const verifiedContributions = [];

        // Map pre-balances by account index for easy lookup
        const preBalancesMap = new Map<number, bigint>();
        for (const b of tx.meta!.preTokenBalances || []) {
            preBalancesMap.set(b.accountIndex, BigInt(b.uiTokenAmount.amount));
        }

        // Loop through post-balances to see what the dev wallet *received*
        for (const postBalance of tx.meta!.postTokenBalances || []) {
            // Check if this token account is owned by the dev wallet
            if (postBalance.owner !== DEV_WALLET_PK_STRING) {
                continue;
            }

            const preBalance = BigInt(preBalancesMap.get(postBalance.accountIndex) || 0);
            const postBalanceAmount = BigInt(postBalance.uiTokenAmount.amount);

            // Calculate the amount *received*
            const amountReceived = postBalanceAmount - preBalance;

            if (amountReceived > 0) {
                verifiedContributions.push({
                    mint: postBalance.mint,
                    amount: Number(amountReceived), // Convert bigint back to number for JSON/DB
                });
            }
        }

        if (verifiedContributions.length === 0) {
            return NextResponse.json(
                { error: "No valid token transfers to dev wallet found." },
                { status: 400 }
            );
        }

        // -----------------------------------------------------------------
        // 7. Find User Profile
        // -----------------------------------------------------------------
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("wallet_address", userWalletAddress)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: "User profile not found." }, { status: 404 });
        }

        // -----------------------------------------------------------------
        // 8. Call the Atomic Database Function (This SQL doesn't change!)
        // -----------------------------------------------------------------
        // We pass the *verified* contributions, not the client's alleged ones.
        const { data: pointsEarned, error: rpcError } = await supabase.rpc("record_contributions", {
            p_user_id: profile.id,
            p_tokens: verifiedContributions, // <-- Pass the VERIFIED array
            p_signature: signature,
        });

        if (rpcError) throw rpcError;

        // 9. Return Success
        return NextResponse.json(
            {
                message: "Contribution recorded successfully.",
                pointsEarned: pointsEarned,
            },
            { status: 200 }
        ); // <-- Success response
    } catch (error) {
        console.error("Error in /api/record-contribution:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return NextResponse.json(
            { error: "Internal Server Error", details: errorMessage },
            { status: 500 }
        );
    }
}
