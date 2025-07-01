import { CheckCircle, AlertCircle } from "lucide-react";

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  error?: string;
}

export function AddressInput({
  value,
  onChange,
  isValid,
  error,
}: AddressInputProps) {
  const getInputBorderColor = () => {
    if (!value.trim()) return "border-slate-600/50 focus:border-cyan-400/50";
    if (isValid) return "border-emerald-400/50 focus:border-emerald-300/50";
    return "border-red-400/50 focus:border-red-300/50";
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your Solana wallet address"
          className={`w-full px-4 py-4 bg-slate-900/50 border-2 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 backdrop-blur-sm ${getInputBorderColor()}`}
        />
        {value.trim() && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
        )}
      </div>

      {value.trim() && !isValid && error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
