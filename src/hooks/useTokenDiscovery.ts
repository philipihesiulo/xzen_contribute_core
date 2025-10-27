import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { Token } from "@/types/token";

const SOLANA_RPC_HOST = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "";

const umi = createUmi(SOLANA_RPC_HOST).use(mplTokenMetadata());

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

        // Fetch the off-chain JSON metadata
        // try {
        //   const response = await fetch(metadata.uri);
        //   const additional_metadata = await response.json();

        //   console.log("Additional Metadata for mint", metadata.mint, " : ", additional_metadata);

        //   if (additional_metadata) {
        //     tokenDetails.description = additional_metadata.description || "";
        //     tokenDetails.image = additional_metadata.image || "";
        //     tokenDetails.createdOn = additional_metadata.createdOn?.toString() || "";
        //   }
        // }catch (error) {
        //   console.log("Error fetching metadata for mint", metadata.mint, ": ", error);
        // }

        tokens.push(tokenDetails);
    }
    return tokens;
};

const fetchTokenMetadata = async (tokens: Token[]) => {
    return await Promise.all(
        tokens.map(async (token) => {
            console.log(token.uri);
            if (token.uri) {
                try {
                    const response = await fetch(token.uri);
                    const metadata = await response.json();
                    token.description = metadata.description;
                    token.image = metadata.image;
                    token.createdOn = metadata.createdOn?.toString();
                    return token;
                } catch (error) {
                    console.log(error);
                }
            }
            return token;
        })
    );
};

export const useTokenDiscovery = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const { data, isLoading, error } = useQuery<Token[]>({
        queryKey: ["tokenDiscovery", publicKey?.toBase58()],
        queryFn: () => fetchTokenAccounts(publicKey!, connection),
        enabled: !!publicKey,
    });

    return { tokens: data, isLoading, error };
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
