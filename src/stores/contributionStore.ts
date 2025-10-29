import { create } from "zustand";
import { ContributionToken, Token } from "@/types/token";
import { handleContribute } from "@/lib/contributionService";
import { ContributionStoreState, STATUS } from "@/types/contribution";

export const useContributionStore = create<ContributionStoreState>((set, get) => ({
    selected: [],
    status: STATUS.PENDING,
    response: { message: "", pointsEarned: 0 },
    error: null,
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
    handleContribute: async (connection, wallet, selected) => {
        await handleContribute(connection, wallet, selected)
            .then((response) => {
                set({ selected: [] });
                set({ status: STATUS.SUCCESS });
                set({ response });
            })
            .catch((error) => {
                set({ status: STATUS.FAILED });
                set({ error });
            });
    },
}));
