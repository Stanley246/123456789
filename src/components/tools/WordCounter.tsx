import { useState } from "react";
import { FileText, Copy, Trash2, HelpCircle, Check } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const characterCountWithSpaces = text.length;
  const characterCountNoSpaces = text.replace(/\s/g, "").length;
  
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  const wordCount = words.length;

  // Basic sentence count (by periods, question marks, exclamation marks)
  const sentenceCount = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Paragraphs count (split by double newlines or single newlines containing letters)
  const paragraphCount = text.trim() === "" ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;

  // Estimated reading time (average reading speed is 200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);

  // Keyword Density
  const getKeywordDensity = () => {
    if (text.trim() === "") return [];
    const counts: Record<string, number> = {};
    const cleanWords = text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "")
      .split(/\s+/)
      .filter(w => w.length > 2); // Filter short words like 'a', 'to', 'in'

    cleanWords.forEach(w => {
      counts[w] = (counts[w] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / cleanWords.length) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSample = () => {
    setText(
      "ToolForge is a lightning-fast utility platform containing 1,000+ free online tools for developers, creators, and everyday users. This is a sample paragraph to showcase the capabilities of the Word Counter tool. It counts your characters, words, sentences, paragraphs, and analyzes keyword density in real-time. Privacy is a priority, so all operations run client-side directly in your browser."
    );
  };

  const densityList = getKeywordDensity();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-500" /> Interactive Counter Workspace
        </h2>
        <button
          onClick={handleInsertSample}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-500 transition-fast cursor-pointer"
        >
          Load Sample Text
        </button>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-brand-500">{wordCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Words</div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-700 dark:text-slate-200">{characterCountWithSpaces}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Chars (all)</div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-700 dark:text-slate-200">{characterCountNoSpaces}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Chars (no space)</div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center col-span-1">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-700 dark:text-slate-200">{sentenceCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Sentences</div>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl text-center col-span-1">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-700 dark:text-slate-200">{paragraphCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium uppercase tracking-wider">Paragraphs</div>
        </div>
      </div>

      {/* Work area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing, or paste your article, blog post, or essay here..."
          className="w-full h-64 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/65 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-sans resize-y text-sm md:text-base"
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

      {/* Reading Time & Keyword Density */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" /> Writing Estimations
          </h3>
          <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex justify-between">
              <span>Estimated Reading Time:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{readingTime} min{readingTime !== 1 && "s"}</span>
            </li>
            <li className="flex justify-between">
              <span>Estimated Speaking Time:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{Math.ceil(wordCount / 130)} min{Math.ceil(wordCount / 130) !== 1 && "s"}</span>
            </li>
            <li className="flex justify-between">
              <span>Avg. Sentence Length:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">
                {sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0} words
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200/60 dark:border-slate-700/40">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3">
            Keyword Density (Top Words &gt; 2 chars)
          </h3>
          {densityList.length === 0 ? (
            <div className="text-sm text-slate-400 italic py-4 text-center">
              Enter text to analyze keyword density...
            </div>
          ) : (
            <div className="space-y-2">
              {densityList.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                    {idx + 1}. {item.word}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">
                      {item.count} ({item.density}%)
                    </span>
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-500 h-full rounded-full"
                        style={{ width: `${Math.min(Number(item.density) * 5, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
