"use client";

import { useIsMobile } from "@/hooks/useMobile";
import { useEffect } from "react";
import DashboardLayout from "../dashboard-layout";
import { useTokenDiscovery, useTokensMetadata } from "@/hooks/useTokenDiscovery";
import { Token } from "@/types/token";
import { TokenSelection } from "@/components/TokenSelection";
import ContributionPreview from "@/components/ContributionPreview";

const Contribute = () => {
    const isMobile = useIsMobile();
    const { tokens, isLoading, error } = useTokenDiscovery();
    const {
        tokensMetadata,
        isLoading: isMetadataLoading,
        error: metadataError,
    } = useTokensMetadata();

    useEffect(() => {
        console.log("[EFFECT] Tokens Metadata: ", tokensMetadata);
        console.log("[EFFECT] Tokens: ", tokens);
        if (!isMetadataLoading && !metadataError) {
            // Merge tokens with their metadata
            const updatedTokens: Token[] = [];
            tokens?.forEach((token) => {
                const metadata = tokensMetadata?.find((meta) => meta.mint === token.mint);
                if (metadata) {
                    updatedTokens.push(metadata);
                } else {
                    updatedTokens.push(token);
                }
            });
            //console.log(updatedTokens);
        }
    }, [tokens, tokensMetadata]);

    const pageDescription = (
        <>
            Select the tokens you want to contribute. <br />
            You don't need to contribute all units of each token.
        </>
    );

    return (
        <DashboardLayout
            pageTitle="Contribute"
            pageDescription={pageDescription}>
            <div className="lg:grid gap-6 lg:grid-cols-3">
                {/* Token Selection */}
                <TokenSelection
                    isMobile={isMobile}
                    tokens={tokens || []}
                    isLoading={isLoading}
                    error={error}
                />
                {/* Contribution Preview */}
                <ContributionPreview />
            </div>
        </DashboardLayout>
    );
};

export default Contribute;
