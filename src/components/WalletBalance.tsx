import { Wallet, Copy } from "lucide-react";
import { shortenAddress } from "@/lib/utils/generalUtils";
import { useUserStore } from "@/stores/userStore";

export function WalletBalance() {
    const { walletBalance, userProfile: user } = useUserStore();

    return (
        <div className="flex items-center gap-3 rounded-lg bg-card px-4 py-3 border border-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
                {/* Wallet Address */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                        {shortenAddress(user ? user.wallet_address : "No wallet Connected")}
                    </span>
                    <button className="text-muted-foreground hover:text-foreground">
                        <Copy className="h-4 w-4" />
                    </button>
                </div>
                {/* Wallet Balance */}
                <div className="text-lg font-bold">{walletBalance} SOL</div>
            </div>
        </div>
    );
}
