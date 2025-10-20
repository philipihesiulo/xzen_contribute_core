import { Wallet } from "lucide-react";

export function WalletBalance() {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-card px-4 py-3 border border-border">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
        <Wallet className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Wallet Balance</div>
        <div className="text-lg font-bold">SOL 105,000</div>
      </div>
    </div>
  );
}
