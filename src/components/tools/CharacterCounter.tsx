import { useState } from "react";
import { FileSpreadsheet, Copy, Trash2, Check } from "lucide-react";

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemoveSpaces = () => {
    setText(text.replace(/\s+/g, ""));
  };

  const handleRemoveLineBreaks = () => {
    setText(text.replace(/\r?\n|\r/g, " "));
  };

  const handleInsertSample = () => {
    setText("ToolForge is optimized for developer speed and user simplicity. Try typing some characters here to check their length constraints!");
  };

  const charCount = text.length;
  const noSpaceCharCount = text.replace(/\s/g, "").length;
  const byteCount = new Blob([text]).size;

  // Social Limits Data
  const limits = [
    { name: "Twitter / X Post", max: 280 },
    { name: "SMS Message", max: 160 },
    { name: "LinkedIn Post", max: 3000 },
    { name: "Instagram Caption", max: 2200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-brand-500" /> Character Counter Workspace
        </h2>
        <button
          onClick={handleInsertSample}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-500 transition-fast cursor-pointer"
        >
          Load Sample Text
        </button>
      </div>

      {/* Metrics Panel */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-brand-500">{charCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Total Chars</div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-700 dark:text-slate-200">{noSpaceCharCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">No Spaces</div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-700 dark:text-slate-200">{byteCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Bytes (UTF-8)</div>
        </div>
      </div>

      {/* Workspace Input */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your content to measure character lengths..."
          className="w-full h-60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/65 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans resize-y text-sm md:text-base"
        />
        
        {text.length > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-fast flex items-center gap-1 text-xs cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => setText("")}
              className="p-2 bg-slate-100 dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-fast flex items-center gap-1 text-xs cursor-pointer"
              title="Clear Text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Text manipulation buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleRemoveSpaces}
          disabled={!text}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Remove All Spaces
        </button>
        <button
          onClick={handleRemoveLineBreaks}
          disabled={!text}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Remove Line Breaks
        </button>
      </div>

      {/* Social Limits Indicators */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/40 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Social Network & Platform Limits
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {limits.map((limit) => {
            const pct = Math.min((charCount / limit.max) * 100, 100);
            const isOver = charCount > limit.max;

            return (
              <div key={limit.name} className="space-y-1.5 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/40 p-3.5 rounded-lg">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">{limit.name}</span>
                  <span className={`font-mono ${isOver ? "text-red-500" : "text-slate-400"}`}>
                    {charCount} / {limit.max}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-305 ${
                      isOver ? "bg-red-500" : pct > 90 ? "bg-amber-500" : "bg-brand-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
