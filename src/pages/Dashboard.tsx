import { Sidebar } from "@/components/Sidebar";
import { WalletBalance } from "@/components/WalletBalance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Flame, Calendar, Award, Share2, ChevronDown } from "lucide-react";

const stats = [
  {
    icon: Flame,
    label: "+10% Bonus",
    value: "Reach 7 days and earn",
    progress: 70,
  },
  {
    icon: Calendar,
    label: "Day 7",
    value: "Daily Streak",
  },
  {
    icon: Award,
    label: "42",
    value: "Tokens Contributed",
  },
];

const contributions = [
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
  { token: "SOL", contract: "SPL Token", amount: "0.5", date: "Oct 3", points: "50 XZN", bonus: "+10%" },
];

const leaderboard = [
  { rank: 1, username: "x09e...756o", points: "500 XZN" },
  { rank: 2, username: "x09e...756o", points: "500 XZN" },
  { rank: 3, username: "x09e...756o", points: "500 XZN" },
  { rank: 4, username: "x09e...756o", points: "500 XZN" },
  { rank: 5, username: "x09e...756o", points: "500 XZN" },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3 rounded-lg bg-card px-4 py-2 border border-border">
              <span className="text-sm text-muted-foreground">Wallet address: 7x8k...mN3p</span>
              <button className="text-muted-foreground hover:text-foreground">
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <WalletBalance />
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground">{stat.value}</p>
                    {stat.progress && (
                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Points and Contributions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Total Points */}
              <Card className="bg-card border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total XZN Points</p>
                      <h2 className="text-3xl font-bold">3,420 XZN</h2>
                    </div>
                  </div>
                  <Button className="gradient-primary">Contribute Now</Button>
                </div>
              </Card>

              {/* Recent Contributions */}
              <Card className="bg-card border-border">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h3 className="text-lg font-semibold">My Recent Contributions</h3>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    All <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="p-4 font-medium">Token</th>
                        <th className="p-4 font-medium">Contract Address</th>
                        <th className="p-4 font-medium">Amount</th>
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Points Earned</th>
                        <th className="p-4 font-medium">Streak Bonus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contributions.map((item, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary/20" />
                              <span className="font-medium">{item.token}</span>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{item.contract}</td>
                          <td className="p-4">{item.amount}</td>
                          <td className="p-4 text-muted-foreground">{item.date}</td>
                          <td className="p-4 font-medium">{item.points}</td>
                          <td className="p-4 text-accent">{item.bonus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right Column - Referral and Leaderboard */}
            <div className="space-y-6">
              {/* Referral Summary */}
              <Card className="bg-card border-border p-6">
                <h3 className="mb-4 text-lg font-semibold">Referral Summary</h3>
                <div className="mb-4 space-y-2">
                  <div className="font-bold">Alex004</div>
                  <div className="text-xs text-muted-foreground">xzen.app/?code=alex004</div>
                </div>
                <Button className="gradient-primary w-full mb-4">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Code
                </Button>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Referrals</span>
                    <span className="font-medium">129</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Referrals</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Referral Earnings</span>
                    <span className="font-medium">350 XZN</span>
                  </div>
                </div>
              </Card>

              {/* Leaderboard Preview */}
              <Card className="bg-card border-border">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h3 className="text-lg font-semibold">Leaderboard</h3>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    This Week <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-lg font-bold text-primary">
                      7
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">7x8k...mN3p</div>
                      <div className="font-bold">Your Rank: 146</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {leaderboard.map((item) => (
                      <div key={item.rank} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                            {item.rank}
                          </div>
                          <span className="text-muted-foreground">{item.username}</span>
                        </div>
                        <span className="font-medium">{item.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
