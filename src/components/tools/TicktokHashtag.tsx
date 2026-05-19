import { useState } from "react";
import { Hash, Copy, Check, Flame, Sparkles, Target } from "lucide-react";

export default function TiktokHashtag() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Entertainment");
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [tags, setTags] = useState<{
    viral: string[];
    niche: string[];
    targeted: string[];
  } | null>(null);

  const categories = [
    "Entertainment & Comedy",
    "Tech & Gaming",
    "Food & Cooking",
    "Fitness & Health",
    "Fashion & Beauty",
    "DIY & Crafts",
    "Business & Finance",
    "Travel & Vlogs",
  ];

  const handleGenerate = () => {
    if (!keyword.trim()) return;

    const inputs = keyword
      .toLowerCase()
      .replace(/[#]/g, "")
      .split(",")
      .map((item) => item.trim().replace(/\s+/g, ""))
      .filter((item) => item.length > 0);

    if (inputs.length === 0) return;

    const mainTag = inputs[0];
    const subTags = inputs.slice(1);

    // Formulaic generated tags based on inputs and selected category
    let catKeyword = category.split(" ")[0].toLowerCase().replace("&", "");
    
    const viral = [
      `#fyp`,
      `#foryou`,
      `#trending`,
      `#viral`,
      `#xyzbca`,
      `#tiktok`,
      `#${mainTag}`,
      `#${mainTag}viral`,
    ];

    const niche = [
      `#${mainTag}tok`,
      `#${catKeyword}tok`,
      `#${mainTag}tips`,
      `#learnontiktok`,
      ...subTags.map(tag => `#${tag}`),
      `#${catKeyword}`,
    ].slice(0, 7);

    const targeted = [
      `#${mainTag}trends`,
      `#howtos`,
      `#${mainTag}life`,
      `#${mainTag}hacks`,
      `#${mainTag}challenge`,
      `#${catKeyword}challenge`,
    ].slice(0, 6);

    // Ensure uniqueness
    const uniqueViral = Array.from(new Set(viral));
    const uniqueNiche = Array.from(new Set(niche));
    const uniqueTargeted = Array.from(new Set(targeted));

    setTags({
      viral: uniqueViral,
      niche: uniqueNiche,
      targeted: uniqueTargeted,
    });
    setCopiedAll(false);
  };

  const handleCopySingle = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const handleCopyAll = () => {
    if (!tags) return;
    const allTags = [...tags.viral, ...tags.niche, ...tags.targeted].join(" ");
    navigator.clipboard.writeText(allTags);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Hash className="w-5 h-5 text-brand-500" /> TikTok Hashtag Generator
      </h2>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Configuration Sidebar */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Hashtag Settings
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Core Topic Keywords
            </label>
            <textarea
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. cooking, easy recipes, pasta dinner (comma separated)"
              className="w-full h-24 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-105 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Content Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!keyword.trim()}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-fast disabled:cursor-not-allowed cursor-pointer"
          >
            Generate Hashtags
          </button>
        </div>

        {/* Results Pane */}
        <div className="md:col-span-3 space-y-6">
          {!tags ? (
            <div className="text-sm text-slate-400 italic p-12 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-center bg-slate-50 dark:bg-slate-800/10">
              Input your key terms and hit "Generate" to see viral, niche, and targeted hashtags tailored for TikTok's algorithms.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Global Control */}
              <div className="flex justify-between items-center bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl shadow-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Suggested</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {tags.viral.length + tags.niche.length + tags.targeted.length} Hashtags
                  </div>
                </div>
                <button
                  onClick={handleCopyAll}
                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg shadow-sm transition-fast flex items-center gap-2 cursor-pointer animate-fade-in"
                >
                  {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedAll ? "Copied All!" : "Copy All Tags"}
                </button>
              </div>

              {/* Viral List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Viral Tags (High Reach: 100M+ Views)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.viral.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleCopySingle(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-fast cursor-pointer flex items-center gap-1.5 select-none ${
                        copiedTag === tag
                          ? "bg-brand-500 border-brand-500 text-white"
                          : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {tag}
                      {copiedTag === tag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Niche List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Niche Tags (Medium Reach: 5M-100M Views)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.niche.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleCopySingle(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-fast cursor-pointer flex items-center gap-1.5 select-none ${
                        copiedTag === tag
                          ? "bg-brand-500 border-brand-500 text-white"
                          : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {tag}
                      {copiedTag === tag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Targeted List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Targeted Tags (Highly Specific: &lt; 5M Views)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.targeted.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleCopySingle(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-fast cursor-pointer flex items-center gap-1.5 select-none ${
                        copiedTag === tag
                          ? "bg-brand-500 border-brand-500 text-white"
                          : "bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {tag}
                      {copiedTag === tag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
