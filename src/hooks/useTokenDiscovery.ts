import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { Token } from "@/types/token";
import { supabase } from "@/lib/supabaseClient";

const SOLANA_RPC_HOST = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "";

const umi = createUmi(SOLANA_RPC_HOST).use(mplTokenMetadata());

type TokenReward = {
    mint: string;
    points: number;
};

const fetchTokenAccounts = async (publicKey: PublicKey, connection: Connection) => {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
    });

    const tokens: Token[] = [];

    for (const { account } of tokenAccounts.value) {
        const { metadata } = await fetchDigitalAsset(umi, account.data.parsed.info.mint);
        const tokenDetails: Token = {
            name: metadata.name,
            symbol: metadata.symbol,
            balance: account.data.parsed.info.tokenAmount.uiAmount,
            mint: metadata.mint,
            uri: metadata.uri,
            reward: 10, // Placeholder for reward, to be calculated elsewhere
        };

        tokens.push(tokenDetails);
    }

    // TODO: Fetch and update reward data
    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (user) {
            const { data: rewards, error: rpcError } = await supabase.rpc("calculate_xzen_points", {
                p_user_id: user.id,
                p_token_mints: tokens.map((token) => token.mint),
            });
            if (rpcError) throw rpcError;
            if (rewards) {
                const tokensWithRewards = tokens.map((token) => {
                    const tokenReward = (token.reward = rewards.find(
                        (reward: TokenReward) => reward.mint === token.mint
                    )?.points);
                    token.reward = tokenReward;
                    return token;
                });
                return tokensWithRewards;
            }
        }
    } catch (error) {
        throw new Error(error as string);
    }

    return tokens;
};

const fetchTokenMetadata = async (tokens: Token[]): Promise<Token[]> => {
    const results = await Promise.allSettled(
        tokens.map(async (token) => {
            if (!token.uri) return token;

            try {
                const response = await fetch(token.uri, { method: "GET" });

                if (!response.ok) {
                    console.warn(
                        `Failed to fetch metadata for ${token.name}: HTTP ${response.status}`
                    );
                    return token;
                }

                const metadata = await response.json();

                return {
                    ...token,
                    description: metadata.description ?? token.description,
                    image: metadata.image ?? token.image,
                    createdOn: metadata.createdOn?.toString() ?? token.createdOn,
                };
            } catch (err) {
                console.error(`Error fetching metadata for ${token.name}:`, err);
                return token;
            }
        })
    );

    // Extract only fulfilled results, ignoring rejected ones gracefully
    return results.map((r) => (r.status === "fulfilled" ? r.value : tokens[results.indexOf(r)]));
};

export const useTokenDiscovery = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const { data, isLoading, error } = useQuery<Token[]>({
        queryKey: ["tokenDiscovery", publicKey?.toBase58()],
        queryFn: () => fetchTokenAccounts(publicKey!, connection),
        enabled: !!publicKey,
    });

    return { tokens: data || [], isLoading, error };
};

export const useTokensMetadata = () => {
    const { tokens } = useTokenDiscovery();

    const { data, isLoading, error } = useQuery<Token[]>({
        queryKey: ["tokenMetadata", tokens],
        queryFn: () => fetchTokenMetadata(tokens!),
        enabled: !!tokens,
    });

    return { tokensMetadata: data, isLoading, error };
};
