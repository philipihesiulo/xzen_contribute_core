import { create } from "zustand";
import { ContributionToken, Token } from "@/types/token";

interface ContributionStoreState {
    selected: ContributionToken[];
    addTokenToContribution: (token: Token | ContributionToken) => void;
    removeTokenFromContribution: (mint: string) => void;
    handleAmountChange: (token: ContributionToken, newAmount: number) => void;
    isTokenAdded: (mint: string) => boolean;
    clearContribution: () => void;
}

export const useContributionStore = create<ContributionStoreState>((set, get) => ({
    selected: [],
    addTokenToContribution: (token) => {
        if (token.balance === 0) {
            throw new Error("Cannot add token with zero balance to contribution.");
        }
        const contributionToken: ContributionToken = { ...token, amount: 100 };
        set((state) => ({
            selected: [...state.selected, contributionToken],
        }));
        console.log(get().selected);
    },
    removeTokenFromContribution: (mint) => {
        set((state) => ({
            selected: state.selected.filter((token) => token.mint !== mint),
        }));
        console.log(get().selected);
    },
    handleAmountChange: (currentToken, newAmount) => {
        newAmount = newAmount <= currentToken.balance ? newAmount : currentToken.balance;
        set((state) => ({
            selected: state.selected.map((token) =>
                token.mint === currentToken.mint ? { ...token, amount: newAmount } : token
            ),
        }));
    },
    isTokenAdded: (mint) => {
        return get().selected.some((token) => token.mint === mint);
    },
    clearContribution: () => {
        set({ selected: [] });
    },
}));
