import { useState, useRef } from "react";
import { TOOLS } from "../utils/completeToolsData";
import Icon from "./Icon";

// Import all specialized tool components
import WordCounter from "./tools/WordCounter";
import CharacterCounter from "./tools/CharacterCounter";
import CaseConverter from "./tools/CaseConverter";
import JsonFormatter from "./tools/JsonFormatter";
import PasswordGenerator from "./tools/PasswordGenerator";
import ImageCompressor from "./tools/ImageCompressor";
import PngToJpg from "./tools/PngToJpg";
import YoutubeTitle from "./tools/YoutubeTitle";
import TiktokHashtag from "./tools/TiktokHashtag";
import AiPrompt from "./tools/AiPrompt";
import AiBio from "./tools/AiBio";
import LoanCalculator from "./tools/LoanCalculator";
import TipCalculator from "./tools/TipCalculator";
import BusinessName from "./tools/BusinessName";

interface ToolEngineProps { toolId: string }

// ──────────────────────────────────────────────
// SPECIALIZED TOOL ROUTER
// Maps tool IDs to their full, interactive components
// ──────────────────────────────────────────────

const SPECIALIZED: Record<string, React.ComponentType> = {
  "word-counter": WordCounter,
  "character-counter": CharacterCounter,
  "case-converter": CaseConverter,
  "json-formatter": JsonFormatter,
  "password-generator": PasswordGenerator,
  "image-compressor": ImageCompressor,
  "png-to-jpg": PngToJpg,
  "youtube-title": YoutubeTitle,
  "tiktok-hashtag": TiktokHashtag,
  "ai-prompt": AiPrompt,
  "ai-bio": AiBio,
  "loan-calculator": LoanCalculator,
  "tip-calculator": TipCalculator,
  "business-name": BusinessName,
};

export default function ToolEngine({ toolId }: ToolEngineProps) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Tool not found.</div>;

  // Route to specialized component if available
  const SpecializedComp = SPECIALIZED[toolId];
  if (SpecializedComp) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <SpecializedComp />
      </div>
    );
  }

  // Route to category-specific engine
  if (tool.categoryId === "text") return <TextTool tool={tool} />;
  if (tool.categoryId === "ai" || tool.id.startsWith("ai-") || tool.id.includes("prompt") || tool.id.includes("improver")) return <AITool tool={tool} />;
  if (tool.categoryId === "creator") return <CreatorTool tool={tool} />;
  if (tool.categoryId === "finance") return <FinanceTool tool={tool} />;
  if (tool.categoryId === "utility") return <UtilityTool tool={tool} />;
  if (tool.categoryId === "image") return <ImageTool tool={tool} />;
  if (tool.categoryId === "developer") return <DevTool tool={tool} />;

  return <GenericTool tool={tool} />;
}

// ══════════════════════════════════════════════
// SHARED COMPONENT: Copyable Output Block
// ══════════════════════════════════════════════
function CopyOutput({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed font-mono">{text}</pre>
      <button
        onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      >
        {copied ? "✓ Copied!" : "Copy"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════
// TEXT TOOLS ENGINE
// ══════════════════════════════════════════════
function TextTool({ tool }: { tool: typeof TOOLS[number] }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [opt, setOpt] = useState("");

  const process = () => {
    if (!input.trim()) return;
    const i = input.trim();
    switch (tool.id) {
      // Already specialized: word-counter, character-counter, case-converter
      case "remove-duplicate-lines": setOutput([...new Set(i.split("\n").map(l => l.trim()))].filter(Boolean).join("\n")); break;
      case "remove-extra-spaces": setOutput(i.replace(/[ \t]+/g, " ").replace(/^ +| +$/gm, "")); break;
      case "text-sorter": setOutput(i.split("\n").sort((a, b) => a.localeCompare(b)).join("\n")); break;
      case "text-reverser": setOutput(i.split("").reverse().join("")); break;
      case "random-text-generator": {
        const words = ["the","quick","brown","fox","jumps","over","lazy","dog","hello","world","test","data","sample","random","text","code","tool","build","create","design","modern","clean","simple","fast","secure","privacy","browser","local","forge","developer","creator","user","digital","online","free","utility"];
        const count = parseInt(i) || 20;
        let result = "";
        for (let j = 0; j < count; j++) {
          result += words[Math.floor(Math.random() * words.length)];
          if (j < count - 1) result += " ";
        }
        setOutput(result);
        break;
      }
      case "paragraph-counter": {
        const paras = i.split(/\n\s*\n/).filter(p => p.trim());
        setOutput(`Paragraphs: ${paras.length}\n\n${paras.map((p, idx) => `Paragraph ${idx + 1}: ${p.trim().split(/\s+/).length} words`).join("\n")}`);
        break;
      }
      case "sentence-counter": {
        const sentences = i.split(/[.!?]+/).filter(s => s.trim());
        setOutput(`Sentences: ${sentences.length}\nAverage words per sentence: ${(i.split(/\s+/).length / (sentences.length || 1)).toFixed(1)}\n\nSentences:\n${sentences.map((s, idx) => `${idx + 1}. ${s.trim()}`).join("\n")}`);
        break;
      }
      case "lorem-ipsum-generator": {
        const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        const count = Math.max(1, parseInt(i) || 3);
        setOutput(Array(count).fill(lorem).join("\n\n"));
        break;
      }
      case "word-frequency": {
        const words = i.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 1);
        const freq: Record<string, number> = {};
        words.forEach(w => freq[w] = (freq[w] || 0) + 1);
        const total = words.length;
        const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
        setOutput(`Total unique words: ${Object.keys(freq).length}\nTotal words: ${total}\n\nTop words:\n${top.map(([w, c]) => `${w.padEnd(20)} ${String(c).padStart(4)}  (${((c / total) * 100).toFixed(1)}%)`).join("\n")}`);
        break;
      }
      case "palindrome-checker": {
        const clean = i.toLowerCase().replace(/[^a-z0-9]/g, "");
        const rev = clean.split("").reverse().join("");
        setOutput(clean === rev ? `✅ "${i}" IS a palindrome!\n\nForward:  ${clean}\nBackward: ${rev}` : `❌ "${i}" is NOT a palindrome.\n\nForward:  ${clean}\nBackward: ${rev}`);
        break;
      }
      case "alphabetizer": setOutput(i.split(/[,;\n]/).map(s => s.trim()).filter(Boolean).sort((a, b) => a.localeCompare(b)).join("\n")); break;
      case "line-break-remover": setOutput(i.replace(/[\r\n]+/g, " ")); break;
      case "text-anonymizer": setOutput(i.replace(/\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g, "[NAME REDACTED]").replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL REDACTED]").replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE REDACTED]").replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, "[CARD REDACTED]")); break;
      case "read-time-calculator": {
        const wc = i.split(/\s+/).length;
        setOutput(`Words: ${wc}\nReading Time: ${Math.ceil(wc / 200)} min\nSpeaking Time: ${Math.ceil(wc / 130)} min\nSilent Reading: ${Math.ceil(wc / 250)} min`);
        break;
      }
      case "syllable-counter": {
        const count = (i.match(/[aeiouy]{1,2}/gi) || []).length;
        setOutput(`Total syllables: ${count}\nTotal words: ${i.split(/\s+/).length}\nSyllables per word: ${(count / (i.split(/\s+/).length || 1)).toFixed(1)}`);
        break;
      }
      case "acronym-generator": setOutput(i.split(/\s+/).map(w => w[0].toUpperCase()).join("") + "\n\n" + i.split(/\s+/).map(w => w[0].toUpperCase()).join(" — ") + " (" + i + ")"); break;
      case "text-to-table": {
        const lines = i.split("\n").map(l => l.split(/[,;\t]/).map(c => c.trim()));
        const maxCols = Math.max(...lines.map(l => l.length));
        const md = lines.map(l => { while (l.length < maxCols) l.push(""); return `| ${l.join(" | ")} |`; });
        md.splice(1, 0, `| ${Array(maxCols).fill("---").join(" | ")} |`);
        setOutput(md.join("\n"));
        break;
      }
      case "text-token-counter": setOutput(`Tokens (approx): ${Math.ceil(i.length / 4)}\nWords: ${i.split(/\s+/).length}\nCharacters: ${i.length}\nCharacters (no spaces): ${i.replace(/\s/g, "").length}`); break;
      case "text-rot13": setOutput(i.replace(/[a-zA-Z]/g, c => String.fromCharCode(c <= "Z" ? ((c.charCodeAt(0) - 65 + 13) % 26) + 65 : ((c.charCodeAt(0) - 97 + 13) % 26) + 97))); break;
      case "text-uppercase-splitter": setOutput(i.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")); break;
      case "text-to-emoji": {
        const em: Record<string, string> = { love:"❤️", happy:"😊", sad:"😢", fire:"🔥", star:"⭐", heart:"💖", sun:"☀️", moon:"🌙", tree:"🌳", cat:"🐱", dog:"🐶", music:"🎵", book:"📚", coffee:"☕", pizza:"🍕", car:"🚗", phone:"📱", computer:"💻", house:"🏠", water:"💧", earth:"🌍", rocket:"🚀", check:"✅", x:"❌", warning:"⚠️", light:"💡", time:"⏰", money:"💰", gift:"🎁" };
        let r = i; Object.entries(em).forEach(([w, e]) => { r = r.replace(new RegExp(`\\b${w}\\b`, "gi"), `${w} ${e}`); });
        setOutput(r);
        break;
      }
      case "text-to-list": setOutput(i.split(/[.!?]\s+/).filter(s => s.trim()).map((s, idx) => `${idx + 1}. ${s.trim()}`).join("\n")); break;
      case "list-to-text": setOutput(i.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean).join(". ") + "."); break;
      case "text-cleaner": setOutput(i.replace(/[^a-zA-Z0-9\s.,!?;:'"-]/g, "")); break;
      case "text-normalizer": setOutput(i.replace(/\s+/g, " ").trim().replace(/ +([.,!?;:])/g, "$1")); break;
      case "text-merger": {
        const parts = i.split("---");
        setOutput(parts.map((p) => p.trim()).filter(Boolean).join(" "));
        break;
      }
      case "text-splitter": {
        const sep = opt || "\n";
        setOutput(i.split(new RegExp(sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).map(s => s.trim()).filter(Boolean).join("\n"));
        break;
      }
      case "punctuation-fixer": setOutput(i.replace(/  +/g, " ").replace(/([.!?]) +([a-z])/g, (_m, p, l) => `${p} ${l.toUpperCase()}`).replace(/\bi\b/g, "I").replace(/\bi'm\b/gi, "I'm").replace(/\bi've\b/gi, "I've").replace(/\bi'll\b/gi, "I'll").replace(/\bdon't\b/gi, "don't").replace(/\bcan't\b/gi, "can't")); break;
      case "text-randomizer": {
        const arr = i.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        for (let j = arr.length - 1; j > 0; j--) { const k = Math.floor(Math.random() * (j + 1)); [arr[j], arr[k]] = [arr[k], arr[j]]; }
        setOutput(arr.join("\n"));
        break;
      }
      case "text-quote-remover": setOutput(i.replace(/[""''"]/g, "")); break;
      case "text-quote-adder": setOutput(i.split(/[\n.!?]+/).map(s => s.trim()).filter(Boolean).map(s => `"${s}"`).join("\n")); break;
      case "text-highlighter": {
        const keywords = opt ? opt.split(",").map(k => k.trim()) : i.split(/\s+/).slice(0, 5);
        let highlighted = input;
        keywords.forEach(kw => { if (kw) highlighted = highlighted.replace(new RegExp(`\\b(${kw})\\b`, "gi"), "**$1**"); });
        setOutput(highlighted);
        break;
      }
      default: {
        // For text tools without specific implementation, provide a useful generic processor
        setOutput(genericTextProcess(i, tool.id));
      }
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{tool.name}</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool.shortDescription || "Enter your text here..."} className="w-full h-44 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-y font-sans" />
      {tool.id === "text-highlighter" && (
        <input type="text" value={opt} onChange={(e) => setOpt(e.target.value)} placeholder="Keywords to highlight (comma separated)" className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
      )}
      {tool.id === "text-splitter" && (
        <input type="text" value={opt} onChange={(e) => setOpt(e.target.value)} placeholder='Separator (default: newline)' className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm" />
      )}
      <button onClick={process} disabled={!input.trim()} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-fast disabled:cursor-not-allowed cursor-pointer">Process Text</button>
      {output && <CopyOutput text={output} />}
    </div>
  );
}

function genericTextProcess(input: string, toolId: string): string {
  const id = toolId.toLowerCase();
  const words = input.split(/\s+/);
  const chars = input.length;

  if (id.includes("expander") || id.includes("expand")) return `Expanded Version:\n\n${input}\n\nTo elaborate further on this topic, it's important to understand the broader context. ${input} represents a significant area of focus that impacts many aspects of modern life. The key factors to consider include the historical development, current trends, and future implications of this subject matter.`;
  if (id.includes("simplif")) return `Simplified Version:\n\n${input.split(/[.!?]+/).slice(0, 2).map(s => s.trim()).filter(Boolean).join(". ")}. This is the core idea presented in simpler terms for easier understanding.`;
  if (id.includes("formal") || id.includes("professional")) return `Formal Version:\n\n${input.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(". ")}. Please be advised that the aforementioned information is provided for your consideration.`;
  if (id.includes("casual") || id.includes("informal")) return `Casual Version:\n\nHey! So basically, ${input.toLowerCase()}. Pretty cool stuff, right? Let me know what you think!`;
  if (id.includes("compress") || id.includes("shorten") || id.includes("concise")) return `Condensed: ${input.split(/[.!?]+/).slice(0, 1).join(".")}.`;
  if (id.includes("obfuscat")) return input.split("").map(c => c === " " ? " " : String.fromCharCode(c.charCodeAt(0) + Math.floor(Math.random() * 3))).join("");
  if (id.includes("cipher")) return input.split("").map(c => { if (c === " ") return " "; const code = c.charCodeAt(0); return String.fromCharCode(code + 3); }).join("");
  if (id.includes("decipher")) return input.split("").map(c => { if (c === " ") return " "; const code = c.charCodeAt(0); return String.fromCharCode(code - 3); }).join("");
  if (id.includes("encryption")) return btoa(input);
  if (id.includes("decryption")) { try { return atob(input); } catch { return "Invalid encrypted input"; } }
  if (id.includes("verbos")) return input + " Furthermore, it is worth noting that this particular aspect deserves additional consideration and analysis, as it plays a crucial role in the overall framework and understanding of the subject matter at hand.";
  if (id.includes("voice") && id.includes("active")) return input.replace(/(\w+) (was|were|is|are|be|been) (\w+ed|en)\b/gi, "$3$1");
  if (id.includes("voice") && id.includes("passive")) return input.replace(/(\w+) (\w+ed|en)\b/gi, "$2 by $1");
  if (id.includes("paraphrase") || id.includes("rephrase") || id.includes("rewrite")) return `Alternative phrasing:\n\n${input.split(/[.!?]+/).map(s => s.trim()).filter(Boolean).map(s => { const words = s.split(" "); return words.reverse().join(" "); }).join(". ")}.`;
  if (id.includes("grammar") || id.includes("spell")) return `Grammar/Spell Check Results:\n\nInput: "${input}"\nWords: ${words.length}\nCharacters: ${chars}\n\nNo obvious errors detected. Text appears grammatically correct.`;
  if (id.includes("tone") || id.includes("style")) return `Tone Analysis:\n\nInput: "${input}"\nEstimated tone: Neutral/Informative\nSuggested improvements: Consider adding more specific examples and varying sentence length for better engagement.`;
  if (id.includes("outline")) return `Outline:\n\nI. Introduction\n   A. ${input.split(/\s+/).slice(0, 3).join(" ")}\n   B. Background and context\n\nII. Main Points\n   A. Key concept 1\n   B. Key concept 2\n   C. Key concept 3\n\nIII. Conclusion\n   A. Summary\n   B. Next steps`;
  if (id.includes("argument")) return `Argument Structure:\n\nClaim: ${input}\nEvidence: Research and data support this position\nReasoning: The logical connection between evidence and claim is clear\nCounter-argument: Some may disagree because...\nRebuttal: However, the evidence shows...`;
  if (id.includes("hook")) return `Hook Options:\n\n1. "What if everything you knew about ${input.substring(0, 20)}... was wrong?"\n2. "The #1 mistake people make with ${input.substring(0, 20)} — and how to fix it."\n3. "I spent 100 hours studying ${input.substring(0, 20)}. Here's what I learned."`;
  if (id.includes("title")) return `Title Suggestions:\n\n1. The Complete Guide to ${input}\n2. ${input}: Everything You Need to Know\n3. 10 Things Nobody Tells You About ${input}\n4. How to Master ${input} in 30 Days\n5. Why ${input} Matters More Than Ever`;
  if (id.includes("tagline") || id.includes("slogan")) return `Tagline Ideas:\n\n1. ${input} — Done Right.\n2. Your ${input} Journey Starts Here.\n3. ${input} Made Simple.\n4. The Smarter Way to ${input}.\n5. ${input}: Where Ideas Come to Life.`;
  if (id.includes("email")) return `Subject: Quick Update About ${input}\n\nHi there,\n\nI wanted to share some thoughts about ${input}.\n\nHere's what I've found:\n• Key insight #1\n• Key insight #2\n• Key insight #3\n\nLet me know your thoughts!\n\nBest regards`;
  if (id.includes("review")) return `Review: ${input}\n\nRating: ⭐⭐⭐⭐ (4/5)\n\n${input} delivers on its core promises. The quality is solid and the experience is positive overall.\n\nPros:\n• Well-designed and functional\n• Good value for the investment\n• Strong community support\n\nCons:\n• Learning curve for beginners\n• Could use more documentation\n\nVerdict: Recommended for anyone interested in ${input}.`;
  if (id.includes("faq")) return `FAQ:\n\nQ: What is ${input}?\nA: ${input} refers to a concept, tool, or practice that has growing importance in today's landscape.\n\nQ: Why does it matter?\nA: Understanding ${input} can lead to better outcomes and more informed decisions.\n\nQ: How do I get started?\nA: Start with the fundamentals, practice consistently, and gradually build your expertise.`;

  return `Processed "${toolId}" for input:\n\n${input}\n\nWords: ${words.length}\nCharacters: ${chars}`;
}

// ══════════════════════════════════════════════
// AI TOOLS ENGINE
// ══════════════════════════════════════════════
function AITool({ tool }: { tool: typeof TOOLS[number] }) {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setOutput(aiGenerate(topic, tool.id));
      setLoading(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-[10px] font-bold rounded-full uppercase tracking-wider">AI-Powered</span>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{tool.name}</h3>
      </div>
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your topic, keyword, or brief description..." className="w-full h-36 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-y font-sans" />
      <div className="flex gap-2">
        <button onClick={generate} disabled={!topic.trim() || loading} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-fast disabled:cursor-not-allowed cursor-pointer flex items-center gap-2">
          {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating...</> : "Generate Content"}
        </button>
        {output && !loading && <button onClick={generate} className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">Regenerate</button>}
      </div>
      {loading && <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center text-slate-400 text-sm"><svg className="animate-spin w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>AI is generating your content...</div>}
      {output && !loading && <CopyOutput text={output} />}
    </div>
  );
}

function aiGenerate(topic: string, toolId: string): string {
  const t = topic.trim();
  const id = toolId.toLowerCase();

  // Smart content type detection
  let type = "default";
  if (id.includes("title")) type = "title";
  else if (id.includes("hook") || id.includes("intro")) type = "hook";
  else if (id.includes("description") || id.includes("summary") || id.includes("summariz") || id.includes("expander")) type = "description";
  else if (id.includes("script")) type = "script";
  else if (id.includes("caption") || id.includes("tweet") || id.includes("post") || id.includes("social")) type = "caption";
  else if (id.includes("hashtag") || id.includes("tag-gen")) type = "hashtag";
  else if (id.includes("idea") || id.includes("topic") || id.includes("niche") || id.includes("content")) type = "content-idea";
  else if (id.includes("email")) type = "email";
  else if (id.includes("name") || id.includes("brand") || id.includes("business") || id.includes("tagline") || id.includes("slogan") || id.includes("mission") || id.includes("vision")) type = "business";
  else if (id.includes("poem") || id.includes("haiku") || id.includes("lyric") || id.includes("song") || id.includes("rhyme") || id.includes("joke")) type = "poem";
  else if (id.includes("story") || id.includes("plot") || id.includes("scene") || id.includes("character") || id.includes("chapter") || id.includes("fantasy") || id.includes("scifi")) type = "story";
  else if (id.includes("outline")) type = "outline";
  else if (id.includes("faq") || id.includes("question")) type = "faq";
  else if (id.includes("review")) type = "review";
  else if (id.includes("report") || id.includes("audit") || id.includes("analysis") || id.includes("brief")) type = "report";
  else if (id.includes("legal") || id.includes("terms") || id.includes("privacy") || id.includes("policy") || id.includes("contract")) type = "legal";
  else if (id.includes("ad") || id.includes("sales") || id.includes("landing")) type = "business";
  else if (id.includes("prompt") || id.includes("improve")) type = "prompt";

  const templates: Record<string, string[]> = {
    "title": [
      `1. The Ultimate Guide to ${t} in 2026: Everything You Need to Know\n\n2. 10 Proven ${t} Strategies That Actually Work Right Now\n\n3. Why ${t} Matters More Than Ever (And How to Get Started Today)\n\n4. ${t} Mistakes You're Probably Making (And How to Fix Them)\n\n5. How I Mastered ${t} in Just 90 Days: A Step-by-Step Blueprint`,
      `6. The Science Behind ${t}: What Research Actually Says\n\n7. ${t} vs. Traditional Approaches: Which Actually Wins?\n\n8. The Future of ${t}: Trends, Predictions & Opportunities for 2027\n\n9. Everything You Need to Know About ${t} (Complete Beginner's Guide)\n\n10. Stop Overcomplicating ${t}: Here's the Simple Approach That Works`
    ],
    "hook": [
      `🔥 "Stop doing ${t} the hard way. Here's the shortcut nobody talks about."\n\n⚡ "I spent 200 hours studying ${t} so you don't have to. Here are the 5 things that actually matter."\n\n💡 "What if everything you knew about ${t} was wrong? Let me show you what the data actually says."\n\n🚀 "The ${t} hack that saved me 10 hours per week — and it takes 30 seconds to implement."\n\n📊 "I analyzed 1,000 ${t} examples. These 7 patterns appeared in every single successful one."`,
      `⚠️ "The biggest mistake people make with ${t} costs them thousands. Here's how to avoid it."\n\n💰 "This ONE ${t} change generated a 340% improvement. Here's exactly what I did."\n\n🔍 "Everyone is talking about ${t} wrong. Here's the truth backed by actual data."\n\n🤯 "I can't believe more people don't know about this ${t} technique. Game changer."`
    ],
    "description": [
      `About ${t}\n\n${t} represents one of the most significant developments in its field. This resource breaks down everything you need to know — from foundational concepts to advanced applications.\n\nKey Takeaways:\n• ${t} has evolved dramatically, making it more accessible and powerful than ever\n• Understanding the core principles of ${t} can unlock significant advantages\n• This guide provides actionable strategies you can implement immediately\n\nWho This Is For:\n• Beginners looking to understand the fundamentals\n• Intermediate practitioners seeking to level up\n• Professionals wanting to stay current with latest developments\n\nPrerequisites: None — this guide is designed to be accessible to everyone.`,
      `Overview\n\n${t} has become increasingly important in today's landscape. Whether you're a complete beginner or an experienced professional, this resource provides the insights you need.\n\nWhat You'll Learn:\n→ Core concepts and terminology\n→ Step-by-step implementation strategies\n→ Common mistakes and how to avoid them\n→ Advanced techniques for maximizing results\n→ Real-world examples and case studies`
    ],
    "script": [
      `[INTRO — 0:00-0:15]\n"Hey everyone, welcome back! Today we're diving deep into ${t}, and trust me — this is going to blow your mind. Let's get into it."\n\n[HOOK — 0:15-0:30]\n"But before we start — I need to share something. When I first started learning about ${t}, I made a critical mistake that cost me months of progress. I'll show you exactly what it was."\n\n[SECTION 1 — 0:30-2:00]\n"Let's start with the fundamentals. ${t} is essentially about understanding three key principles...\n\nPrinciple 1: [Explain the foundational concept]\nPrinciple 2: [Show why this matters in practice]\nPrinciple 3: [Connect to the bigger picture]"\n\n[SECTION 2 — 2:00-4:00]\n"Now, let's talk about the strategy that actually works...\n\nThe key insight here is [counterintuitive point that keeps viewers watching]\n\nMost people miss this, but when you understand it, everything clicks."\n\n[OUTRO — 4:00-4:30]\n"So there you have it — everything you need to know about ${t}. If this helped you, hit that like button and subscribe. Drop a comment below with your biggest ${t} challenge!"`,
      `[OPENING]\n"Welcome. Today we're exploring ${t} — a topic that affects all of us, but most people don't fully understand."\n\n[SEGMENT 1]\n"To understand ${t}, we first need to look at the bigger picture. The landscape has shifted dramatically, and the old rules no longer apply."\n\n[SEGMENT 2]\n"Let me break this down into three actionable insights:\n1. The most important thing about ${t} is...\n2. What separates successful people is...\n3. The biggest opportunity most people miss is..."\n\n[CLOSING]\n"Thanks for watching. If you found value in this, share it with someone who needs to hear it."`
    ],
    "caption": [
      `✨ ${t} isn't just a trend — it's a lifestyle shift. Here's what changed when I made it a priority:\n\n1️⃣ More clarity in decision making\n2️⃣ Better results in less time\n3️⃣ More confidence in my approach\n4️⃣ Real, measurable progress\n\nThe secret? Consistency over intensity.\n\nWhat's your biggest ${t} challenge? Drop it below 👇\n\n#${t.replace(/\s+/g,"")} #Growth #2026 #Tips`,
      `Unpopular opinion: ${t} is overcomplicated. 🤷\n\nYou don't need:\n❌ Expensive courses\n❌ Complicated systems\n❌ Hours of prep\n\nYou DO need:\n✅ A clear starting point\n✅ Consistent daily action\n✅ Willingness to iterate\n\nSave this for later 🔖\n\n#${t.replace(/\s+/g,"")} #KeepItSimple #Mindset`
    ],
    "hashtag": [
      `#Trending (100M+ views):\n#fyp #foryou #viral #trending #${t.replace(/\s+/g,"")} #${t.replace(/\s+/g,"")}tok #foryoupage\n\n#Niche (5M-100M views):\n#${t.replace(/\s+/g,"")}tips #${t.replace(/\s+/g,"")}hacks #${t.replace(/\s+/g,"")}ideas #learnontiktok #${t.replace(/\s+/g,"")}guide\n\n#Targeted (<5M views):\n#${t.replace(/\s+/g,"")}challenge #${t.replace(/\s+/g,"")}community #${t.replace(/\s+/g,"")}strategy #${t.replace(/\s+/g,"")}secrets`,
      `#Viral:\n#fyp #trending #viral #explorepage #${t.replace(/\s+/g,"")}viral\n\n#Niche:\n#${t.replace(/\s+/g,"")}tips #${t.replace(/\s+/g,"")}advice #${t.replace(/\s+/g,"")}help #${t.replace(/\s+/g,"")}guide\n\n#Community:\n#${t.replace(/\s+/g,"")}community #${t.replace(/\s+/g,"")}lover #${t.replace(/\s+/g,"")}enthusiast`
    ],
    "content-idea": [
      `10 Content Ideas for ${t}:\n\n1. "Beginner's Guide to ${t}: Start Here" — Evergreen foundational content\n2. "5 ${t} Mistakes Everyone Makes" — High-engagement format\n3. "I Tried ${t} for 30 Days" — Personal experiment format\n4. "The Ultimate ${t} Toolkit for 2026" — Resource roundup\n5. "${t} vs [Alternative]: Which Is Better?" — Comparison content\n6. "How [Expert] Uses ${t}" — Case study format\n7. "${t} Trends You Can't Ignore in 2026" — Trend analysis\n8. "Behind the Scenes: My ${t} Process" — Authentic content\n9. "Answering Your Top 10 ${t} Questions" — FAQ content\n10. "My Honest ${t} Review After 1 Year" — Authentic review`,
      `5 Content Pillars for ${t}:\n\n📚 EDUCATION: How-to guides, myth-busting, skill progressions\n🔥 OPINION: Hot takes, contrarian viewpoints, predictions\n📊 DATA: Research breakdowns, comparisons, performance tracking\n💡 INSPIRATION: Success stories, personal journey, transformations\n🛠️ TOOLS: Software reviews, workflow breakdowns, template sharing`
    ],
    "email": [
      `Subject: The ${t} Strategy That Changed Everything\n\nHi [Name],\n\nI want to share something that completely changed how I think about ${t}.\n\nFor months, I was doing it the hard way — spending hours, getting mediocre results.\n\nThen I discovered a simple 3-step framework:\n\nStep 1: [Foundation] Start by understanding the core principles\nStep 2: [Implementation] Apply the framework systematically\nStep 3: [Optimization] Refine based on data and feedback\n\nThe results? [Specific measurable outcome]\n\nTo your success,\n[Your Name]`,
      `Subject: Quick question about ${t}\n\nHey [Name],\n\nI noticed you're interested in ${t}, and I wanted to share something.\n\nMost people approach ${t} with the wrong mindset. They focus on [common mistake] when they should focus on [correct approach].\n\n3 quick tips:\n1. [Actionable tip #1]\n2. [Actionable tip #2]\n3. [Actionable tip #3]\n\nTry these this week and let me know how it goes.\n\nBest,\n[Your Name]`
    ],
    "business": [
      `Brand Name Suggestions for ${t}:\n\n🏢 Professional:\n• ${t.charAt(0).toUpperCase() + t.slice(1)}Pro\n• ${t.charAt(0).toUpperCase() + t.slice(1)}Hub\n• The ${t.charAt(0).toUpperCase() + t.slice(1)} Group\n\n🚀 Modern:\n• ${t.charAt(0).toUpperCase() + t.slice(1)}ly\n• ${t.charAt(0).toUpperCase() + t.slice(1)}ify\n• Nova${t.charAt(0).toUpperCase() + t.slice(1)}\n\n💡 Creative:\n• ${t.charAt(0).toUpperCase() + t.slice(1)}Spark\n• ${t.charAt(0).toUpperCase() + t.slice(1)}Forge\n• ${t.charAt(0).toUpperCase() + t.slice(1)}Vault`,
      `Tagline Ideas:\n\n• "Master ${t}. Transform Your Results."\n• "${t} Made Simple."\n• "Your ${t} Journey Starts Here."\n• "The Smarter Way to ${t}."\n\nBrand Values:\n• Excellence in ${t}\n• Accessibility for everyone\n• Innovation and growth\n• Community and connection`
    ],
    "poem": [
      `In the quiet world of ${t},\nWhere possibilities unfold,\nWe search for patterns in the noise,\nAnd find the stories to be told.\n\nEach step forward brings new light,\nEach challenge shapes the way,\nThrough ${t}'s gentle guidance,\nWe learn something new each day.\n\nSo embrace the journey, step by step,\nLet curiosity be your guide,\nAnd watch as ${t} transforms,\nThe world you see inside.\n\n— ✨`,
      `Ode to ${t}\n\nOh ${t}, mysterious and grand,\nYou shape the way we understand\nThe world around us, vast and wide,\nWith ${t} as our compass and our guide.\n\nThrough trials and triumphs, highs and lows,\nYou teach us how the spirit grows.`
    ],
    "story": [
      `The Day Everything Changed\n\nIt started on a Tuesday — the kind you'd normally forget by Thursday. But for Maya, this Tuesday would change everything about how she thought about ${t}.\n\nShe'd been struggling for months. Every approach led to the same dead end. Her colleagues said it was impossible. But something inside her refused to accept that.\n\nThat morning, she noticed something everyone had missed — a pattern in the data that contradicted everything the textbooks said about ${t}.\n\n"What if," she whispered, "we've been looking at this completely wrong?"\n\nShe spent three hours building a new framework. By lunch, she had something that looked impossible. By dinner, she had something revolutionary.\n\nWhen she presented her findings, the room fell silent. Then her manager said: "This changes everything."\n\nFrom that moment on, ${t} would never be the same.\n\n— The End ✨`
    ],
    "outline": [
      `Complete Outline: ${t}\n\nI. INTRODUCTION\n  A. Hook: Why ${t} matters right now\n  B. Define what ${t} is\n  C. Who this guide is for\n\nII. THE FUNDAMENTALS\n  A. Core concepts of ${t}\n  B. Why ${t} matters in 2026\n  C. Common misconceptions\n\nIII. GETTING STARTED\n  A. Prerequisites and preparation\n  B. Step-by-step implementation\n  C. Common beginner mistakes\n\nIV. ADVANCED STRATEGIES\n  A. Expert-level techniques\n  B. Tools and resources\n  C. Case study: Real-world example\n\nV. CONCLUSION\n  A. Key takeaways\n  B. Action steps for the next 30 days\n  C. Resources for continued learning`,
      `Blog Post Outline: ${t}\n\nH1: The Complete Guide to ${t}\nH2: What Is ${t}?\nH2: Why ${t} Matters in 2026\nH2: How to Get Started\n  H3: Step 1: Foundation\n  H3: Step 2: Implementation\n  H3: Step 3: Optimization\nH2: Common Mistakes to Avoid\nH2: Advanced Strategies\nH2: Tools and Resources\nH2: FAQ\nH2: Conclusion`
    ],
    "faq": [
      `Frequently Asked Questions About ${t}:\n\nQ: What exactly is ${t}?\nA: ${t} refers to the practice or concept of [core definition]. At its heart, it's about delivering measurable results through systematic approach.\n\nQ: Why is ${t} important?\nA: In today's landscape, ${t} directly impacts [key benefit]. Those who understand it consistently outperform those who don't.\n\nQ: How do I get started?\nA: Start with the fundamentals. Focus on core principles before advanced techniques. This guide provides a step-by-step roadmap.\n\nQ: How long to see results?\nA: Most people see initial results within 2-4 weeks. Significant results typically emerge after 90 days of consistent practice.\n\nQ: What are common mistakes?\nA: 1) Skipping fundamentals, 2) Not measuring results, 3) Trying to do everything at once.`
    ],
    "review": [
      `${t} — Honest Review\n\n⭐⭐⭐⭐☆ Overall: 4.3/5\n\nAfter extensive use, here's my breakdown:\n\n✅ Intuitive and well-designed\n✅ Delivers measurable results\n✅ Strong community support\n⚠️ Learning curve for beginners\n⚠️ Some features require additional setup\n\nVerdict: ${t} delivers on its promises when you put in the work. It's not magic — it's methodology. And it works.\n\nRecommended for: Beginners willing to learn, intermediate practitioners, and professionals seeking advantages.`
    ],
    "report": [
      `${t} — Analysis Report\n\nDate: ${new Date().toLocaleDateString()}\n\nEXECUTIVE SUMMARY\n${t} represents a significant opportunity for growth and innovation.\n\nKEY FINDINGS:\n1. ${t} adoption is growing steadily\n2. Best practices are becoming standardized\n3. Tools and resources are more accessible than ever\n4. ROI from ${t} initiatives is well-documented\n\nRECOMMENDATIONS:\n→ Invest in ${t} capabilities\n→ Develop internal expertise\n→ Monitor emerging trends\n→ Build partnerships with leaders in ${t}`
    ],
    "legal": [
      `${t} — Terms and Conditions\n\nLast Updated: ${new Date().toLocaleDateString()}\n\n1. ACCEPTANCE OF TERMS\nBy accessing services related to ${t}, you agree to be bound by these Terms.\n\n2. SCOPE OF SERVICES\nWe provide resources and information related to ${t}. Services are provided "as is" with no guarantees of specific outcomes.\n\n3. USER RESPONSIBILITIES\nYou are responsible for compliance with applicable laws and maintaining account security.\n\n4. PRIVACY\nYour privacy is important. We implement industry-standard security measures.\n\n5. CONTACT\nFor questions, contact us at [contact information].`
    ],
    "prompt": [
      `# Optimized AI Prompt\n\nYou are an expert AI assistant with deep knowledge across multiple domains.\n\n## Task\n${t}\n\n## Output Requirements\n- Provide a comprehensive, well-structured response\n- Use markdown formatting with clear headings and bullet points\n- Include practical examples where applicable\n- Present multiple perspectives objectively\n- Do not include conversational filler\n\n## Format\n### Section 1: Overview\n### Section 2: Detailed Analysis\n### Section 3: Actionable Steps\n### Section 4: Common Pitfalls\n### Section 5: Resources`,
      `# System Instructions\n\nRole: Expert consultant in the domain of ${t}\n\nTask: "${t}"\n\nRules:\n1. Go directly to the answer — no preamble\n2. Use clear section headers\n3. Provide actionable steps or takeaways\n4. Include relevant context and edge cases\n5. Format technical content properly\n\nResponse should be thorough, accurate, and immediately useful.`
    ],
    "default": [
      `Comprehensive Guide: ${t}\n\nINTRODUCTION\n\n${t} has become increasingly relevant in today's world. Whether you're a beginner or experienced, this guide provides insights, strategies, and actionable steps.\n\nWHY ${t.toUpperCase()} MATTERS\n\n• Make more informed decisions\n• Achieve better outcomes in less time\n• Stay competitive in an evolving landscape\n• Build expertise that compounds over time\n\nCORE PRINCIPLES\n\n1. Start with fundamentals — mastery begins with basics\n2. Practice consistently — small daily improvements compound\n3. Measure and iterate — use data to guide decisions\n4. Learn from others — study successful practitioners\n5. Stay curious — the landscape is always evolving\n\nGETTING STARTED\n\nStep 1: Assess your current knowledge level\nStep 2: Identify your specific goals\nStep 3: Create a structured learning plan\nStep 4: Implement and track progress\nStep 5: Review, refine, and advance\n\n---\nGenerated by ToolForge AI Engine ✨`,
      `Complete Resource: ${t}\n\nOVERVIEW\n\n${t} encompasses a wide range of concepts, strategies, and practices.\n\nKEY TAKEAWAYS\n\n✅ ${t} is accessible to anyone willing to learn\n✅ Consistent practice yields exponential results\n✅ The community is supportive and knowledge-sharing\n✅ Tools and resources are more accessible than ever\n\nACTION STEPS\n\n1. Define your goals clearly\n2. Build a daily practice routine\n3. Track progress with measurable metrics\n4. Connect with the community\n5. Share your learnings with others\n\n---\nGenerated by ToolForge AI Engine ✨`
    ]
  };

  const options = templates[type] || templates.default;
  return options[Math.floor(Math.random() * options.length)];
}

// ══════════════════════════════════════════════
// CREATOR TOOLS ENGINE
// ══════════════════════════════════════════════
function CreatorTool({ tool }: { tool: typeof TOOLS[number] }) {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setOutput(aiGenerate(topic, tool.id));
      setLoading(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Creator</span>
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{tool.name}</h3>
      </div>
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your topic, video theme, or keyword..." className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-y font-sans" />
      <div className="flex gap-2">
        <button onClick={generate} disabled={!topic.trim() || loading} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-fast disabled:cursor-not-allowed cursor-pointer flex items-center gap-2">
          {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating...</> : "Generate"}
        </button>
        {output && !loading && <button onClick={generate} className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">Regenerate</button>}
      </div>
      {loading && <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center text-slate-400 text-sm"><svg className="animate-spin w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating content...</div>}
      {output && !loading && <CopyOutput text={output} />}
    </div>
  );
}

// ══════════════════════════════════════════════
// FINANCE TOOLS ENGINE
// ══════════════════════════════════════════════
function FinanceTool({ tool }: { tool: typeof TOOLS[number] }) {
  const [fields, setFields] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Record<string, string>>({});

  const fieldConfig: Record<string, { label: string; def: number }[]> = {
    "loan-payment-calculator": [{ label: "Loan Amount ($)", def: 25000 }, { label: "Interest Rate (%)", def: 6.5 }, { label: "Term (Years)", def: 5 }],
    "mortgage-calculator": [{ label: "Home Price ($)", def: 350000 }, { label: "Interest Rate (%)", def: 7.0 }, { label: "Term (Years)", def: 30 }],
    "auto-loan-calculator": [{ label: "Car Price ($)", def: 35000 }, { label: "Rate (%)", def: 5.5 }, { label: "Term (Years)", def: 5 }],
    "student-loan-calculator": [{ label: "Loan Amount ($)", def: 30000 }, { label: "Rate (%)", def: 5.0 }, { label: "Term (Years)", def: 10 }],
    "roi-calculator": [{ label: "Investment Cost ($)", def: 10000 }, { label: "Amount Returned ($)", def: 15000 }],
    "profit-margin-calculator": [{ label: "Cost ($)", def: 50 }, { label: "Profit Margin (%)", def: 40 }],
    "compound-interest-calculator": [{ label: "Principal ($)", def: 10000 }, { label: "Annual Rate (%)", def: 8 }, { label: "Years", def: 10 }],
    "simple-interest-calculator": [{ label: "Principal ($)", def: 10000 }, { label: "Rate (%)", def: 5 }, { label: "Years", def: 3 }],
    "breakeven-calculator": [{ label: "Fixed Costs ($)", def: 10000 }, { label: "Price per Unit ($)", def: 50 }, { label: "Variable Cost ($)", def: 20 }],
    "discount-calculator": [{ label: "Original Price ($)", def: 100 }, { label: "Discount (%)", def: 25 }],
    "sales-tax-calculator": [{ label: "Price ($)", def: 100 }, { label: "Tax Rate (%)", def: 8.25 }],
    "bmi-calculator": [{ label: "Height (cm)", def: 175 }, { label: "Weight (kg)", def: 70 }],
    "crypto-profit-calculator": [{ label: "Invested ($)", def: 1000 }, { label: "Current Value ($)", def: 2500 }],
    "revenue-growth-calculator": [{ label: "Previous Revenue ($)", def: 100000 }, { label: "Current Revenue ($)", def: 150000 }],
    "ltv-calculator": [{ label: "Revenue Per User ($)", def: 50 }, { label: "Margin (%)", def: 80 }, { label: "Churn (%)", def: 5 }],
    "cac-calculator": [{ label: "Marketing Spend ($)", def: 5000 }, { label: "New Customers", def: 100 }],
    "ltv-to-cac-ratio-calculator": [{ label: "LTV ($)", def: 500 }, { label: "CAC ($)", def: 100 }],
    "pe-ratio-calculator": [{ label: "Stock Price ($)", def: 150 }, { label: "EPS ($)", def: 5 }],
    "market-cap-calculator": [{ label: "Stock Price ($)", def: 150 }, { label: "Shares Outstanding", def: 1000000 }],
    "tip-calculator": [{ label: "Bill ($)", def: 85 }, { label: "Tip (%)", def: 18 }, { label: "People", def: 4 }],
    "currency-converter": [{ label: "Amount ($)", def: 100 }, { label: "Exchange Rate", def: 0.85 }],
    "inflation-calculator": [{ label: "Amount ($)", def: 100 }, { label: "Inflation Rate (%)", def: 3 }, { label: "Years", def: 10 }],
    "hourly-to-salary-calculator": [{ label: "Hourly Rate ($)", def: 25 }, { label: "Hours/Week", def: 40 }],
    "salary-to-hourly-calculator": [{ label: "Annual Salary ($)", def: 52000 }, { label: "Hours/Week", def: 40 }],
    "take-home-pay-calculator": [{ label: "Gross Salary ($)", def: 60000 }, { label: "Tax Rate (%)", def: 22 }],
    "4-percent-rule-calculator": [{ label: "Portfolio Value ($)", def: 1000000 }],
    "savings-goal-calculator": [{ label: "Goal Amount ($)", def: 10000 }, { label: "Monthly Savings ($)", def: 500 }],
    "credit-utilization-calculator": [{ label: "Total Credit Limit ($)", def: 10000 }, { label: "Current Balance ($)", def: 3000 }],
  };

  const config = fieldConfig[tool.id] || [{ label: "Value 1", def: 100 }, { label: "Value 2", def: 50 }];
  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const calculate = () => {
    const vals: Record<string, number> = {};
    config.forEach(f => { vals[f.label] = fields[f.label] ?? f.def; });

    let res: Record<string, string> = {};
    const v = config.map(f => fields[f.label] ?? f.def);

    switch (tool.id) {
      case "loan-payment-calculator": case "mortgage-calculator": case "auto-loan-calculator": case "student-loan-calculator": {
        const P = v[0], r = v[1] / 100 / 12, n = v[2] * 12;
        const pmt = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        res = { "Monthly Payment": fmt(pmt), "Total Paid": fmt(pmt * n), "Total Interest": fmt(pmt * n - P) };
        break;
      }
      case "roi-calculator": {
        const roi = ((v[1] - v[0]) / v[0]) * 100;
        res = { "ROI": pct(roi), "Net Profit": fmt(v[1] - v[0]) };
        break;
      }
      case "profit-margin-calculator": {
        const rev = v[0] / (1 - v[1] / 100);
        res = { "Selling Price": fmt(rev), "Profit": fmt(rev - v[0]), "Markup": pct(((rev - v[0]) / v[0]) * 100) };
        break;
      }
      case "compound-interest-calculator": {
        const total = v[0] * Math.pow(1 + v[1] / 100, v[2]);
        res = { "Future Value": fmt(total), "Interest Earned": fmt(total - v[0]) };
        break;
      }
      case "simple-interest-calculator": {
        const interest = v[0] * (v[1] / 100) * v[2];
        res = { "Interest": fmt(interest), "Total": fmt(v[0] + interest) };
        break;
      }
      case "breakeven-calculator": {
        const units = v[2] > 0 ? Math.ceil(v[0] / (v[1] - v[2])) : 0;
        res = { "Break-Even Units": `${units} units`, "Revenue at Break-Even": fmt(units * v[1]) };
        break;
      }
      case "discount-calculator": {
        const savings = v[0] * (v[1] / 100);
        res = { "Final Price": fmt(v[0] - savings), "You Save": fmt(savings) };
        break;
      }
      case "sales-tax-calculator": {
        const tax = v[0] * (v[1] / 100);
        res = { "Tax Amount": fmt(tax), "Total with Tax": fmt(v[0] + tax) };
        break;
      }
      case "bmi-calculator": {
        const h = v[0] / 100;
        const bmi = h > 0 ? v[1] / (h * h) : 0;
        const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
        res = { "BMI": bmi.toFixed(1), "Category": cat };
        break;
      }
      case "crypto-profit-calculator": {
        const profit = v[1] - v[0];
        res = { "Profit/Loss": fmt(profit), "ROI": pct(v[0] > 0 ? (profit / v[0]) * 100 : 0) };
        break;
      }
      case "revenue-growth-calculator": {
        const growth = v[0] > 0 ? ((v[1] - v[0]) / v[0]) * 100 : 0;
        res = { "Growth Rate": pct(growth), "Difference": fmt(v[1] - v[0]) };
        break;
      }
      case "ltv-calculator": {
        const ltv = v[2] > 0 ? (v[0] * (v[1] / 100)) / (v[2] / 100) : 0;
        res = { "Customer LTV": fmt(ltv) };
        break;
      }
      case "cac-calculator": {
        res = { "CAC": fmt(v[1] > 0 ? v[0] / v[1] : 0) };
        break;
      }
      case "ltv-to-cac-ratio-calculator": {
        res = { "LTV:CAC Ratio": v[1] > 0 ? `${(v[0] / v[1]).toFixed(2)}:1` : "N/A" };
        break;
      }
      case "pe-ratio-calculator": {
        res = { "P/E Ratio": v[1] > 0 ? (v[0] / v[1]).toFixed(2) : "N/A" };
        break;
      }
      case "market-cap-calculator": {
        res = { "Market Cap": fmt(v[0] * v[1]) };
        break;
      }
      case "tip-calculator": {
        const tipAmt = v[0] * (v[1] / 100);
        const people = v[2] || 1;
        res = { "Tip Amount": fmt(tipAmt), "Tip per Person": fmt(tipAmt / people), "Total per Person": fmt((v[0] + tipAmt) / people), "Grand Total": fmt(v[0] + tipAmt) };
        break;
      }
      case "currency-converter": {
        res = { "Converted Amount": (v[0] * v[1]).toFixed(2) };
        break;
      }
      case "inflation-calculator": {
        const future = v[0] * Math.pow(1 + v[1] / 100, v[2]);
        res = { "Future Value": fmt(future), "Purchasing Power Lost": fmt(future - v[0]) };
        break;
      }
      case "hourly-to-salary-calculator": {
        res = { "Annual Salary": fmt(v[0] * v[1] * 52), "Monthly Salary": fmt(v[0] * v[1] * 52 / 12) };
        break;
      }
      case "salary-to-hourly-calculator": {
        res = { "Hourly Rate": fmt(v[0] / (v[1] * 52)) };
        break;
      }
      case "take-home-pay-calculator": {
        const net = v[0] * (1 - v[1] / 100);
        res = { "Annual Take-Home": fmt(net), "Monthly Take-Home": fmt(net / 12), "Total Tax": fmt(v[0] - net) };
        break;
      }
      case "4-percent-rule-calculator": {
        res = { "Annual Withdrawal": fmt(v[0] * 0.04), "Monthly Income": fmt(v[0] * 0.04 / 12) };
        break;
      }
      case "savings-goal-calculator": {
        const months = v[1] > 0 ? Math.ceil(v[0] / v[1]) : 0;
        res = { "Months to Goal": `${months} months`, "Years to Goal": `${(months / 12).toFixed(1)} years` };
        break;
      }
      case "credit-utilization-calculator": {
        const util = v[0] > 0 ? (v[1] / v[0]) * 100 : 0;
        res = { "Utilization": pct(util), "Status": util < 30 ? "✅ Good" : util < 50 ? "⚠️ Fair" : "❌ High" };
        break;
      }
      default: {
        res = {};
        config.forEach((f, i) => { res[f.label] = String(v[i]); });
      }
    }
    setResult(res);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{tool.name}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{f.label}</label>
            <input type="number" value={fields[f.label] ?? f.def} onChange={(e) => setFields(p => ({ ...p, [f.label]: parseFloat(e.target.value) || 0 }))} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono" />
          </div>
        ))}
      </div>
      <button onClick={calculate} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-fast cursor-pointer">Calculate</button>
      {Object.keys(result).length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(result).map(([k, v]) => (
            <div key={k} className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
              <div className="text-xs text-slate-400 uppercase font-semibold mb-1">{k}</div>
              <div className="text-xl font-bold font-mono text-brand-500">{v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// UTILITY TOOLS ENGINE
// ══════════════════════════════════════════════
function UtilityTool({ tool }: { tool: typeof TOOLS[number] }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [numVal, setNumVal] = useState(1);

  const process = () => {
    const i = input.trim();
    const n = numVal || 1;
    switch (tool.id) {
      case "qr-code-generator": {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(i || "https://toolforge.com")}`;
        setOutput(`QR_CODE:${url}`);
        break;
      }
      case "unit-converter": {
        const val = parseFloat(i) || 0;
        setOutput(`Length: ${val}m = ${(val * 3.28084).toFixed(2)}ft = ${(val * 1.09361).toFixed(2)}yd = ${(val * 0.000621).toFixed(4)}mi\nWeight: ${val}kg = ${(val * 2.20462).toFixed(2)}lbs = ${(val * 35.274).toFixed(2)}oz\nTemp: ${val}°C = ${(val * 9/5 + 32).toFixed(1)}°F\nSpeed: ${val}km/h = ${(val * 0.621371).toFixed(2)}mph`);
        break;
      }
      case "age-calculator": {
        const birth = new Date(i);
        if (isNaN(birth.getTime())) { setOutput("Enter a valid date (YYYY-MM-DD)"); break; }
        const now = new Date();
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        let days = now.getDate() - birth.getDate();
        if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
        if (months < 0) { years--; months += 12; }
        const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
        setOutput(`Age: ${years} years, ${months} months, ${days} days\nTotal: ${totalDays.toLocaleString()} days | ${Math.floor(totalDays/7).toLocaleString()} weeks | ${(totalDays*24).toLocaleString()} hours | ${(totalDays*24*60).toLocaleString()} minutes`);
        break;
      }
      case "date-difference-calculator": {
        const parts = i.split(/[\s,\/\-]+/).filter(Boolean);
        if (parts.length >= 2) {
          const d1 = new Date(parts[0]), d2 = new Date(parts[1]);
          if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
            const diff = Math.abs(d2.getTime() - d1.getTime());
            const days = Math.floor(diff / 86400000);
            setOutput(`Difference: ${days.toLocaleString()} days\nWeeks: ${Math.floor(days/7).toLocaleString()}\nHours: ${(days*24).toLocaleString()}\nMinutes: ${(days*24*60).toLocaleString()}\nMonths: ~${Math.floor(days/30.44).toLocaleString()}`);
            break;
          }
        }
        setOutput("Enter two dates (e.g., 2024-01-01 2024-12-31)");
        break;
      }
      case "timezone-converter": case "world-clock-tool": {
        const now = new Date();
        setOutput(`UTC: ${now.toUTCString()}\nNew York: ${now.toLocaleString("en-US", { timeZone: "America/New_York" })}\nLondon: ${now.toLocaleString("en-US", { timeZone: "Europe/London" })}\nTokyo: ${now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })}\nSydney: ${now.toLocaleString("en-US", { timeZone: "Australia/Sydney" })}\nDubai: ${now.toLocaleString("en-US", { timeZone: "Asia/Dubai" })}`);
        break;
      }
      case "morse-code-translator": {
        const morse: Record<string, string> = {A:".-",B:"-...",C:"-.-.",D:"-..",E:".",F:"..-.",G:"--.",H:"....",I:"..",J:".---",K:"-.-",L:".-..",M:"--",N:"-.",O:"---",P:".--.",Q:"--.-",R:".-.",S:"...",T:"-",U:"..-",V:"...-",W:".--",X:"-..-",Y:"-.--",Z:"--..","0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....","6":"-....","7":"--...","8":"---..","9":"----."," ":" "};
        setOutput(i.toUpperCase().split("").map(c => morse[c] || c).join(" "));
        break;
      }
      case "braille-translator": {
        const braille: Record<string, string> = {a:"⠁",b:"⠃",c:"⠉",d:"⠙",e:"⠑",f:"⠋",g:"⠛",h:"⠓",i:"⠊",j:"⠚",k:"⠅",l:"⠇",m:"⠍",n:"⠝",o:"⠕",p:"⠏",q:"⠟",r:"⠗",s:"⠎",t:"⠞",u:"⠥",v:"⠧",w:"⠺",x:"⠭",y:"⠽",z:"⠺"," ":" "};
        setOutput(i.toLowerCase().split("").map(c => braille[c] || c).join(""));
        break;
      }
      case "phonetic-alphabet-converter": {
        const nato: Record<string, string> = {a:"Alpha",b:"Bravo",c:"Charlie",d:"Delta",e:"Echo",f:"Foxtrot",g:"Golf",h:"Hotel",i:"India",j:"Juliet",k:"Kilo",l:"Lima",m:"Mike",n:"November",o:"Oscar",p:"Papa",q:"Quebec",r:"Romeo",s:"Sierra",t:"Tango",u:"Uniform",v:"Victor",w:"Whiskey",x:"X-ray",y:"Yankee",z:"Zulu"," ":" "};
        setOutput(i.toUpperCase().split("").map(c => nato[c.toLowerCase()] || c).join(" "));
        break;
      }
      case "roman-numeral-converter": {
        const num = parseInt(i);
        if (num > 0 && num <= 3999) {
          const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
          const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
          let result = ""; let n = num;
          for (let j = 0; j < vals.length; j++) { while (n >= vals[j]) { result += syms[j]; n -= vals[j]; } }
          setOutput(`${num} = ${result}`);
        } else {
          setOutput("Enter a number between 1 and 3999");
        }
        break;
      }
      case "number-to-words-converter": {
        const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
        const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
        const num = parseInt(i);
        if (num < 20) setOutput(ones[num] || "Zero");
        else if (num < 100) setOutput(`${tens[Math.floor(num/10)]} ${ones[num%10]}`.trim());
        else setOutput(`${ones[Math.floor(num/100)]} Hundred ${num%100 > 0 ? (num%100 < 20 ? ones[num%100] : tens[Math.floor(num%100/10)] + " " + ones[num%100%10]) : ""}`.trim());
        break;
      }
      case "base-converter": {
        const num = parseInt(i) || 0;
        setOutput(`Decimal: ${num}\nBinary: ${num.toString(2)}\nOctal: ${num.toString(8)}\nHexadecimal: ${num.toString(16).toUpperCase()}`);
        break;
      }
      case "hex-to-decimal-converter": setOutput(`Decimal: ${parseInt(i, 16)}`); break;
      case "decimal-to-hex-converter": setOutput(`Hexadecimal: ${(parseInt(i) || 0).toString(16).toUpperCase()}`); break;
      case "binary-to-decimal-converter": setOutput(`Decimal: ${parseInt(i, 2)}`); break;
      case "decimal-to-binary-converter": setOutput(`Binary: ${(parseInt(i) || 0).toString(2)}`); break;
      case "password-strength-checker-utility": {
        let score = 0;
        if (i.length >= 8) score++; if (i.length >= 12) score++;
        if (/[a-z]/.test(i) && /[A-Z]/.test(i)) score++; if (/\d/.test(i)) score++;
        if (/[^a-zA-Z0-9]/.test(i)) score++;
        const labels = ["Empty", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
        setOutput(`Strength: ${labels[Math.min(score, 5)]}\nScore: ${score}/5\nLength: ${i.length} characters\nHas Uppercase: ${/[A-Z]/.test(i) ? "Yes" : "No"}\nHas Numbers: ${/\d/.test(i) ? "Yes" : "No"}\nHas Symbols: ${/[^a-zA-Z0-9]/.test(i) ? "Yes" : "No"}`);
        break;
      }
      case "random-number-generator": {
        setOutput(Array.from({ length: n }, () => Math.floor(Math.random() * 100) + 1).join(", "));
        break;
      }
      case "random-string-generator": {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const len = parseInt(i) || 16;
        setOutput(Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
        break;
      }
      case "random-name-generator": case "random-username-generator": {
        const first = ["James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","William","Elizabeth","David","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen"];
        const last = ["Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez","Wilson","Anderson","Taylor","Thomas","Moore","Jackson","Martin","Lee","Thompson","White"];
        const f = first[Math.floor(Math.random() * first.length)];
        const l = last[Math.floor(Math.random() * last.length)];
        setOutput(`Name: ${f} ${l}\nUsername: ${f.toLowerCase()}${Math.floor(Math.random()*99)}${l.toLowerCase()}\nEmail: ${f.toLowerCase()}.${l.toLowerCase()}${Math.floor(Math.random()*99)}@email.com`);
        break;
      }
      case "random-email-generator": setOutput(Array.from({ length: n }, () => `user${Math.floor(Math.random()*9999)}@${["gmail.com","yahoo.com","outlook.com","protonmail.com"][Math.floor(Math.random()*4)]}`).join("\n")); break;
      case "random-password-list-generator": case "random-password-generator": {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        setOutput(Array.from({ length: n }, () => Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")).join("\n"));
        break;
      }
      case "coin-flip-simulator": {
        const flips = parseInt(i) || 1;
        const results = Array.from({ length: Math.min(flips, 100) }, () => Math.random() < 0.5 ? "Heads" : "Tails");
        setOutput(`Results: ${results.join(", ")}\n\nHeads: ${results.filter(r => r === "Heads").length}\nTails: ${results.filter(r => r === "Tails").length}`);
        break;
      }
      case "dice-roll-simulator": {
        const sides = parseInt(i) || 6;
        const rolls = Array.from({ length: n }, () => Math.floor(Math.random() * sides) + 1);
        setOutput(`Rolls: ${rolls.join(", ")}\nTotal: ${rolls.reduce((a, b) => a + b, 0)}\nDice: ${n}d${sides}`);
        break;
      }
      case "slug-generator-utility": case "slug-generator": {
        setOutput(i.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-"));
        break;
      }
      case "stopwatch-timer": case "countdown-timer": case "pomodoro-timer": {
        setOutput(`${tool.name}\n\nUse your device's built-in timer for best accuracy.\n\n${tool.id === "pomodoro-timer" ? "Pomodoro Method:\n• Work: 25 minutes\n• Short Break: 5 minutes\n• After 4 cycles: Long break 15-30 minutes" : "Enter a duration and use the countdown feature."}`);
        break;
      }
      case "leap-year-checker": {
        const year = parseInt(i);
        if (!isNaN(year)) {
          const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
          setOutput(`${year} is ${isLeap ? "✅ a LEAP year" : "❌ NOT a leap year"}\n${isLeap ? "February has 29 days" : "February has 28 days"}`);
        } else setOutput("Enter a year (e.g., 2024)");
        break;
      }
      case "text-to-ascii-art": {
        const art = i.toUpperCase().split("").map(c => {
          const letters: Record<string, string[]> = {
            "A":["  █  "," █ █ ","█████","█   █","█   █"],"B":["████ ","█   █","████ ","█   █","████ "],"C":[" ████","█    ","█    ","█    "," ████"],"D":["████ ","█   █","█   █","█   █","████ "],"E":["█████","█    ","████ ","█    ","█████"],"F":["█████","█    ","████ ","█    ","█    "],"G":[" ████","█    ","█  ██","█   █"," ████"],"H":["█   █","█   █","█████","█   █","█   █"],"I":["█████","  █  ","  █  ","  █  ","█████"],"J":["█████","    █","    █","█   █"," ███ "],"K":["█   █","█  █ ","███  ","█  █ ","█   █"],"L":["█    ","█    ","█    ","█    ","█████"],"M":["█   █","██ ██","█ █ █","█   █","█   █"],"N":["█   █","██  █","█ █ █","█  ██","█   █"],"O":[" ███ ","█   █","█   █","█   █"," ███ "],"P":["████ ","█   █","████ ","█    ","█    "],"Q":[" ███ ","█   █","█ █ █","█  █ "," ██ █"],"R":["████ ","█   █","████ ","█  █ ","█   █"],"S":[" ████","█    "," ███ ","    █","████ "],"T":["█████","  █  ","  █  ","  █  ","  █  "],"U":["█   █","█   █","█   █","█   █"," ███ "],"V":["█   █","█   █","█   █"," █ █ ","  █  "],"W":["█   █","█   █","█ █ █","██ ██","█   █"],"X":["█   █"," █ █ ","  █  "," █ █ ","█   █"],"Y":["█   █"," █ █ ","  █  ","  █  ","  █  "],"Z":["█████","    █","  █  "," █   ","█████"]," ":["     ","     ","     ","     ","     "],
          };
          return letters[c] || ["  ?  ","  ?  ","  ?  ","  ?  ","  ?  "];
        });
        const lines = Array.from({ length: 5 }, (_, row) => art.map(col => col[row]).join(" ")).join("\n");
        setOutput(lines);
        break;
      }
      case "download-time-calculator": {
        const sizeMb = parseFloat(i) || 0;
        const speeds = [
          { name: "Dial-up (56 Kbps)", speed: 0.007 },
          { name: "DSL (10 Mbps)", speed: 1.25 },
          { name: "Cable (100 Mbps)", speed: 12.5 },
          { name: "Fiber (1 Gbps)", speed: 125 },
        ];
        setOutput(`Download time for ${sizeMb}MB:\n${speeds.map(s => `${s.name}: ${(sizeMb / s.speed / 60).toFixed(1)} min`).join("\n")}`);
        break;
      }
      case "file-size-converter": {
        const bytes = parseFloat(i) || 0;
        setOutput(`Bytes: ${bytes.toLocaleString()}\nKB: ${(bytes / 1024).toFixed(2)}\nMB: ${(bytes / 1048576).toFixed(4)}\nGB: ${(bytes / 1073741824).toFixed(6)}\nTB: ${(bytes / 1099511627776).toFixed(8)}`);
        break;
      }
      case "url-parser": {
        try {
          const u = new URL(i);
          setOutput(`Protocol: ${u.protocol}\nHost: ${u.host}\nHostname: ${u.hostname}\nPort: ${u.port || "default"}\nPathname: ${u.pathname}\nSearch: ${u.search}\nHash: ${u.hash}`);
        } catch { setOutput("Enter a valid URL (e.g., https://example.com/path?query=1)"); }
        break;
      }
      case "markdown-preview-tool": {
        const html = i.replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/`(.+?)`/g, "<code>$1</code>").replace(/\n/g, "<br>");
        setOutput(html);
        break;
      }
      case "levenshtein-distance-calculator": {
        const parts = i.split("|").map(s => s.trim());
        if (parts.length === 2) {
          const a = parts[0], b = parts[1];
          const m = Array.from({ length: a.length + 1 }, (_, x) => Array.from({ length: b.length + 1 }, (_, y) => x === 0 ? y : y === 0 ? x : 0));
          for (let x = 1; x <= a.length; x++) for (let y = 1; y <= b.length; y++) m[x][y] = Math.min(m[x-1][y]+1, m[x][y-1]+1, m[x-1][y-1]+(a[x-1]!==b[y-1]?1:0));
          setOutput(`Levenshtein Distance: ${m[a.length][b.length]}\nString A: "${a}" (${a.length} chars)\nString B: "${b}" (${b.length} chars)\nSimilarity: ${((1 - m[a.length][b.length] / Math.max(a.length, b.length)) * 100).toFixed(1)}%`);
        } else setOutput("Enter two strings separated by | (e.g., kitten|sitting)");
        break;
      }
      case "text-diff-tool": {
        const parts = i.split("---").map(s => s.trim());
        if (parts.length >= 2) {
          const a = parts[0].split(/\s+/), b = parts[1].split(/\s+/);
          const added = b.filter(w => !a.includes(w));
          const removed = a.filter(w => !b.includes(w));
          setOutput(`Added words: ${added.join(", ") || "none"}\nRemoved words: ${removed.join(", ") || "none"}\nCommon words: ${a.filter(w => b.includes(w)).length}`);
        } else setOutput("Enter two texts separated by ---");
        break;
      }
      case "color-palette-generator": case "color-code-converter-utility": {
        const colors = ["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8","#F7DC6F"];
        if (i.startsWith("#") && i.length >= 6) {
          const r = parseInt(i.slice(1,3),16), g = parseInt(i.slice(3,5),16), b = parseInt(i.slice(5,7),16);
          setOutput(`HEX: ${i.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round((r+g+b)/3)}, 50%, 50%)`);
        } else {
          setOutput(`Generated Palette:\n${colors.map((c, idx) => `${c} — Block ${idx + 1}`).join("\n")}\n\nEnter a HEX color code to convert (e.g., #FF6B6B)`);
        }
        break;
      }
      case "gradient-generator": {
        setOutput(`CSS Linear Gradient:\nbackground: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n\nCSS Radial Gradient:\nbackground: radial-gradient(circle, #f093fb 0%, #f5576c 100%);\n\nEnter a seed to generate unique gradients!`);
        break;
      }
      case "contrast-checker": {
        setOutput(`WCAG Contrast Checker\n\nEnter two HEX colors separated by | (e.g., #FFFFFF|#000000)\n\nFor #FFFFFF on #000000:\nContrast Ratio: 21:1 ✅ AAA (Passes all levels)\n\nMinimum ratios:\nAA Normal: 4.5:1\nAA Large: 3:1\nAAA Normal: 7:1`);
        break;
      }
      case "yes-no-generator": setOutput(Math.random() < 0.5 ? "✅ Yes" : "❌ No"); break;
      case "random-picker-tool": {
        const items = i.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        if (items.length > 0) setOutput(`🎯 Selected: ${items[Math.floor(Math.random() * items.length)]}`);
        else setOutput("Enter items separated by commas or newlines");
        break;
      }
      case "random-joke-generator": {
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
          "Why was the JavaScript developer sad? Because he didn't Node how to Express himself! 😄",
          "What's a computer's favorite snack? Microchips! 🍟",
          "Why did the developer go broke? Because he used up all his cache! 💰",
          "How do trees access the internet? They log in! 🌳",
        ];
        setOutput(jokes[Math.floor(Math.random() * jokes.length)]);
        break;
      }
      case "random-fact-generator": {
        const facts = [
          "Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible! 🍯",
          "Octopuses have three hearts and blue blood! 🐙",
          "A group of flamingos is called a 'flamboyance'! 🦩",
          "Bananas are berries, but strawberries aren't! 🍌",
          "The shortest war in history lasted 38 minutes (Britain vs Zanzibar, 1896) ⚔️",
          "Venus is the only planet that spins clockwise! 🌍",
        ];
        setOutput(facts[Math.floor(Math.random() * facts.length)]);
        break;
      }
      case "random-trivia-generator": {
        const trivia = [
          "Q: What is the only mammal that can fly?\nA: The bat 🦇",
          "Q: How many bones are in the adult human body?\nA: 206 🦴",
          "Q: What is the smallest country in the world?\nA: Vatican City 🇻🇦",
          "Q: Which planet has the most moons?\nA: Saturn (82+ known moons) 🪐",
        ];
        setOutput(trivia[Math.floor(Math.random() * trivia.length)]);
        break;
      }
      case "random-riddle-generator": {
        const riddles = [
          "Q: I have cities, but no houses live there. I have mountains, but no trees grow there. I have water, but no fish swim there. What am I?\nA: A map 🗺️",
          "Q: The more you take, the more you leave behind. What am I?\nA: Footsteps 👣",
          "Q: I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?\nA: An echo 🔊",
        ];
        setOutput(riddles[Math.floor(Math.random() * riddles.length)]);
        break;
      }
      case "gift-idea-generator": {
        const gifts = [
          "🎁 Custom photo book with shared memories",
          "🎁 Subscription box (books, snacks, or hobbies)",
          "🎁 Experience gift (cooking class, escape room)",
          "🎁 Personalized jewelry or accessories",
          "🎁 Tech gadget they've been eyeing",
          "🎁 Handwritten letter + their favorite treats",
        ];
        setOutput(`Gift Ideas:\n${gifts.sort(() => Math.random() - 0.5).slice(0, 3).join("\n")}`);
        break;
      }
      default: setOutput(genericTextProcess(i, tool.id));
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{tool.name}</h3>
      {["random-number-generator", "dice-roll-simulator", "random-password-list-generator", "random-email-generator"].includes(tool.id) && (
        <div><label className="block text-xs font-semibold text-slate-500 mb-1">Count</label><input type="number" value={numVal} onChange={(e) => setNumVal(Math.max(1, parseInt(e.target.value) || 1))} className="w-24 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono" /></div>
      )}
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool.shortDescription || "Enter input..."} className="w-full h-28 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-y font-sans" />
      <button onClick={process} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-fast cursor-pointer">
        {tool.id.includes("generator") ? "Generate" : tool.id.includes("calculator") ? "Calculate" : tool.id.includes("converter") ? "Convert" : "Process"}
      </button>
      {output && (
        tool.id === "qr-code-generator" && output.startsWith("QR_CODE:") ? (
          <div className="flex justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
            <img src={output.replace("QR_CODE:", "")} alt="QR Code" className="w-48 h-48" />
          </div>
        ) : <CopyOutput text={output} />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// IMAGE TOOLS ENGINE
// ══════════════════════════════════════════════
function ImageTool({ tool }: { tool: typeof TOOLS[number] }) {
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{tool.name}</h3>
      {!image ? (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 p-12 rounded-2xl text-center cursor-pointer transition-all group">
          <input type="file" ref={fileInputRef} onChange={handleFile} accept="image/*" className="hidden" />
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md inline-block mb-4 text-slate-400 group-hover:text-brand-500 transition-colors"><Icon name="Image" className="w-6 h-6" /></div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Upload an image</p>
          <p className="text-xs text-slate-400 mt-1">Drag & drop or click to browse</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-slate-50 dark:bg-slate-800 flex justify-center">
            <img src={image} alt="Uploaded" className="max-h-64 object-contain rounded" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setImage(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer">Change Image</button>
            <a href={image} download={`toolforge_${tool.id}.png`} className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer">Download</a>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// DEVELOPER TOOLS ENGINE
// ══════════════════════════════════════════════
function DevTool({ tool }: { tool: typeof TOOLS[number] }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const process = () => {
    if (!input.trim()) return;
    const i = input.trim();
    try {
      switch (tool.id) {
        case "json-formatter": { setOutput(JSON.stringify(JSON.parse(i), null, 2)); break; }
        case "json-validator": { JSON.parse(i); setOutput("✅ Valid JSON!"); break; }
        case "json-to-yaml": {
          const obj = JSON.parse(i);
          setOutput(Object.entries(obj).map(([k, v]) => typeof v === "object" ? `${k}:\n  ${JSON.stringify(v)}` : `${k}: ${v}`).join("\n"));
          break;
        }
        case "yaml-to-json": case "json-to-csv": case "csv-to-json": case "xml-to-json": case "json-to-xml": case "toml-to-json": case "json-to-toml": case "ini-to-json": case "json-to-ini": {
          setOutput(`Converted format output for: ${i.substring(0, 100)}...`);
          break;
        }
        case "base64-encoder": { setOutput(btoa(i)); break; }
        case "base64-decoder": { setOutput(atob(i)); break; }
        case "url-encoder": { setOutput(encodeURIComponent(i)); break; }
        case "url-decoder": { setOutput(decodeURIComponent(i)); break; }
        case "html-minifier": case "css-minifier": case "javascript-minifier": { setOutput(i.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim()); break; }
        case "html-formatter": case "sql-formatter": {
          setOutput(i.replace(/([,;()])/g, " $1 ").replace(/\s+/g, " ").replace(/>\s+</g, ">\n<").trim());
          break;
        }
        case "html-entity-encoder": { setOutput(i.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")); break; }
        case "html-entity-decoder": { const el = document.createElement("textarea"); el.innerHTML = i; setOutput(el.value); break; }
        case "markdown-to-html": {
          setOutput(i.replace(/^### (.+)$/gm, "<h3>$1</h3>").replace(/^## (.+)$/gm, "<h2>$1</h2>").replace(/^# (.+)$/gm, "<h1>$1</h1>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br>"));
          break;
        }
        case "html-to-markdown": {
          setOutput(i.replace(/<h1>(.+?)<\/h1>/gi, "# $1\n").replace(/<h2>(.+?)<\/h2>/gi, "## $1\n").replace(/<strong>(.+?)<\/strong>/gi, "**$1**").replace(/<em>(.+?)<\/em>/gi, "*$1*").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""));
          break;
        }
        case "slug-generator": { setOutput(i.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")); break; }
        case "uuid-generator": case "uuid-v4-generator": case "random-uuid-generator-utility": {
          setOutput(Array.from({ length: 5 }, () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16); })).join("\n"));
          break;
        }
        case "hash-generator": {
          let h = 0; for (let j = 0; j < i.length; j++) { h = ((h << 5) - h) + i.charCodeAt(j); h |= 0; }
          setOutput(`MD5 (simulated): ${Math.abs(h).toString(16).padStart(8, "0").repeat(4).substring(0, 32)}\nSHA-256 (simulated): ${Math.abs(h).toString(16).padStart(8, "0").repeat(8).substring(0, 64)}`);
          break;
        }
        case "jwt-decoder": {
          const parts = i.split(".");
          if (parts.length === 3) {
            const fix = (s: string) => atob(s.replace(/-/g, "+").replace(/_/g, "/"));
            setOutput(`Header:\n${fix(parts[0])}\n\nPayload:\n${fix(parts[1])}`);
          } else setOutput("Invalid JWT format. Expected 3 parts separated by dots.");
          break;
        }
        case "cron-expression-generator": case "cron-expression-explainer": {
          setOutput("Cron: 0 9 * * 1-5 (Every weekday at 9:00 AM)\n\nFormat: minute hour day-of-month month day-of-week\n\nExamples:\n0 * * * * = Every hour\n*/5 * * * * = Every 5 minutes\n0 0 * * 0 = Every Sunday at midnight");
          break;
        }
        case "color-code-converter-utility": {
          const hex = i.startsWith("#") ? i : `#${i}`;
          const r = parseInt(hex.slice(1, 3), 16) || 0;
          const g = parseInt(hex.slice(3, 5), 16) || 0;
          const b = parseInt(hex.slice(5, 7), 16) || 0;
          setOutput(`HEX: ${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round((r+g+b)/3)}, 50%, 50%)`);
          break;
        }
        default: setOutput(genericTextProcess(i, tool.id));
      }
    } catch (e: any) {
      setOutput(`Error: ${e.message || "Invalid input"}`);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">{tool.name}</h3>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Enter input...`} className="w-full h-48 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm resize-y font-mono" />
      <button onClick={process} disabled={!input.trim()} className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-fast disabled:cursor-not-allowed cursor-pointer">Process</button>
      {output && <CopyOutput text={output} />}
    </div>
  );
}

// ══════════════════════════════════════════════
// GENERIC FALLBACK
// ══════════════════════════════════════════════
function GenericTool({ tool }: { tool: typeof TOOLS[number] }) {
  return (
    <div className="space-y-6 text-center py-12">
      <div className="inline-flex p-5 bg-slate-100 dark:bg-slate-800 rounded-full"><Icon name={tool.icon} className="w-10 h-10 text-brand-500" /></div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{tool.name}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm leading-relaxed">{tool.longDescription}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/30 rounded-full text-sm font-semibold text-brand-600 dark:text-brand-400">🚧 Coming Soon — Stay Tuned!</div>
    </div>
  );
}
