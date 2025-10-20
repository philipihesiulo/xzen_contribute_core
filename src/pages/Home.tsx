import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-2xl font-bold text-primary">X</span>
          </div>
          <div className="text-left">
            <div className="text-sm text-muted-foreground">xzenlabs</div>
            <div className="text-lg font-bold tracking-wider">CONTRIBUTE</div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          Turn Your Worthless Tokens Into
          <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Training Data
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-12 text-lg text-muted-foreground">
          Connect you Solana wallet to begin contributing data towards
          <br />
          building the diagnostic hub for meme tokens.
        </p>

        {/* CTA Button */}
        <Button
          onClick={handleConnectWallet}
          size="lg"
          className="gradient-primary h-14 px-12 text-base font-semibold shadow-glow"
        >
          Connect Wallet
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
