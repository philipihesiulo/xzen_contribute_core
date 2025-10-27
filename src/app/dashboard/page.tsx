"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame, Calendar, Award, Share2, ChevronDown } from "lucide-react";
import Image from "next/image";
import DashboardLayout from "../dashboard-layout";
import { RecentContributions } from "@/components/RecentContributions";
import { useUser } from "@/hooks/useUser";

export default function Dashboard() {
    const { user } = useUser();

    const bonusProgress = user ? (user?.current_streak / 7) * 100 : 0;

    const stats = [
        {
            icon: Flame,
            value: "+10% Bonus",
            label: "Reach 7 days and earn",
            progress: bonusProgress.toString(),
        },
        {
            icon: Calendar,
            value: user?.current_streak || 0,
            label: "Daily Streak",
        },
        {
            icon: Award,
            value: user?.unique_token_count || 0,
            label: "Tokens Contributed",
        },
    ];

    const leaderboard = [
        { rank: 1, username: "x09e...756o", points: "500 XZN" },
        { rank: 2, username: "x09e...756o", points: "500 XZN" },
        { rank: 3, username: "x09e...756o", points: "500 XZN" },
        { rank: 4, username: "x09e...756o", points: "500 XZN" },
        { rank: 5, username: "x09e...756o", points: "500 XZN" },
    ];

    return (
        <DashboardLayout pageTitle="Dashboard" noBackButton={true}>
            {/* User Stats */}

            {/* Main Content Grid */}
            <div className="lg:grid gap-6 lg:grid-cols-3">
                {/* Left Column - Points and Contributions */}
                <div className="lg:col-span-2">
                    {/* Total Points */}
                    <Card className="bg-card border-border p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
                                    <p className="text-sm text-muted-foreground">
                                        Total XZN Points
                                    </p>
                                    <h2 className="text-3xl font-bold">
                                        {user?.total_xzn_points || 0} XZN
                                    </h2>
                                </div>
                            </div>
                            <Button className="gradient-primary w-full md:w-auto">
                                Contribute Now
                            </Button>
                        </div>
                    </Card>

                    {/* Stats Cards */}
                    <div className="mb-8 grid gap-4 lg:grid-cols-3 mt-6 mb-6">
                        {stats.map((stat, index) => (
                            <Card
                                key={index}
                                className="bg-card bg-white/10 border-border p-2 pt-6 pb-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg">
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold">
                                            {stat.value}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {stat.label}
                                        </p>
                                        {stat.progress && (
                                            <div className="mt-3 h-1 overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-accent"
                                                    style={{
                                                        width: `${stat.progress}%`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                    {/* Recent Contributions */}
                    <RecentContributions />
                </div>

                {/* Right Column - Referral and Leaderboard */}
                <div className="mt-6 lg:mt-0">
                    {/* Referral Summary */}
                    <Card className="bg-card border-border p-6">
                        <h3 className="mb-4 text-lg font-semibold">
                            Referral Summary
                        </h3>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <div className="mb-4 space-y-2">
                                    <div className="font-bold">Alex004</div>
                                    <div className="text-xs text-muted-foreground">
                                        xzen.app/?code=alex004
                                    </div>
                                </div>
                            </div>

                            <Button className="gradient-primary w-full md:w-auto mb-4">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total Referrals
                                </span>
                                <span className="font-medium">129</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Active Referrals
                                </span>
                                <span className="font-medium">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Referral Earnings
                                </span>
                                <span className="font-medium">350 XZN</span>
                            </div>
                        </div>
                    </Card>

                    {/* Leaderboard Preview */}
                    <Card className="bg-card border-border mt-6">
                        <div className="flex items-center justify-between border-b border-border p-6">
                            <h3 className="text-lg font-semibold">
                                Leaderboard
                            </h3>
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
                                    <div className="text-sm text-muted-foreground">
                                        7x8k...mN3p
                                    </div>
                                    <div className="font-bold">
                                        Your Rank: 146
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {leaderboard.map((item) => (
                                    <div
                                        key={item.rank}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                                {item.rank}
                                            </div>
                                            <span className="text-muted-foreground">
                                                {item.username}
                                            </span>
                                        </div>
                                        <span className="font-medium">
                                            {item.points}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
