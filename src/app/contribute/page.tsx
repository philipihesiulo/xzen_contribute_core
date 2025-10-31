import DashboardLayout from "../dashboard-layout";
import { TokenSelection } from "@/components/TokenSelection";
import ContributionPreview from "@/components/ContributionPreview";

const Contribute = () => {
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
                <TokenSelection />
                {/* Contribution Preview */}
                <ContributionPreview />
            </div>
        </DashboardLayout>
    );
};

export default Contribute;
