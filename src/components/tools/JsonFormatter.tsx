import { useState } from "react";
import { CodeXml, Copy, Trash2, Check, AlertCircle } from "lucide-react";

export default function JsonFormatter() {
  const [jsonInput, setJsonInput] = useState("");
  const [indent, setIndent] = useState("2");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!jsonInput) return;
    navigator.clipboard.writeText(jsonInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    if (!jsonInput.trim()) {
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const space = indent === "tab" ? "\t" : parseInt(indent, 10);
      const formatted = JSON.stringify(parsed, null, space);
      setJsonInput(formatted);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON");
    }
  };

  const handleMinify = () => {
    if (!jsonInput.trim()) {
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      setJsonInput(minified);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON");
    }
  };

  const handleLoadSample = () => {
    const sample = {
      projectName: "ToolForge",
      version: "1.0.0",
      features: ["Client-side tools", "Privacy-focused", "Ultra fast", "Minimal design"],
      stats: {
        activeUsers: 2500,
        uptime: "99.99%",
        openSource: true
      },
      developer: {
        name: "ToolForge Team",
        active: true
      }
    };
    setJsonInput(JSON.stringify(sample, null, 2));
    setError(null);
  };

  const handleClear = () => {
    setJsonInput("");
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <CodeXml className="w-5 h-5 text-brand-500" /> JSON Formatter Workspace
        </h2>
        <button
          onClick={handleLoadSample}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-500 transition-fast cursor-pointer"
        >
          Load Sample JSON
        </button>
      </div>

      {/* Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Indentation:
          </label>
          <select
            value={indent}
            onChange={(e) => setIndent(e.target.value)}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">1 Tab</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleFormat}
            className="px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg shadow-sm transition-fast cursor-pointer"
          >
            Format & Validate
          </button>
          <button
            onClick={handleMinify}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-fast cursor-pointer"
          >
            Minify
          </button>
          {jsonInput && (
            <>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-750 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm rounded-lg transition-fast flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-750 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg transition-fast flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code Textarea */}
      <div className="relative">
        <textarea
          value={jsonInput}
          onChange={(e) => {
            setJsonInput(e.target.value);
            if (error) setError(null);
          }}
          placeholder='Paste raw, unformatted, or messy JSON here: {"name":"ToolForge","version":1.0}'
          className="w-full h-96 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/65 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-y"
          style={{ tabSize: indent === "tab" ? 4 : parseInt(indent, 10) }}
        />
      </div>

      {/* Validation Message */}
      {error ? (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 p-4 rounded-xl text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold mb-1">JSON Syntax Error</h4>
            <p className="font-mono break-all">{error}</p>
          </div>
        </div>
      ) : jsonInput.trim() ? (
        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 p-4 rounded-xl text-sm text-green-700 dark:text-green-300">
          <Check className="w-5 h-5 text-green-500" />
          <span className="font-medium">Valid JSON formatting! Zero syntax errors detected.</span>
        </div>
      ) : null}
    </div>
  );
}
