"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { WalletBalance } from "@/components/WalletBalance";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import withAuth from "@/middlewares/withAuth";

interface DashboardLayoutProps {
    children: React.ReactNode;
    pageTitle?: string;
    pageDescription?: React.ReactNode;
    noBackButton?: boolean;
}

export function DashboardLayout({
    children,
    pageTitle,
    pageDescription,
    noBackButton,
}: DashboardLayoutProps) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    if (isMobile) {
        return (
            <div className="flex h-screen flex-col bg-background">
                <header className="flex h-20 items-center justify-between border-b border-border px-4">
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <Sidebar
                                onLinkClick={() => setIsSidebarOpen(false)}
                            />
                        </SheetContent>
                    </Sheet>
                    <WalletBalance />
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="p-4 md:p-8">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            {pageTitle && (
                                <div className="flex items-center gap-4">
                                    {/* Back button */}
                                    {!noBackButton && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => router.back()}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                    )}

                                    <div>
                                        <h1 className="text-2xl font-bold">
                                            {pageTitle}
                                        </h1>
                                        {pageDescription && (
                                            <p className="text-sm text-muted-foreground">
                                                {pageDescription}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <WalletBalance />
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default withAuth(DashboardLayout);
