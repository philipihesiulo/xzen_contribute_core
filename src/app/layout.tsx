import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";
import React from "react";
 
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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
