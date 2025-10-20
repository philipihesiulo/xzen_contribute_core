import { Sidebar } from "@/components/Sidebar";
import { WalletBalance } from "@/components/WalletBalance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, RefreshCw, ExternalLink, ArrowLeft } from "lucide-react";
import { useState } from "react";

const tokens = [
  { name: "Bonk", symbol: "Bonk", balance: "0.52", contract: "rx86t...762yu", reward: "+50 XZN", status: "remove" },
  { name: "SOL", symbol: "SOL", balance: "0.52", contract: "rx86t...762yu", reward: "+50 XZN", status: "add" },
  { name: "Jito", symbol: "Jito", balance: "0.52", contract: "rx86t...762yu", reward: "+50 XZN", status: "remove" },
  { name: "USDC", symbol: "USDC", balance: "0.52", contract: "rx86t...762yu", reward: "+50 XZN", status: "remove" },
  { name: "SOL", symbol: "SOL", balance: "0.52", contract: "rx86t...762yu", reward: "+50 XZN", status: "add" },
  { name: "SOL", symbol: "SOL", balance: "0.52", contract: "rx86t...762yu", reward: "+50 XZN", status: "add" },
  { name: "SOL", symbol: "SOL", balance: "0.52", contract: "rx86t...762yu", reward: "+50 XZN", status: "add" },
];

const selectedTokens = [
  { name: "Bonk", amount: "0.02", reward: "+50 XZN" },
  { name: "USDC", amount: "100", reward: "+50 XZN" },
  { name: "Jito", amount: "100", reward: "+50 XZN" },
];

export default function Contribute() {
  const [contribution] = useState(selectedTokens);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Contribute</h1>
                <p className="text-sm text-muted-foreground">
                  Rewards are distributed instantly upon successful transaction. You don't need to contribute all your tokens.
                </p>
              </div>
            </div>
            <WalletBalance />
          </div>

          {/* Wallet Info */}
          <div className="mb-6 flex items-center justify-between">
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
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Token Selection */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h2 className="text-lg font-semibold">Select Token To Contribute</h2>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    View on Solana Explorer <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="p-4 font-medium">Token</th>
                        <th className="p-4 font-medium">Balance</th>
                        <th className="p-4 font-medium">Contract Address</th>
                        <th className="p-4 font-medium">Est. XZN Reward</th>
                        <th className="p-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/20" />
                              <span className="font-medium">{token.symbol}</span>
                            </div>
                          </td>
                          <td className="p-4">{token.balance}</td>
                          <td className="p-4 text-muted-foreground">{token.contract}</td>
                          <td className="p-4 font-medium text-accent">{token.reward}</td>
                          <td className="p-4">
                            {token.status === "add" ? (
                              <Button size="sm" className="gradient-primary">
                                Add
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline">
                                Remove
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Contribution Preview */}
            <div>
              <Card className="bg-card border-border p-6">
                <h2 className="mb-6 text-lg font-semibold">Contribution Preview</h2>
                
                <div className="mb-6 space-y-3">
                  {contribution.map((token, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20" />
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-xs text-muted-foreground">{token.reward}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{token.amount}</div>
                        <div className="text-xs text-muted-foreground">{token.name}</div>
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
                    <span className="text-xs text-muted-foreground">Transaction in progress</span>
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
          </div>
        </div>
      </main>
    </div>
  );
}
