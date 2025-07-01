"use client";

import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Loader2, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";
import HCaptcha from "@hcaptcha/react-hcaptcha";

import { Header } from "@/components/Header";
import { BalanceDisplay } from "@/components/Balance";
import { AddressInput } from "@/components/Input";
import { WalletConnection } from "@/components/Wallet";
import { SuccessMessage } from "@/components/Success";
import { DonationModal } from "@/components/Donate";

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

    if (!faucetBalance || faucetBalance <= DROPLET_AMOUNT_SOL) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 via-blue-900 to-slate-900 flex flex-col">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "linear-gradient(135deg, #111827, #1f2937)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "14px",
            color: "#ffffff",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          },
          descriptionClassName: 'text-white'
        }}
      />

      <Header onDonateClick={() => setShowDonateModal(true)} />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent pb-2">
              SOL DROP
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
              Instantly receive {DROPLET_AMOUNT_SOL} SOL for development and
              testing on Solana mainnet. Fast, reliable, and completely free.
            </p>
          </div>

          <BalanceDisplay
            balance={faucetBalance}
            isLoading={isLoadingBalance}
          />

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 space-y-8 shadow-2xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Claim Your SOL
              </h2>
              <p className="text-slate-400 text-sm">
                Choose your preferred method below
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/60 rounded-2xl border border-slate-700/50">
              {["manual", "wallet"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "manual" | "wallet")}
                  className={`py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                      : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  {tab === "manual" ? "Enter Address" : "Connect Wallet"}
                </button>
              ))}
            </div>

            {activeTab === "manual" ? (
              <AddressInput
                value={manualAddress}
                onChange={setManualAddress}
                isValid={addressValidation.isValid}
                error={addressValidation.error}
              />
            ) : (
              <WalletConnection />
            )}

            <HCaptcha
              ref={hcaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY!}
              onVerify={onHCaptchaVerify}
              size="invisible"
            />


            <button
              onClick={handleClaimClick}
              disabled={!isValidAddress() || isRequesting}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 disabled:via-slate-600 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] disabled:hover:scale-100"
            >
              {isRequesting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Claiming SOL...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Claim {DROPLET_AMOUNT_SOL} SOL
                </>
              )}
            </button>
          </div>

          {lastRequest && (
            <SuccessMessage
              signature={lastRequest}
              amount={DROPLET_AMOUNT_SOL}
            />
          )}
        </div>
      </div>

      <div className="p-6 text-center border-t border-slate-800/50 bg-zinc-900/20">
        <p className="text-slate-500 text-sm">
          Built with ❤️ by{" "}
          <span className="text-cyan-400 font-semibold">SolDrop Team</span>
        </p>
      </div>

      <DonationModal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        donationAddress={donationAddress}
      />
    </div>
  );
}
