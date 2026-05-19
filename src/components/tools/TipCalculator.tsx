import { useState } from "react";
import { DollarSign, Users, Award, Check, Copy } from "lucide-react";

export default function TipCalculator() {
  const [bill, setBill] = useState<number>(120);
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [people, setPeople] = useState<number>(4);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const b = bill || 0;
    const totalTip = b * (tipPercent / 100);
    const totalBill = b + totalTip;

    const tipPerPerson = totalTip / people;
    const totalPerPerson = totalBill / people;

    return {
      totalTip,
      totalBill,
      tipPerPerson,
      totalPerPerson,
    };
  };

  const values = calculate();

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const handleCopy = () => {
    const shareText = `Bill Split Details:
--------------------------
Bill Amount: ${formatCurrency(bill)}
Tip Percentage: ${tipPercent}%
Number of People: ${people}
--------------------------
Tip per Person: ${formatCurrency(values.tipPerPerson)}
Total per Person: ${formatCurrency(values.totalPerPerson)}
--------------------------
Total Tip: ${formatCurrency(values.totalTip)}
Total Bill (incl. tip): ${formatCurrency(values.totalBill)}`;

    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Award className="w-5 h-5 text-brand-500" /> Tip & Bill Splitter Workspace
      </h2>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Inputs Panel */}
        <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-5 h-fit">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Split Inputs
          </h3>

          {/* Bill Amount */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> Bill Subtotal
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-medium text-sm">
                $
              </span>
              <input
                type="number"
                value={bill || ""}
                onChange={(e) => setBill(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold font-mono rounded-lg border border-slate-200 dark:border-slate-700 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Tip Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <label className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Tip Percentage</label>
              <span className="font-mono text-brand-500 font-bold">{tipPercent}%</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[10, 15, 18, 20, 25].map((p) => (
                <button
                  key={p}
                  onClick={() => setTipPercent(p)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-fast cursor-pointer ${
                    tipPercent === p
                      ? "bg-brand-500 border-brand-500 text-white"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-55"
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={tipPercent}
              onChange={(e) => setTipPercent(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 mt-2"
            />
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <label className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Split Between</label>
              <span className="font-mono text-slate-800 dark:text-white font-bold">{people} {people === 1 ? "Person" : "People"}</span>
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 self-center"
              />
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold font-mono rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Results Summary Panel */}
        <div className="md:col-span-7 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-4">
              <h3 className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider">
                Split Results Breakdown
              </h3>
              {bill > 0 && (
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-lg transition-fast flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Details Copied!" : "Copy Details"}
                </button>
              )}
            </div>

            {/* Main Split display */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-brand-50/20 dark:bg-brand-950/5 border border-brand-100 dark:border-brand-900/20 p-4 rounded-2xl">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Total Per Person</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-500 mt-1">
                  {formatCurrency(values.totalPerPerson)}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Excludes any custom rounding.</p>
              </div>

              <div className="bg-amber-50/20 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-900/20 p-4 rounded-2xl">
                <div className="text-xs text-slate-500 dark:text-slate-455 font-semibold text-amber-500">Tip Per Person</div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500 mt-1">
                  {formatCurrency(values.tipPerPerson)}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Split equally across party.</p>
              </div>
            </div>

            {/* Bottom summaries */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700/50 pt-4">
              <div>
                <span className="text-xs text-slate-400">Total Tip:</span>
                <span className="font-bold font-mono text-slate-700 dark:text-slate-200 block text-base">
                  {formatCurrency(values.totalTip)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400">Total Bill (with Tip):</span>
                <span className="font-bold font-mono text-slate-700 dark:text-slate-200 block text-base">
                  {formatCurrency(values.totalBill)}
                </span>
              </div>
            </div>
          </div>

          {/* Tips rounding */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 p-4 rounded-xl mt-6 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Need rounded bills? Tip calculator calculates precise decimals so you don't worry about rounding math at registers!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
