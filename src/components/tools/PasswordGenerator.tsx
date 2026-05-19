import { useState, useEffect, useCallback } from "react";
import { KeyRound, Copy, RefreshCw, Check } from "lucide-react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let lowercase = "abcdefghijklmnopqrstuvwxyz";
    let uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (excludeSimilar) {
      lowercase = lowercase.replace(/[il]/g, "");
      uppercase = uppercase.replace(/[IO]/g, "");
      numbers = numbers.replace(/[01]/g, "");
      symbols = symbols.replace(/[|;:,.<>]/g, "");
    }

    let charset = "";
    if (includeLower) charset += lowercase;
    if (includeUpper) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      setPassword("");
      return;
    }

    let generated = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      generated += charset[array[i] % charset.length];
    }
    setPassword(generated);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeSimilar]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate entropy and return strength indicator
  const getStrength = () => {
    if (!password) return { label: "Empty", color: "bg-slate-300", width: "w-0", desc: "Please select at least one option." };
    
    let poolSize = 0;
    if (includeLower) poolSize += excludeSimilar ? 24 : 26;
    if (includeUpper) poolSize += excludeSimilar ? 24 : 26;
    if (includeNumbers) poolSize += excludeSimilar ? 8 : 10;
    if (includeSymbols) poolSize += excludeSimilar ? 18 : 26;

    const entropy = length * Math.log2(poolSize || 2);

    if (entropy < 40) {
      return { label: "Very Weak", color: "bg-red-500", width: "w-1/4", desc: "Easily cracked. Increase length or add character sets." };
    } else if (entropy < 60) {
      return { label: "Weak / Fair", color: "bg-orange-500", width: "w-2/4", desc: "Decent for basic logins, but not secure enough for critical accounts." };
    } else if (entropy < 80) {
      return { label: "Strong", color: "bg-amber-500", width: "w-3/4", desc: "Highly secure. Hard to brute-force by standard hardware." };
    } else {
      return { label: "Ultra Secure", color: "bg-green-500", width: "w-full", desc: "Perfect security. Impossible to crack in any reasonable timeframe." };
    }
  };

  const strength = getStrength();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <KeyRound className="w-5 h-5 text-brand-500" /> Secure Password Workspace
      </h2>

      {/* Output Box */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-4 justify-between">
        <div className="font-mono text-lg sm:text-xl md:text-2xl text-slate-800 dark:text-white select-all overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 py-1 flex-1">
          {password || <span className="text-slate-400 italic text-base">Select options below...</span>}
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={generatePassword}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white rounded-xl transition-fast shadow-sm cursor-pointer"
            title="Generate New"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopy}
            disabled={!password}
            className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-xl shadow-sm transition-fast flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Strength Meter */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-bold text-white ${strength.color}`}>
            {strength.label}
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
          <div className={`h-full rounded-full transition-all duration-300 ${strength.width} ${strength.color}`} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{strength.desc}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span>Password Length:</span>
              <span className="font-mono text-brand-500">{length} characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          <div className="space-y-2.5">
            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeUpper}
                onChange={(e) => setIncludeUpper(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/20 accent-brand-500"
              />
              Include Uppercase Letters (A-Z)
            </label>
            
            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeLower}
                onChange={(e) => setIncludeLower(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/20 accent-brand-500"
              />
              Include Lowercase Letters (a-z)
            </label>

            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/20 accent-brand-500"
              />
              Include Numbers (0-9)
            </label>

            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/20 accent-brand-500"
              />
              Include Symbols (!@#$%^&*)
            </label>

            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(e) => setExcludeSimilar(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/20 accent-brand-500"
              />
              <span>Exclude similar characters <span className="text-slate-400 font-mono text-xs">(e.g., i, l, 1, L, o, 0, O)</span></span>
            </label>
          </div>
        </div>

        {/* Tips Info */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 text-sm text-slate-600 dark:text-slate-300 space-y-3">
          <div className="font-semibold text-slate-800 dark:text-slate-200">Password Security Best Practices:</div>
          <ul className="list-disc pl-4 space-y-2 text-xs">
            <li><span className="font-medium text-slate-700 dark:text-slate-200">Length matters:</span> A 16+ character password is astronomically harder to crack than an 8-character one, even with symbols.</li>
            <li><span className="font-medium text-slate-700 dark:text-slate-200">Never reuse:</span> Use a password manager to store unique passwords for every single service.</li>
            <li><span className="font-medium text-slate-700 dark:text-slate-200">Cryptographic generation:</span> ToolForge uses standard browser APIs (<code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded text-[10px]">crypto.getRandomValues</code>) to guarantee true mathematical randomness on your machine.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
