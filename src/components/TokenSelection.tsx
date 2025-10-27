import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { Token } from "@/types/token";

interface TokenSelectionProps {
    isMobile: boolean;
    tokens: Token[];
    isLoading: boolean;
    error: Error | null;
}

export const TokenSelection = ({ isMobile, tokens, isLoading, error }: TokenSelectionProps) => {
    // Component implementation
    return (
        <div className="col-span-2">
            {/* Token Selection */}
            <Card className="bg-card border-border">
                <div className="flex items-center justify-between border-b border-border p-6">
                    <h2 className="text-lg font-semibold">Select Tokens To Contribute</h2>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        View on Solana Explorer <ExternalLink className="h-4 w-4" />
                    </button>
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
                                                <Button
                                                    size="sm"
                                                    className="gradient-primary">
                                                    Add
                                                </Button>
                                            </td>
                                        )}
                                        <td className="p-4 font-medium text-accent">+50 XZN</td>
                                        <td className="p-4">{token.balance}</td>
                                        <td className="p-4 text-muted-foreground">
                                            {shortenAddress(token.mint)}
                                        </td>
                                        {!isMobile && (
                                            <td className="p-4">
                                                <Button
                                                    size="sm"
                                                    className="gradient-primary">
                                                    Add
                                                </Button>
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
