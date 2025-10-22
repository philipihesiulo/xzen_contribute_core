"use client";

import { Sidebar } from "@/components/Sidebar";
import { WalletBalance } from "@/components/WalletBalance";
import { Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: React.ReactNode;
  noBackButton?: boolean;
}

export default function DashboardLayout({ children, pageTitle, pageDescription, noBackButton }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
            {pageTitle && (
              <div className="flex items-center gap-4">
                {!noBackButton && (<Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>)}
                
                <div>
                  <h1 className="text-2xl font-bold">{pageTitle}</h1>
                  {pageDescription && <p className="text-sm text-muted-foreground">{pageDescription}</p>}
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
