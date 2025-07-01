"use client"

import { CheckCircle, Copy, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface SuccessMessageProps {
  signature: string
  amount: number
}

export function SuccessMessage({ signature, amount }: SuccessMessageProps) {
  const truncate = (sig: string) => `${sig.slice(0, 8)}...${sig.slice(-8)}`

  const copySignature = () => {
    navigator.clipboard.writeText(signature)
    toast.success("Transaction signature copied!")
  }

  const viewOnExplorer = () => {
    window.open(`https://explorer.solana.com/tx/${signature}?cluster=mainnet`, "_blank")
  }

  return (
    <div className="bg-gradient-to-br from-emerald-900/30 via-green-900/20 to-emerald-900/30 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-emerald-300">Transaction Successful!</h3>
          <p className="text-emerald-400">{amount} SOL has been sent to your wallet</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-300 mb-2">Transaction Signature</p>
            <p className="text-sm font-mono text-slate-400">{truncate(signature)}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={copySignature}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              title="Copy signature"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={viewOnExplorer}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
              title="View on Solana Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
