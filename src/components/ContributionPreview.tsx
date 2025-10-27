import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContributionToken } from "@/types/token";

interface ContributionPreviewProps {
    contribution: ContributionToken[];
    handleAmountChange: (_mint: string, _newAmount: number) => void;
}

export default function ContributionPreview({
    contribution,
    handleAmountChange,
}: ContributionPreviewProps) {
    return (
        <>
            {/* Contribution Preview */}
            <div className="mt-6 lg:mt-0">
                <Card className="bg-card border-border p-6">
                    <h2 className="mb-6 text-lg font-semibold">Contribution Preview</h2>

                    <div className="mb-6 space-y-3">
                        {contribution.map((token) => (
                            <div
                                key={token.mint}
                                className="flex items-center justify-between rounded-lg bg-secondary p-3">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/20" />
                                    <div>
                                        <div className="font-medium">{token.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {token.reward}
                                        </div>
                                    </div>
                                </div>
                                {/* Contribution Amount */}
                                <div className="text-right">
                                    <Input
                                        type="number"
                                        value={token.amount}
                                        onChange={(e) =>
                                            handleAmountChange(
                                                token.mint,
                                                parseInt(e.target.value, 10)
                                            )
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
                            <span className="font-bold">3 Tokens</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Reward</span>
                            <span className="font-bold">230 XZN Points</span>
                        </div>
                    </div>

                    <Button className="gradient-primary w-full shadow-glow">
                        Confirm Contribution
                    </Button>
                </Card>
            </div>
        </>
    );
}
