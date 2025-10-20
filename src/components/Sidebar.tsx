import { Home, Plus, Trophy, Users, User, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Contribute", href: "/contribute", icon: Plus },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Referrals", href: "/referrals", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar-background">
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
            <span className="text-lg font-bold text-primary">X</span>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">xzenlabs</div>
            <div className="text-sm font-bold tracking-wider">CONTRIBUTE</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Disconnect Wallet */}
      <div className="p-4">
        <Button
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
