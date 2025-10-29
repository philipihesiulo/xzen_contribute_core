import React from "react";
import { AuthProvider } from "../providers/AuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletContextProvider } from "@/providers/WalletContextProvider";
import { ErrorToast } from "@/components/ErrorToast";
import { GlobalModal } from "@/components/GlobalModal";
import { Toaster } from "@/components/ui/toaster";
import { QueryContextProvider } from "@/providers/QueryContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Contribute - Xzenlabs",
    description: "Turn your worthless Solana tokens into AI training data",
    icons: { icon: "/favicon.png" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <QueryContextProvider>
                    <WalletContextProvider>
                        <AuthProvider>{children}</AuthProvider>
                    </WalletContextProvider>
                </QueryContextProvider>
                <ErrorToast />
                <Toaster />
                <GlobalModal />
            </body>
        </html>
    );
}
