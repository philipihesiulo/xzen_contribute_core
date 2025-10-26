import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

export interface Token {
  name: string;
  symbol: string;
  balance: number;
  mint: string;
}

const fetchTokenAccounts = async (publicKey: PublicKey, connection: any) => {
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
  });

  const tokens: Token[] = [];

  for (const { account } of tokenAccounts.value) {
    const mint = new PublicKey(account.data.parsed.info.mint);
    const mintInfo = await getMint(connection, mint);

    tokens.push({
      name: "", // Will be fetched later
      symbol: "", // Will be fetched later
      balance: account.data.parsed.info.tokenAmount.uiAmount,
      mint: mint.toBase58(),
    });
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