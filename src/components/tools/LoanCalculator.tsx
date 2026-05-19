import { useState } from "react";
import { Calculator, DollarSign, Calendar, Percent } from "lucide-react";

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState<number>(250000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [termYears, setTermYears] = useState<number>(30);

  const calculateMetrics = () => {
    const p = principal;
    const r = interestRate / 100 / 12; // Monthly interest rate
    const n = termYears * 12; // Total monthly payments

    let monthlyPayment = 0;
    if (interestRate === 0) {
      monthlyPayment = p / n;
    } else {
      monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    // Generate annual amortization schedule
    const schedule = [];
    let balance = p;
    
    for (let year = 1; year <= termYears; year++) {
      let yearInterest = 0;
      let yearPrincipal = 0;

      for (let month = 1; month <= 12; month++) {
        const monthlyInterestVal = balance * r;
        const monthlyPrincipalVal = monthlyPayment - monthlyInterestVal;

        yearInterest += monthlyInterestVal;
        yearPrincipal += monthlyPrincipalVal;
        balance -= monthlyPrincipalVal;
      }

      schedule.push({
        year,
        beginningBalance: balance + yearPrincipal,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        endingBalance: Math.max(0, balance),
      });
    }

    return {
      monthlyPayment: Math.max(0, monthlyPayment),
      totalPayment: Math.max(0, totalPayment),
      totalInterest: Math.max(0, totalInterest),
      schedule,
    };
  };

  const metrics = calculateMetrics();

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCurrencyPrecise = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Calculate interest and principal ratios for the visual SVG chart
  const interestRatio = metrics.totalPayment > 0 ? metrics.totalInterest / metrics.totalPayment : 0;

  const strokeDasharray = 2 * Math.PI * 40; // Circle circumference with r=40
  const interestOffset = strokeDasharray * (1 - interestRatio);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Calculator className="w-5 h-5 text-brand-500" /> Mortgage & Loan Workspace
      </h2>

      {/* Main UI Structure */}
      <div className="grid md:grid-cols-12 gap-6">
        {/* Inputs Panel */}
        <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Calculator Inputs
          </h3>

          {/* Principal */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <label className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Loan Amount (Principal)</label>
              <span className="font-mono text-slate-800 dark:text-white font-bold">{formatCurrency(principal)}</span>
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min="5000"
                max="2000000"
                step="5000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 self-center"
              />
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                className="w-28 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold font-mono rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <label className="flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Annual Interest Rate</label>
              <span className="font-mono text-slate-800 dark:text-white font-bold">{interestRate}%</span>
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min="0.1"
                max="15"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 self-center"
              />
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0.1, Number(e.target.value)))}
                className="w-28 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold font-mono rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          {/* Term Years */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <label className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Loan Term (Duration)</label>
              <span className="font-mono text-slate-800 dark:text-white font-bold">{termYears} Years</span>
            </div>
            <div className="flex gap-3">
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 self-center"
              />
              <input
                type="number"
                value={termYears}
                onChange={(e) => setTermYears(Math.max(1, Number(e.target.value)))}
                className="w-28 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-semibold font-mono rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Results Summary Panel with SVG Donut */}
        <div className="md:col-span-7 grid sm:grid-cols-12 gap-5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl shadow-sm">
          <div className="sm:col-span-7 space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Payment Summary
            </h3>

            <div>
              <div className="text-xs text-slate-455 dark:text-slate-400">Estimated Monthly Payment</div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-brand-500 mt-0.5">
                {formatCurrencyPrecise(metrics.monthlyPayment)}
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 dark:bg-slate-700/60" />

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-slate-400">Total Principal Paid</div>
                <div className="font-bold font-mono text-slate-750 dark:text-slate-205 mt-0.5">
                  {formatCurrency(principal)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold text-amber-500">Total Interest Paid</div>
                <div className="font-bold font-mono text-amber-550 dark:text-amber-400 mt-0.5">
                  {formatCurrency(metrics.totalInterest)}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Overall Cost of Loan</div>
              <div className="text-lg font-bold font-mono text-slate-800 dark:text-white mt-0.5">
                {formatCurrency(metrics.totalPayment)}
              </div>
            </div>
          </div>

          {/* SVG Donut Chart */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Principal (Base Circle) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-brand-500 fill-none"
                  strokeWidth="12"
                />
                {/* Interest Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-amber-500 fill-none transition-all duration-300"
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={interestOffset}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Interest</span>
                <span className="text-sm font-bold font-mono text-amber-500">{(interestRatio * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 block" /> Principal
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" /> Interest
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Amortization Schedule */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250 uppercase tracking-wider mb-4">
          Annual Amortization Schedule
        </h3>

        <div className="overflow-x-auto max-h-96 overflow-y-auto border border-slate-200 dark:border-slate-700/50 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700/60 text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                <th className="p-3.5 pl-5">Year</th>
                <th className="p-3.5">Beginning Balance</th>
                <th className="p-3.5">Principal Paid</th>
                <th className="p-3.5">Interest Paid</th>
                <th className="p-3.5">Ending Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-750/60 font-mono text-slate-700 dark:text-slate-300">
              {metrics.schedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-fast">
                  <td className="p-3.5 pl-5 font-semibold text-slate-800 dark:text-white">{row.year}</td>
                  <td className="p-3.5">{formatCurrency(row.beginningBalance)}</td>
                  <td className="p-3.5 text-brand-600 dark:text-brand-400">{formatCurrency(row.principalPaid)}</td>
                  <td className="p-3.5 text-amber-655 dark:text-amber-405">{formatCurrency(row.interestPaid)}</td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(row.endingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
