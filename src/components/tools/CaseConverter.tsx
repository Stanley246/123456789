import { useState } from "react";
import { ALargeSmall, Copy, Trash2, Check } from "lucide-react";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toUpperCase = () => setText(text.toUpperCase());
  const toLowerCase = () => setText(text.toLowerCase());

  const toTitleCase = () => {
    const title = text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setText(title);
  };

  const toSentenceCase = () => {
    const sentence = text
      .toLowerCase()
      .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m) => m.toUpperCase());
    setText(sentence);
  };

  const toCamelCase = () => {
    const words = text.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").split(/\s+/);
    const camel = words
      .map((word, idx) => (idx === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join("");
    setText(camel);
  };

  const toSnakeCase = () => {
    const snake = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .split(/\s+/)
      .join("_");
    setText(snake);
  };

  const toKebabCase = () => {
    const kebab = text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .split(/\s+/)
      .join("-");
    setText(kebab);
  };

  const toSlugify = () => {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-"); // Replace multiple - with single -
    setText(slug);
  };

  const handleInsertSample = () => {
    setText("welcome to TOOLFORGE! This text CAN easily be converted to ANY case style.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <ALargeSmall className="w-5 h-5 text-brand-500" /> Text Case Workspace
        </h2>
        <button
          onClick={handleInsertSample}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-500 transition-fast cursor-pointer"
        >
          Load Sample Text
        </button>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
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

      {/* Conversion Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Transform to Case Style:
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={toUpperCase}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            UPPERCASE
          </button>
          <button
            onClick={toLowerCase}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            lowercase
          </button>
          <button
            onClick={toTitleCase}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Title Case
          </button>
          <button
            onClick={toSentenceCase}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Sentence Case
          </button>
          <button
            onClick={toCamelCase}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            camelCase
          </button>
          <button
            onClick={toSnakeCase}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            snake_case
          </button>
          <button
            onClick={toKebabCase}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            kebab-case
          </button>
          <button
            onClick={toSlugify}
            disabled={!text}
            className="px-4 py-2.5 text-sm font-mono text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 rounded-lg transition-fast shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="URL Slug format"
          >
            slugify-text
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/40 text-sm text-slate-600 dark:text-slate-300">
        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Quick Tip:</div>
        Choose <span className="font-semibold">Title Case</span> for headings and book titles, <span className="font-semibold">Sentence Case</span> for writing normal paragraphs, and developers can use <span className="font-semibold">camelCase</span>, <span className="font-semibold">snake_case</span>, or <span className="font-semibold">kebab-case</span> for code variables, and <span className="font-semibold">slugify</span> for SEO-friendly URLs.
      </div>
    </div>
  );
}
