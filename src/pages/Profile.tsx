import { Sidebar } from "@/components/Sidebar";
import { WalletBalance } from "@/components/WalletBalance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Copy, ExternalLink, ChevronRight, Flame } from "lucide-react";

const contributions = Array(8).fill(null).map(() => ({
  token: "Bonk",
  date: "Oct 3rd",
  points: "234 XZN Points",
}));

export default function Profile() {
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
              <h1 className="text-2xl font-bold">Your Profile</h1>
            </div>
            <WalletBalance />
          </div>

          {/* Profile Header */}
          <div className="mb-8 flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/20 text-4xl font-bold text-primary">
              7
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">7x8k...mN3p</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Connected: Phantom Wallet (7x8k...mN3p)</span>
                <button className="hover:text-foreground">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Contributions */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h3 className="text-lg font-semibold">My Contributions</h3>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    View on Solana Explorer <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="p-4 font-medium">Token</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributions.map((item, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/20" />
                              <span className="font-medium">{item.token}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{item.date}</td>
                          <td className="p-4 font-medium">{item.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right Column - Bonus & Settings */}
            <div className="space-y-6">
              {/* Streak Bonus */}
              <Card className="bg-card border-border p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Flame className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">+10% Bonus</h3>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  You're on a 7 day streak! Contribute now to reach Day 7 and earn +10% bonus.
                </p>
                <div className="h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full w-4/5 bg-gradient-to-r from-primary to-accent" />
                </div>
              </Card>

              {/* Settings */}
              <Card className="bg-card border-border p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold">Settings & Preference</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-secondary p-4">
                    <span className="font-medium">Notifications</span>
                    <Switch defaultChecked />
                  </div>
                  
                  <button className="flex w-full items-center justify-between rounded-lg bg-secondary p-4 text-left hover:bg-secondary/80">
                    <span className="font-medium">Wallet Settings</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                  
                  <button className="flex w-full items-center justify-between rounded-lg bg-secondary p-4 text-left hover:bg-secondary/80">
                    <span className="font-medium">Support</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
