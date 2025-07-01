import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WalletProvider from "@/components/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SolDrop - The Premier Solana Faucet",
  description:
    "Get free Solana ($SOL) instantly with SolDrop. The fastest and most reliable faucet for Solana developers and users.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "SolDrop - The Premier Solana Faucet",
    description: "Get free Solana ($SOL) instantly with SolDrop. The fastest and most reliable faucet for Solana developers and users.",
    url: "https://sol-drop.fun", 
    siteName: "SolDrop",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolDrop - The Premier Solana Faucet",
    description: "Get free Solana ($SOL) instantly with SolDrop. The fastest and most reliable faucet for Solana developers and users.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
