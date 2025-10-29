import { ContributionToken, Token } from "@/types/token";
import { Connection } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export interface ContributionResponse {
    signature?: string;
    message: string;
    pointsEarned: number;
}

export enum STATUS {
    "PENDING" = "pending",
    "SUCCESS" = "success",
    "FAILED" = "failed",
}

export interface ContributionStoreState {
    selected: ContributionToken[];
    status: STATUS;
    response: ContributionResponse;
    error: Error | null;
    addTokenToContribution: (token: Token | ContributionToken) => void;
    removeTokenFromContribution: (mint: string) => void;
    handleAmountChange: (token: ContributionToken, newAmount: number) => void;
    isTokenAdded: (mint: string) => boolean;
    clearContribution: () => void;
    handleContribute: (
        connection: Connection,
        wallet: WalletContextState,
        selected: ContributionToken[]
    ) => void;
}
