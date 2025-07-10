"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Loader2, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Image from "next/image";
import { Header } from "@/components/Header";
import { BalanceDisplay } from "@/components/Balance";
import { AddressInput } from "@/components/Input";
import { WalletConnection } from "@/components/Wallet";
import { SuccessMessage } from "@/components/Success";
import { DonationModal } from "@/components/Donate";
import Link from "next/link";

const DROPLET_AMOUNT_SOL = 0.01;

export default function Faucet() {
  const { publicKey, connected } = useWallet();
  const [manualAddress, setManualAddress] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [lastRequest, setLastRequest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"manual" | "wallet">("manual");
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    error?: string;
  }>({ isValid: false });
  const [token, setToken] = useState<string | null>(null);
  const [faucetBalance, setFaucetBalance] = useState<number | null>(null);
  const [donationAddress, setDonationAddress] = useState<string>("");
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const hcaptchaRef = useRef<HCaptcha>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/faucet-balance");
        const data = await response.json();
        setFaucetBalance(data.balance || 0);
        setDonationAddress(data.address || "");

        if (!data.balance || data.balance < DROPLET_AMOUNT_SOL) {
          toast.error("The faucet is currently has insufficient funds. Feel free to contribute using the donate button.");
        }
      } catch (error) {
        console.error("Failed to fetch faucet balance:", error);
        setFaucetBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!manualAddress.trim()) {
      setAddressValidation({ isValid: false });
      return;
    }

    try {
      const pubkey = new PublicKey(manualAddress.trim());
      if (pubkey.toString() === manualAddress.trim()) {
        setAddressValidation({ isValid: true });
      } else {
        setAddressValidation({
          isValid: false,
          error: "Invalid address format",
        });
      }
    } catch {
      setAddressValidation({ isValid: false, error: "Invalid Solana address" });
    }
  }, [manualAddress]);

  const getCurrentAddress = () => {
    return activeTab === "wallet" && connected && publicKey
      ? publicKey.toString()
      : manualAddress.trim();
  };

  const isValidAddress = () => {
    if (activeTab === "wallet") return connected && publicKey;
    return addressValidation.isValid;
  };

  const requestServerDrop = async (address: string, captchaToken: string) => {
    try {
      const res = await fetch("/api/request-drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, hcaptchaToken: captchaToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setLastRequest(data.signature);
      toast.success(`🎉 ${DROPLET_AMOUNT_SOL} SOL sent!`, {
        description: "Transaction confirmed on mainnet",
        descriptionClassName: "text-white",
      });
    } catch (e) {
      toast.error(`Drop failed: ${e instanceof Error ? e.message : "Unknown error occurred"}`);
    } finally {
      setIsRequesting(false);
      setToken(null);
      hcaptchaRef.current?.resetCaptcha();
    }
  };

  const onHCaptchaVerify = (verifiedToken: string) => {
    setToken(verifiedToken);
    const address = getCurrentAddress();

    if (isValidAddress()) {
      requestServerDrop(address, verifiedToken);
    }
  };

  const handleClaimClick = () => {
    if (!isValidAddress()) {
      toast.error("Please enter or connect a valid address.");
      return;
    }

    if (!faucetBalance || faucetBalance < DROPLET_AMOUNT_SOL) {
      toast.error("The faucet is currently empty. Feel free to contribute using the donate button.");
      return;
    }

    setIsRequesting(true);
    if (!token) {
      hcaptchaRef.current?.execute();
    } else {
      requestServerDrop(getCurrentAddress(), token);
    }
  };

  return (
    
  <div><p>coming soon</p></div>
      
  );
}
