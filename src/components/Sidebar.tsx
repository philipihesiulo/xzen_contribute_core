"use client";

import { Home, Plus, Trophy, Users, User, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { useAuth } from "@/providers/AuthProvider";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Contribute", href: "/contribute", icon: Plus },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Referrals", href: "/referrals", icon: Users },
    { name: "Profile", href: "/profile", icon: User },
];

interface SidebarProps {
    onLinkClick?: () => void;
}

export function Sidebar({ onLinkClick }: SidebarProps) {
    const pathname = usePathname();

    const { signOut } = useAuth();
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar-background">
            {/* Logo */}
            <div className="flex h-20 items-center px-6">
                <Image
                    src="/contribute_logo.png"
                    alt="Contribute Logo"
                    width={150}
                    height={150}
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={onLinkClick}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            pathname === item.href
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Disconnect Wallet */}
            <div className="p-4">
                {/* <WalletDisconnectButton className="gradient-primary h-14 px-12 text-base font-semibold shadow-glow" /> */}
                <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full border-primary/30 text-primary hover:bg-primary/10"
                >
                    <Wallet className="mr-2 h-4 w-4" />
                    Disconnect Wallet
                </Button>
            </div>
        </div>
    );
}
