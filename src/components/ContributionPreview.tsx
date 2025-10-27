import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useContributionStore } from "@/stores/contributionStore";
import { handleContribute } from "@/lib/contributionService";

export default function ContributionPreview() {
    const { selected, handleAmountChange } = useContributionStore();
    const wallet = useWallet();
    const { connection } = useConnection();

    return (
        <>
            {/* Contribution Preview */}
            <div className="mt-6 lg:mt-0">
                <Card className="bg-card border-border p-6">
                    <h2 className="mb-6 text-lg font-semibold">Contribution Preview</h2>

                    <div className="mb-6 space-y-3">
                        {selected.map((token) => (
                            <div
                                key={token.mint}
                                className="flex items-center justify-between rounded-lg bg-secondary p-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20" />
                                    <div>
                                        <div className="font-medium">{token.symbol}</div>
                                        <div className="">
                                            <p className="text-xs text-accent">
                                                +{token.reward} XZN
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* Contribution Amount */}
                                <div className="text-right">
                                    <Input
                                        type="number"
                                        max={token.balance}
                                        value={token.balance > 100 ? token.amount : token.balance}
                                        onChange={(e) =>
                                            handleAmountChange(token, parseInt(e.target.value, 10))
                                        }
                                        className="w-24 text-right text-lg font-semibold"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-6 space-y-2 border-t border-border pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-accent">You will receive 230 XZN Points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-accent">+10% Streak Bonus</span>
                            <span className="text-xs text-muted-foreground">
                                Transaction in progress
                            </span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                            <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent" />
                        </div>
                    </div>

                    <div className="mb-6 space-y-2 border-t border-border pt-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Contribution</span>
                            <span className="font-bold">{selected.length} Tokens</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Reward</span>
                            <span className="font-bold">230 XZN Points</span>
                        </div>
                    </div>

                    <Button
                        className="gradient-primary w-full shadow-glow"
                        onClick={async () => await handleContribute(connection, wallet, selected)}
                        disabled={!wallet.publicKey}>
                        {wallet.publicKey ? "Confirm Contribution" : "Wallet not connected"}
                    </Button>
                </Card>
            </div>
        </>
    );
}
