import { useState } from "react";
import { Cpu, Copy, Check, Sparkles } from "lucide-react";

export default function AiPrompt() {
  const [rawPrompt, setRawPrompt] = useState("");
  const [aiModel, setAiModel] = useState("gpt4o");
  const [tone, setTone] = useState("professional");
  const [outputLength, setOutputLength] = useState("medium");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOptimize = () => {
    if (!rawPrompt.trim()) return;

    const cleanPrompt = rawPrompt.trim();
    
    let role = "Expert AI Assistant";
    let extraInstructions = "";

    if (tone === "professional") {
      role = "Elite Industry Subject-Matter Consultant";
      extraInstructions = "- Adopt a highly professional, authoritative, and analytical tone.\n- Base explanations on sound industry methodologies and empirical logic.";
    } else if (tone === "technical") {
      role = "Senior Software Engineer & Solutions Architect";
      extraInstructions = "- Prioritize detailed, technically precise explanations, system metrics, and edge-case analysis.\n- Use exact vocabulary and support statements with solid code structure or architectural patterns.";
    } else if (tone === "creative") {
      role = "Distinguished Master Creative Writer & Storyteller";
      extraInstructions = "- Harness rich metaphors, vivid prose, emotional hooks, and engaging storytelling conventions.\n- Avoid boring templates and generic descriptions.";
    } else {
      role = "Friendly, Conversational, & Empathetic Peer";
      extraInstructions = "- Speak in a warm, relatable, and down-to-earth tone.\n- Simplify advanced terms into clear, everyday metaphors.";
    }

    let modelFocus = "";
    if (aiModel === "claude") {
      modelFocus = "- Optimization Focus: Claude 3.5 XML structured reasoning, dry-run constraints check, and direct output formatting without conversational prefix fluff.";
    } else if (aiModel === "gpt4o") {
      modelFocus = "- Optimization Focus: GPT-4o structured chain-of-thought logic, precise instruction-following accuracy, and bulletproof Markdown layouts.";
    } else if (aiModel === "midjourney") {
      modelFocus = "- Optimization Focus: Photographic lens specs, aspect ratios (--ar 16:9), realistic lighting terms (volumetric, cinematic, golden hour), rendering engine tags (unreal engine 5, octane render), and descriptive noun-stack styling.";
    }

    let lengthGuide = "";
    if (outputLength === "short") {
      lengthGuide = "- Keep the final response highly concise, bullet-pointed, and under 250 words.";
    } else if (outputLength === "medium") {
      lengthGuide = "- Aim for a medium-length, well-balanced response with 2-3 main sections and illustrative examples.";
    } else {
      lengthGuide = "- Provide a comprehensive, deeply detailed deep-dive with exhaustive subheadings, FAQ sections, and step-by-step instruction details.";
    }

    const result = `# SYSTEM INSTRUCTIONS & PERSONA
[ROLE]: Act as an ${role}. You are an absolute authority in this discipline.
[TASK CONTEXT]: The user needs high-performance help resolving the following core prompt: "${cleanPrompt}"

# CONSTRAINTS & BEHAVIORAL RULES
${extraInstructions}
${lengthGuide}
- Strict Quality Control: Under no circumstances make up false facts (hallucinations). If an answer is unknown, explicitly state that you lack the training data.
- Engagement: Start your response directly with the answer or main body of text. Do not write conversational introductions like "Certainly! I can help you with that..." or "Here is the output...".

# PLATFORM-SPECIFIC OPTIMIZATION
${modelFocus || "- Standard prompt formatting optimized for modern Large Language Models."}

# REQUESTED RESPONSE FORMAT
Please format your answer using clean, semantic Markdown:
- Use clear headings (###) for sub-sections.
- Use bold labels to highlight critical parameters.
- Present complex data or comparisons in clean Markdown tables.
- Enclose code or commands in code blocks (\`\`\`) with syntax highlighting where applicable.

[EXECUTION]: Proceed with resolving the user's task using the rules above:`;

    setOptimizedPrompt(result);
  };

  const handleCopy = () => {
    if (!optimizedPrompt) return;
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setRawPrompt("Explain how to build a custom React hook for tracking localStorage changes.");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-500" /> AI Prompt Optimizer
        </h2>
        <button
          onClick={handleLoadSample}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-500 transition-fast cursor-pointer"
        >
          Load Sample Task
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left Controls */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Prompt Parameters
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              AI Model Targeting
            </label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              <option value="gpt4o">GPT-4o (OpenAI)</option>
              <option value="claude">Claude 3.5 Sonnet (Anthropic)</option>
              <option value="midjourney">Midjourney (Art/Images)</option>
              <option value="general">General LLM (Llama/Gemini)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Expert Tone Style
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              <option value="professional">Professional Consultant</option>
              <option value="technical">Technical Architect</option>
              <option value="creative">Creative / Artistic</option>
              <option value="conversational">Casual / Empathic Friend</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Output Complexity
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
              {["short", "medium", "long"].map((len) => (
                <button
                  key={len}
                  onClick={() => setOutputLength(len)}
                  className={`py-1 text-xs font-semibold rounded-md transition-fast cursor-pointer uppercase tracking-wider ${
                    outputLength === len
                      ? "bg-brand-500 text-white"
                      : "text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Your Basic Prompt
            </label>
            <textarea
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              placeholder="Enter your simple prompt here (e.g. How does photosynthesis work, Write a marketing email for shoes...)"
              className="w-full h-28 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
            />
          </div>

          <button
            onClick={handleOptimize}
            disabled={!rawPrompt.trim()}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-fast disabled:cursor-not-allowed cursor-pointer"
          >
            Optimize Prompt
          </button>
        </div>

        {/* Right Output Workspace */}
        <div className="md:col-span-3 space-y-4">
          {!optimizedPrompt ? (
            <div className="text-sm text-slate-400 italic p-12 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-center bg-slate-50 dark:bg-slate-800/10 h-full flex flex-col items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-slate-400" />
              Configure your inputs and hit "Optimize" to generate your perfect system prompt layout.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Structured System Prompt
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg transition-fast flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied Prompt!" : "Copy Prompt"}
                </button>
              </div>

              <div className="relative group">
                <textarea
                  value={optimizedPrompt}
                  readOnly
                  className="w-full h-120 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 font-mono text-xs focus:outline-none leading-relaxed resize-none select-all"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
