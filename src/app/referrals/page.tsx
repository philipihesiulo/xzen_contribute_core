import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import DashboardLayout from "../dashboard-layout";

const stats = [
    { label: "Total Referrals", value: "25" },
    { label: "Active Referrals", value: "7" },
    { label: "Referral Earnings", value: "+3561 XZN" },
    { label: "Top Referral", value: "Day 7" },
];

const referralData = Array(5)
    .fill(null)
    .map(() => ({
        user: "Jane004",
        joinDate: "0.52",
        contributions: "SPL Token",
        earned: "+50 XZN",
        status: "Active",
    }));

export default function Referrals() {
    return (
        <DashboardLayout
            pageTitle="Referrals"
            pageDescription="Invite friends, grow the community, and earn 10% of their contribution rewards.">
            {/* Referral Code */}
            <Card className="bg-card border-border p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Alex004</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>xzen.app/?code=alex004</span>
                            <button className="hover:text-foreground">
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <Button className="gradient-primary">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Code
                    </Button>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="mb-6 grid gap-4 md:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card
                        key={index}
                        className="bg-card border-border p-6">
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </Card>
                ))}
            </div>

            {/* Referral Performers Table */}
            <Card className="bg-card border-border">
                <div className="border-b border-border p-6">
                    <h2 className="text-lg font-semibold">Referral Performers</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-border">
                            <tr className="text-left text-sm text-muted-foreground">
                                <th className="p-4 font-medium">Referral User</th>
                                <th className="p-4 font-medium">Join Date</th>
                                <th className="p-4 font-medium">Contributions</th>
                                <th className="p-4 font-medium">XZN Earned</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referralData.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-border last:border-0">
                                    <td className="p-4 font-medium">{item.user}</td>
                                    <td className="p-4 text-muted-foreground">{item.joinDate}</td>
                                    <td className="p-4 text-muted-foreground">
                                        {item.contributions}
                                    </td>
                                    <td className="p-4 font-medium">{item.earned}</td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 text-sm">
                                            <span className="h-2 w-2 rounded-full bg-green-500" />
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </DashboardLayout>
    );
}
