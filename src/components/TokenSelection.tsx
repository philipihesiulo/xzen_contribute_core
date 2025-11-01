"use client";

import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { shortenAddress } from "@/lib/utils/generalUtils";
import Image from "next/image";
import Link from "next/link";
import { Token } from "@/types/token";
import { useUserStore } from "@/stores/userStore";
import { SelectTokenButton } from "./SelectTokenButton";
import LoadingSpinner from "./LoadingSpinner";
import { useIsMobile } from "@/hooks/useMobile";
import { useEffect } from "react";
import { useTokenDiscovery, useTokensMetadata } from "@/hooks/useTokenDiscovery";

export const TokenSelection = () => {
    const { userProfile } = useUserStore();

    const isMobile = useIsMobile();
    const { tokens, isLoading, error } = useTokenDiscovery();
    const {
        tokensMetadata,
        isLoading: isMetadataLoading,
        error: metadataError,
    } = useTokensMetadata();

    useEffect(() => {
        console.log("[EFFECT] Tokens Metadata: ", tokensMetadata);
        console.log("[EFFECT] Tokens: ", tokens);
        if (!isMetadataLoading && !metadataError) {
            // Merge tokens with their metadata
            const updatedTokens: Token[] = [];
            tokens?.forEach((token) => {
                const metadata = tokensMetadata?.find((meta) => meta.mint === token.mint);
                if (metadata) {
                    updatedTokens.push(metadata);
                } else {
                    updatedTokens.push(token);
                }
            });
        }
    }, [tokens, tokensMetadata]);

    return (
        <div className="col-span-2">
            {/* Token Selection */}
            <Card className="bg-card border-border">
                <div className="flex items-center justify-between border-b border-border p-6">
                    <h2 className="text-lg font-semibold">Select Tokens To Contribute</h2>
                    <Link
                        href={`https://solscan.io/account/${userProfile?.wallet_address}`}
                        target="_blank">
                        <button className="cursor-pointer flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                            View on Solana Explorer <ExternalLink className="h-4 w-4" />
                        </button>
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border">
                            <tr className="text-left text-sm text-muted-foreground">
                                <th className="p-4 font-medium">Token</th>
                                {isMobile && <th className="p-4 font-medium">Action</th>}
                                <th className="p-4 font-medium">Reward</th>
                                <th className="p-4 font-medium">Balance</th>
                                <th className="p-4 font-medium">Contract Address</th>
                                {!isMobile && <th className="p-4 font-medium">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-4 text-center">
                                        Loading tokens...
                                        <LoadingSpinner />
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-4 text-center text-red-500">
                                        Error loading tokens: {error.message}
                                    </td>
                                </tr>
                            ) : !tokens.length ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-4 text-center text-red-500">
                                        No tokens found in your wallet. <br /> Connect a different
                                        wallet and try again.
                                    </td>
                                </tr>
                            ) : (
                                tokens?.map((token, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-border last:border-0">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-primary/20">
                                                    {token.image && (
                                                        <Image
                                                            src={`/api/image-proxy?url=${encodeURIComponent(
                                                                token.image
                                                            )}`}
                                                            alt={token.name}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {token.symbol}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        {token.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        {isMobile && (
                                            <td className="p-4">
                                                <SelectTokenButton token={token} />
                                            </td>
                                        )}
                                        <td className="p-4 font-medium text-accent">
                                            +{token.reward} XZN
                                        </td>
                                        <td className="p-4">{token.balance}</td>
                                        <td className="p-4 text-muted-foreground">
                                            {token.mint ? shortenAddress(token.mint) : "No Mint"}
                                        </td>
                                        {!isMobile && (
                                            <td className="p-4">
                                                <SelectTokenButton token={token} />
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
