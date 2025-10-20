import { Sidebar } from "@/components/Sidebar";
import { WalletBalance } from "@/components/WalletBalance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const tabs = ["Daily", "Weekly", "Monthly", "All-Time"];

const leaderboardData = Array(10).fill(null).map((_, i) => ({
  rank: i + 1,
  username: "x09e...756o",
  totalXZN: "2,950 XZN",
  contributions: 30,
  streak: "10 days",
  referral: 57,
}));

export default function Leaderboard() {
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
                <h1 className="text-2xl font-bold">Leaderboard</h1>
                <p className="text-sm text-muted-foreground">
                  See how your contributions rank across the community
                </p>
              </div>
            </div>
            <WalletBalance />
          </div>

          {/* Time Period Tabs */}
          <div className="mb-6 flex gap-2">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                  index === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Top Contributors */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <div className="border-b border-border p-6">
                  <h2 className="text-lg font-semibold">Top Contributors</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="p-4 font-medium">Rank</th>
                        <th className="p-4 font-medium">Username</th>
                        <th className="p-4 font-medium">Total XZN</th>
                        <th className="p-4 font-medium">Contributions</th>
                        <th className="p-4 font-medium">Streak</th>
                        <th className="p-4 font-medium">Referral</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((item) => (
                        <tr key={item.rank} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium">
                              {item.rank}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/20" />
                              <span className="font-medium">{item.username}</span>
                            </div>
                          </td>
                          <td className="p-4 font-medium">{item.totalXZN}</td>
                          <td className="p-4 text-muted-foreground">{item.contributions}</td>
                          <td className="p-4 text-muted-foreground">{item.streak}</td>
                          <td className="p-4 text-muted-foreground">{item.referral}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Your Rank Card */}
            <div>
              <Card className="bg-card border-border p-6">
                <h2 className="mb-6 text-lg font-semibold">Your Rank</h2>
                
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-bold text-primary">
                    7
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">7x8k...mN3p</div>
                    <div className="text-3xl font-bold">146</div>
                  </div>
                </div>

                <div className="mb-6 space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Rank</span>
                    <span className="font-medium">146</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total XZN</span>
                    <span className="font-medium">3,420 XZN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Streak</span>
                    <span className="font-medium">7 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Referrals</span>
                    <span className="font-medium">129</span>
                  </div>
                </div>

                <div className="mb-6 rounded-lg bg-secondary p-4">
                  <p className="text-sm text-muted-foreground">
                    +20,010 XZN to reach Top 10
                  </p>
                </div>

                <Button className="gradient-primary w-full shadow-glow">
                  Boost My Rank
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
