import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useUser } from "@/hooks/useUser";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function shortenAddress(str: string, start = 4, end = 4) {
    if (str.length <= start + end) return str;
    return `${str.slice(0, start)}...${str.slice(-end)}`;
}


