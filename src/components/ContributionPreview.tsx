"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useContributionStore } from "@/stores/contributionStore";
import { useModalStore } from "@/stores/modalStore";
import { STATUS } from "@/types/contribution";
import { useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ContributionPreview() {
    const {
        selected,
        status,
        response,
        error,
        totalReward,
        resetStatus,
        handleAmountChange,
        handleContribute,
    } = useContributionStore();
    const wallet = useWallet();
    const { connection } = useConnection();
    const { openModal } = useModalStore();

    useEffect(() => {
        switch (status) {
            case STATUS.LOADING:
                openModal({
                    title: "Transaction in Progress. Please wait!",
                    body: <LoadingSpinner />,
                });
                break;
            case STATUS.SUCCESS:
                openModal({
                    title: "Your contribution was successful!",
                    body: successMessage(),
                });
                resetStatus();
                break;
            case STATUS.FAILED:
                if (error) {
                    openModal({
                        title: "Contribution Failed",
                        body: errorMessage(),
                    });
                    resetStatus();
                }
                break;
            default:
                break;
        }
    }, [status]);

    const errorMessage = () => {
        return (
            <div>
                <h1>Pls try again!</h1>
                <p className="mt-6 mb-6">
                    If the error persists, try to refresh the page and contribute a different set of
                    tokens.
                </p>
                <p className="mt-6 text-red-500">{error ? error.toString() : ""}</p>
            </div>
        );
    };

    const successMessage = () => {
        return (
            <div>
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg">
                        <Image
                            src="/medal.svg"
                            alt="Medal Icon"
                            width={50}
                            height={50}
                            className="text-primary"
                        />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">XZN Points Earned</p>
                        <h2 className="text-3xl font-bold">{response?.pointsEarned} XZN</h2>
                    </div>
                </div>
                <div>
                    <p>Comeback tomorrow to earn more points</p>
                </div>
            </div>
        );
    };

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
                            <span className="text-accent">You will receive 0 Bonus XZN Points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-accent">+10% Streak Bonus</span>
                            <span className="text-xs text-muted-foreground">{`[Coming Soon]`}</span>
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
                            <span className="font-bold text-accent">{totalReward} XZN Points</span>
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
