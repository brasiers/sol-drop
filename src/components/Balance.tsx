import { Loader2, Coins } from 'lucide-react'

interface BalanceDisplayProps {
  balance: number | null
  isLoading: boolean
}

export function BalanceDisplay({ balance, isLoading }: BalanceDisplayProps) {
  const formattedBalance =
    typeof balance === 'number' ? balance.toFixed(4) : "0.0000";
  const isPositive = typeof balance === 'number' && balance >= 0.01;

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/50 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
          <Coins className="w-5 h-5 text-cyan-400" />
        </div>
        <h3 className="text-slate-300 font-medium">Faucet Balance</h3>
      </div>

      <div className="text-center">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <p
            className={`text-4xl font-bold bg-clip-text text-transparent ${
              isPositive
                ? "bg-gradient-to-r from-green-600 via-emerald-300 to-purple-500"
                : "bg-gradient-to-r from-cyan-500 via-blue-300 to-pink-400"
            }`}
          >
            {formattedBalance} SOL
          </p>
        )}
      </div>
    </div>
  )
}
