"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Copy, Wallet } from "lucide-react"
import { toast } from "sonner"

export function WalletConnection() {
  const { publicKey, connected } = useWallet()

  const truncate = (address: string) => `${address.slice(0, 8)}...${address.slice(-8)}`

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      toast.success("Address copied to clipboard")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !via-blue-600 !to-cyan-600 hover:!from-purple-700 hover:!via-blue-700 hover:!to-cyan-700 !rounded-xl !shadow-lg !border-0 !font-semibold !text-white !px-8 !py-4 !transition-all !duration-200 hover:!scale-105" />
      </div>

      {connected && publicKey && (
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Connected Wallet</p>
                <p className="text-sm font-mono text-white">{truncate(publicKey.toString())}</p>
              </div>
            </div>
            <button
              onClick={copyAddress}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
