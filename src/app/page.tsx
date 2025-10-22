"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleConnectWallet = () => {
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background gradient effect */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, #23104F 0%, #0B0E13 100%)' }} />
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center">
          <Image src="/xzenlabs_logo.png" alt="Xzenlabs Logo" width={250} height={250} />
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          Turn your worthless Solana tokens into
        </h1>

        <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
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
