import { Button } from "@/components/ui/button";
import { useContributionStore } from "@/stores/contributionStore";
import { Token } from "@/types/token";

interface SelectTokenButtonProps {
    token: Token;
}

export const SelectTokenButton = ({ token }: SelectTokenButtonProps) => {
    const {
        removeTokenFromContribution,
        addTokenToContribution,
        selected: selectedTokens,
    } = useContributionStore();
    const selected = selectedTokens.some((t) => t.mint === token.mint);
    return (
        <>
            {selected ? (
                <Button
                    size="sm"
                    onClick={() => removeTokenFromContribution(token.mint)}
                    className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent">
                    Remove
                </Button>
            ) : (
                <Button
                    size="sm"
                    onClick={() => addTokenToContribution(token)}
                    className="gradient-primary">
                    Add
                </Button>
            )}
        </>
    );
};
