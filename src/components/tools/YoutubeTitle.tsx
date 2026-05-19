import { useState } from "react";
import { Video, Copy, Check, Sparkles, Eye } from "lucide-react";

export default function YoutubeTitle() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("Tech");
  const [tone, setTone] = useState("catchy");
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [previewTitle, setPreviewTitle] = useState("Your Click-Worthy Video Title Appears Here");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const tones = [
    { id: "catchy", name: "Catchy & Engaging" },
    { id: "educational", name: "Educational / How-To" },
    { id: "listicle", name: "List & Number Hooks" },
    { id: "curious", name: "Curiosity & Hype" },
  ];

  const niches = [
    "Tech & Dev",
    "Finance & Wealth",
    "Fitness & Health",
    "Gaming",
    "Lifestyle & Vlogs",
    "Education",
  ];

  const handleGenerate = () => {
    if (!topic.trim()) return;

    const cleanTopic = topic.trim();
    const cleanNiche = niche;
    let templates: string[] = [];

    if (tone === "catchy") {
      templates = [
        `Why I Abandoned Everything for ${cleanTopic}`,
        `The Truth About ${cleanTopic} (What They Won't Tell You)`,
        `I Tried ${cleanTopic} for 30 Days. Here's What Happened!`,
        `This Simple ${cleanTopic} Hack Changed My Life`,
        `Stop Using ${cleanTopic} the Hard Way!`,
        `Is ${cleanTopic} Actually Worth the Hype?`,
        `How I Mastered ${cleanTopic} with Zero Experience`,
        `The Secret to Mastering ${cleanTopic} Faster`,
      ];
    } else if (tone === "educational") {
      templates = [
        `How to Master ${cleanTopic} in 2026 (Complete Guide)`,
        `Ultimate ${cleanTopic} Tutorial for Beginners`,
        `${cleanTopic} Explained in 5 Minutes (Step-by-Step)`,
        `The Ultimate Roadmap to Learning ${cleanTopic}`,
        `Stop Making These 5 Common ${cleanTopic} Mistakes`,
        `What is ${cleanTopic}? A Practical Introduction`,
        `Everything You Need to Know About ${cleanTopic}`,
        `${cleanTopic} Best Practices Every Developer Should Follow`,
      ];
    } else if (tone === "listicle") {
      templates = [
        `10 Essential ${cleanTopic} Tips You Aren't Using`,
        `5 Shocking Facts About ${cleanTopic}!`,
        `7 Simple Tools to Supercharge Your ${cleanTopic}`,
        `3 Reasons Your ${cleanTopic} is Failing (And How to Fix It)`,
        `Top 5 ${cleanTopic} Trends Dominating this Year`,
        `8 Things I Wish I Knew Before Starting ${cleanTopic}`,
        `10 Minutes of ${cleanTopic} that Will Save You Hours`,
        `6 Rules for Masterful ${cleanTopic} Execution`,
      ];
    } else {
      // curious / hype
      templates = [
        `Is ${cleanTopic} the Ultimate Game-Changer?`,
        `Why Everyone is Suddenly Talking About ${cleanTopic}`,
        `The Dark Side of ${cleanTopic} No One Talks About`,
        `Before You Start ${cleanTopic}, Watch THIS!`,
        `Could This Be the Future of ${cleanNiche}? (Featuring ${cleanTopic})`,
        `This ${cleanTopic} Strategy Feels Illegal to Know`,
        `I Replaced My Whole Workflow with ${cleanTopic}...`,
        `Is This the End of ${cleanNiche}? (${cleanTopic} Review)`,
      ];
    }

    setGeneratedTitles(templates);
    setPreviewTitle(templates[0]);
  };

  const handleCopy = (title: string, index: number) => {
    navigator.clipboard.writeText(title);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Video className="w-5 h-5 text-brand-500" /> YouTube Title Generator
      </h2>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Inputs Form */}
        <div className="md:col-span-2 space-y-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
            Configuration Options
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Video Niche or Category
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              {niches.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Core Keyword or Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., React Hooks, Bitcoin, Gym Workout"
              className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Title Tone Style
            </label>
            <div className="grid grid-cols-1 gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-2 text-left text-xs font-medium rounded-lg border transition-fast flex items-center justify-between cursor-pointer ${
                    tone === t.id
                      ? "bg-brand-50/50 dark:bg-brand-950/20 border-brand-500 text-brand-600 dark:text-brand-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-55"
                  }`}
                >
                  <span>{t.name}</span>
                  {tone === t.id && <Sparkles className="w-3.5 h-3.5 text-brand-500" />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-fast disabled:cursor-not-allowed cursor-pointer"
          >
            Generate Titles
          </button>
        </div>

        {/* Generated Output and Live Mockup Preview */}
        <div className="md:col-span-3 space-y-6">
          {/* YouTube Mockup Visualizer */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" /> YouTube Feed Preview
            </h4>
            
            {/* Video Card Mock */}
            <div className="max-w-sm mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 relative font-mono text-xs">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-slate-900/30" />
                <span className="relative font-semibold tracking-wide flex items-center gap-2 bg-slate-900/80 text-white px-3 py-1.5 rounded-lg shadow-md">
                  <Video className="w-4 h-4 text-brand-500" /> {niche}
                </span>
                <span className="absolute bottom-2 right-2 bg-slate-950 text-white text-[10px] font-semibold px-1 rounded">
                  10:42
                </span>
              </div>
              <div className="p-3 flex gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                  TF
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight">
                    {previewTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ToolForge Channel</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">128K views • 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Generated List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Suggested Titles
            </h4>
            {generatedTitles.length === 0 ? (
              <div className="text-sm text-slate-400 italic p-8 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-center bg-slate-50 dark:bg-slate-800/10">
                Configure the topic on the left and click "Generate Titles" to load suggestions.
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {generatedTitles.map((title, index) => (
                  <div
                    key={index}
                    onClick={() => setPreviewTitle(title)}
                    className={`p-3 rounded-xl border text-sm font-semibold text-slate-800 dark:text-slate-200 transition-fast cursor-pointer flex items-center justify-between gap-3 group ${
                      previewTitle === title
                        ? "bg-brand-50/30 dark:bg-brand-950/10 border-brand-500/60"
                        : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <span className="line-clamp-2">{title}</span>
                    <div className="flex gap-1.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(title, index);
                        }}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-fast shadow-sm"
                        title="Copy Title"
                      >
                        {copiedIdx === index ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
