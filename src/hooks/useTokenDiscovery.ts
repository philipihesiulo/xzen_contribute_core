import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata'


const SOLANA_RPC_HOST = process.env.NEXT_PUBLIC_SOLANA_RPC_HOST || "";

const umi = createUmi(SOLANA_RPC_HOST).use(mplTokenMetadata())

export interface Token {
  name: string;
  symbol: string;
  balance: number;
  mint: string;
  description?: string,
  image?: string,
  createdOn?: string,
}

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
    };

    // Fetch the off-chain JSON metadata
    try {
      const response = await fetch(metadata.uri);
      const additional_metadata = await response.json();

      console.log("Additional Metadata for mint", metadata.mint, " : ", additional_metadata);

      if (additional_metadata) {
        tokenDetails.description = additional_metadata.description || "";
        tokenDetails.image = additional_metadata.image || "";
        tokenDetails.createdOn = additional_metadata.createdOn?.toString() || "";
      }
    }catch (error) {
      console.log("Error fetching metadata for mint", metadata.mint, ": ", error);
    }

    tokens.push(tokenDetails);
  }
  return tokens;
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