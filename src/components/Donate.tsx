"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Heart } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donationAddress: string;
}

export function DonationModal({
  isOpen,
  onClose,
  donationAddress,
}: DonationModalProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(donationAddress);
    toast.success("Donation address copied!");
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 16) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Support SolDrop
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <p className="text-slate-400 text-center">
            Help us keep the faucet running by donating SOL. Your support keeps
            this service free for everyone!
          </p>

          <div className="flex justify-center">
            <div className="p-1 bg-white rounded-2xl shadow-lg">
              <QRCodeSVG
                value={donationAddress}
                size={200}
                level="M"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300">
              Donation Address
            </label>
            <div className="bg-slate-900/80 border border-slate-600/50 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-white break-all">
                    {donationAddress}
                  </p>
                </div>
                <button
                  onClick={copyAddress}
                  className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 rounded-xl transition-all duration-200 flex-shrink-0"
                >
                  <Copy className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-slate-700/50">
            <p className="text-xs text-slate-500 leading-relaxed">
              Your donations help cover server costs and keep the faucet
              operational for the entire Solana community. Every contribution
              makes a difference!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
