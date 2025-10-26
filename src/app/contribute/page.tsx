"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import DashboardLayout from "../dashboard-layout";
import { Input } from "@/components/ui/input";
import { useTokenDiscovery } from "@/hooks/useTokenDiscovery";

const selectedTokens = [
    { id: 1, name: "Bonk", amount: 100, reward: "+50 XZN" },
    { id: 2, name: "USDC", amount: 100, reward: "+50 XZN" },
    { id: 3, name: "Jito", amount: 100, reward: "+50 XZN" },
];

const Contribute = () => {
    const [contribution, setContribution] = useState(selectedTokens);
    const isMobile = useIsMobile();
    const { tokens, isLoading, error } = useTokenDiscovery();

    const handleAmountChange = (id: number, newAmount: number) => {
        setContribution((prev) =>
            prev.map((token) =>
                token.id === id ? { ...token, amount: newAmount } : token
            )
        );
    };
    const pageDescription = (
        <>
            Select the tokens you want to contribute. <br />
            You don't need to contribute all units of each token.
        </>
    );

    return (
        <DashboardLayout
            pageTitle="Contribute"
            pageDescription={pageDescription}
        >
            {/* Wallet Info */}
            {/*<div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 rounded-lg bg-card px-4 py-2 border border-border">
          <span className="text-sm">Connected: Phantom Wallet (7x8k...mN3p)</span>
          <button className="text-muted-foreground hover:text-foreground">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>*/}

            <div className="lg:grid gap-6 lg:grid-cols-3">
                {/* Token Selection */}
                <div className="lg:col-span-2">
                    <Card className="bg-card border-border">
                        <div className="flex items-center justify-between border-b border-border p-6">
                            <h2 className="text-lg font-semibold">
                                Select Tokens To Contribute
                            </h2>
                            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                                View on Solana Explorer{" "}
                                <ExternalLink className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            {isMobile ? (
                                <table className="w-full">
                                    <thead className="border-b border-border">
                                        <tr className="text-left text-sm text-muted-foreground">
                                            <th className="p-4 font-medium">
                                                Token
                                            </th>
                                            <th className="p-4 font-medium">
                                                Action
                                            </th>
                                            <th className="p-4 font-medium">
                                                Balance
                                            </th>
                                            <th className="p-4 font-medium">
                                                Contract Address
                                            </th>
                                            <th className="p-4 font-medium">
                                                Est. XZN Reward
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center">Loading tokens...</td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-red-500">Error loading tokens: {error.message}</td>
                                            </tr>
                                        ) : (
                                            tokens?.map((token, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-border last:border-0"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-primary/20" />
                                                            <span className="font-medium">
                                                                {token.symbol}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Button
                                                            size="sm"
                                                            className="gradient-primary"
                                                        >
                                                            Add
                                                        </Button>
                                                    </td>
                                                    <td className="p-4">
                                                        {token.balance}
                                                    </td>
                                                    <td className="p-4 text-muted-foreground">
                                                        {token.mint}
                                                    </td>
                                                    <td className="p-4 font-medium text-accent">
                                                        +50 XZN
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="w-full">
                                    <thead className="border-b border-border">
                                        <tr className="text-left text-sm text-muted-foreground">
                                            <th className="p-4 font-medium">
                                                Token
                                            </th>
                                            <th className="p-4 font-medium">
                                                Balance
                                            </th>
                                            <th className="p-4 font-medium">
                                                Contract Address
                                            </th>
                                            <th className="p-4 font-medium">
                                                Est. XZN Reward
                                            </th>
                                            <th className="p-4 font-medium">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center">Loading tokens...</td>
                                            </tr>
                                        ) : error ? (
                                            <tr>
                                                <td colSpan={5} className="p-4 text-center text-red-500">Error loading tokens: {error.message}</td>
                                            </tr>
                                        ) : (
                                            tokens?.map((token, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-border last:border-0"
                                                >
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-primary/20" />
                                                            <span className="font-medium">
                                                                {token.symbol}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        {token.balance}
                                                    </td>
                                                    <td className="p-4 text-muted-foreground">
                                                        {token.mint}
                                                    </td>
                                                    <td className="p-4 font-medium text-accent">
                                                        +50 XZN
                                                    </td>
                                                    <td className="p-4">
                                                        <Button
                                                            size="sm"
                                                            className="gradient-primary"
                                                        >
                                                            Add
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Contribution Preview */}
                <div className="mt-6 lg:mt-0">
                    <Card className="bg-card border-border p-6">
                        <h2 className="mb-6 text-lg font-semibold">
                            Contribution Preview
                        </h2>

                        <div className="mb-6 space-y-3">
                            {contribution.map((token) => (
                                <div
                                    key={token.id}
                                    className="flex items-center justify-between rounded-lg bg-secondary p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/20" />
                                        <div>
                                            <div className="font-medium">
                                                {token.name}
                                            </div>
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
                                                    token.id,
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
                                <span className="text-accent">
                                    You will receive 230 XZN Points
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-accent">
                                    +10% Streak Bonus
                                </span>
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
                                <span className="text-muted-foreground">
                                    Total Contribution
                                </span>
                                <span className="font-bold">3 Tokens</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total Reward
                                </span>
                                <span className="font-bold">
                                    230 XZN Points
                                </span>
                            </div>
                        </div>

                        <Button className="gradient-primary w-full shadow-glow">
                            Confirm Contribution
                        </Button>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Contribute;
