"use client";

import { Github, Heart, Droplets, Twitter, HandCoins } from "lucide-react";
import Image from "next/image";
interface HeaderProps {
  onDonateClick: () => void;
}

export function Header({ onDonateClick }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 bg-zinc-900/20 backdrop-blur-sm border-b border-slate-700/50">
      <div className="flex items-center gap-3">
      {/* <div className="w-10 h-10 bg-transparent rounded-xl flex items-center justify-center shadow-lg"> */}
        {/* <Image
          src="/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-xl shadow-lg"
        /> */}
        {/* </div> */}
        {/* <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SOLDROP
          </span>
          <p className="text-xs text-slate-400 font-medium">Solana Faucet</p>
        </div> */}
        <div className="bg-transparent rounded-xl flex flex-col items-center justify-center mr-3">
              <Image
                src="/soldroplogo.png"
                alt="Logo"
                width={120}
                height={60}
                className="rounded-xl"
              />
                <p className="text-xs text-slate-400 font-medium -mt-1 ml-2">Solana Faucet</p>
              </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.open("https://dexscreener.com", "_blank")}
            className="p-3 text-slate-400 hover:text-white transition-all duration-200 hover:bg-slate-800/50 rounded-xl"
          >
            <HandCoins className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.open("https://github.com/brasiers/sol-drop", "_blank")}
            className="p-3 text-slate-400 hover:text-white transition-all duration-200 hover:bg-slate-800/50 rounded-xl"
          >
            <Github className="w-5 h-5" />
          </button>
          <button
            onClick={() => window.open("https://x.com/soldropfun", "_blank")}
            className="p-3 text-slate-400 hover:text-white transition-all duration-200 hover:bg-slate-800/50 rounded-xl"
          >
            <Twitter className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={onDonateClick}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-pink-500/25 hover:scale-105"
        >
          <Heart className="w-4 h-4" />
          <span className="hidden sm:inline-block">Donate</span>
        </button>
      </div>
    </div>
  );
}
