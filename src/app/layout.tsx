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
  title: "Sol-Drop - The Premier Solana Faucet",
  description:
    "Get free Solana ($SOL) instantly with Sol-Drop. The fastest and most reliable faucet for Solana developers and users.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Sol-Drop - The Premier Solana Faucet",
    description: "Get free Solana ($SOL) instantly with Sol-Drop. The fastest and most reliable faucet for Solana developers and users.",
    url: "https://sol-drop.fun", // Replace with your actual domain
    siteName: "Sol Drop",
    images: [
      {
        url: "/og-image.png", // Create and add an OG image to your public folder
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sol-Drop - The Premier Solana Faucet",
    description: "Get free Solana ($SOL) instantly with Sol-Drop. The fastest and most reliable faucet for Solana developers and users.",
    images: ["/og-image.png"], // Create and add an OG image
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
