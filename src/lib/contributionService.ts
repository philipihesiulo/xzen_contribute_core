import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createTransferInstruction,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { ContributionToken } from "@/types/token";

async function recordContribution(
    userWalletAddress: string,
    signature: string,
    message: string, // <-- This parameter was missing
    tokens: ContributionToken[]
): Promise<void> {
    const response = await fetch("/api/record-contribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userWalletAddress,
            signature,
            message, // <-- It must be included in the body
            tokens,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to record contribution on the backend.");
    }

    console.log("Backend contribution recorded successfully.");
}
const DEV_WALLET_ADDRESS = process.env.NEXT_PUBLIC_DEVELOPER_WALLET_ADDRESS;

/**
 * Handles the entire contribution flow.
 *
 * @param connection - The Solana connection object.
 * @param wallet - The user's wallet adapter state.
 * @param tokens - An array of tokens the user wishes to contribute.
 * @returns The signature of the confirmed transaction.
 * @throws If any step in the process fails.
 */
export async function handleContribute(
    connection: Connection,
    wallet: WalletContextState,
    tokens: ContributionToken[]
): Promise<string> {
    if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Wallet is not connected or does not support signing.");
    }
    if (tokens.length === 0) {
        throw new Error("No tokens selected for contribution.");
    }

    console.log("Dev Wallet Public Key:", DEV_WALLET_ADDRESS);

    const devWalletPublicKey = new PublicKey(DEV_WALLET_ADDRESS!);

    const { publicKey: userPublicKey, signTransaction } = wallet;

    // 1. Create a new transaction
    const transaction = new Transaction();

    // 2. Add transfer instructions for each token
    for (const token of tokens) {
        const tokenPublicKey = new PublicKey(token.mint);

        // Get the address of the user's token account
        const fromAtaAddress = await getAssociatedTokenAddress(
            tokenPublicKey,
            userPublicKey // Owner
        );

        // Get the address of the dev wallet's token account
        const toAtaAddress = await getAssociatedTokenAddress(
            tokenPublicKey,
            devWalletPublicKey // Owner
        );

        // Check if the dev wallet's token account exists
        const toAtaInfo = await connection.getAccountInfo(toAtaAddress);

        // If the dev wallet's token account doesn't exist,
        // add an instruction to create it.
        if (!toAtaInfo) {
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    userPublicKey, // Payer (the user pays to create this)
                    toAtaAddress, // Address of the new account
                    devWalletPublicKey, // Owner of the new account
                    tokenPublicKey // Mint
                )
            );
        }

        // Add the transfer instruction to the transaction
        // We are transferring *from* the user's ATA *to* the dev's ATA.
        // The *owner* of the `fromAtaAddress` is the user.
        transaction.add(
            createTransferInstruction(
                fromAtaAddress, // Source
                toAtaAddress, // Destination
                userPublicKey, // Owner of the source account
                token.amount
            )
        );
    }

    // 3. Set the recent blockhash and fee payer
    const latestBlockHash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockHash.blockhash;
    transaction.feePayer = userPublicKey;

    // 4. Sign the transaction
    const signedTransaction = await signTransaction(transaction);

    // 5. Send the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());

    // 6. Confirm the transaction (THE NEW WAY)
    // --- THIS IS THE SECOND CHANGE ---
    // Use the new strategy object
    await connection.confirmTransaction(
        {
            signature: signature,
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        },
        "confirmed" // You can still pass your desired commitment level
    );

    console.log("Transaction confirmed with signature:", signature);

    // 7. Call backend to record contribution and calculate rewards
    //await recordContribution(userPublicKey.toBase58(), signature, tokens);

    return signature;
}
