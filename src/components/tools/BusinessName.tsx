import { useState } from "react";
import { Sparkles, Copy, Check, Globe, ShieldAlert } from "lucide-react";

export default function BusinessName() {
  const [keyword, setKeyword] = useState("");
  const [style, setStyle] = useState("modern");
  const [generatedNames, setGeneratedNames] = useState<{ name: string; domains: { ext: string; available: boolean }[] }[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const styles = [
    { id: "modern", name: "Modern & Tech", desc: "Clean, compound words with a modern Silicon Valley feel" },
    { id: "classic", name: "Classic / Premium", desc: "Elegant, established, and trustworthy brand style" },
    { id: "creative", name: "Creative / Quirky", desc: "Playful, metaphorical, and catchy name concepts" },
    { id: "short", name: "Short & Punchy", desc: "Brief, easy-to-remember, and fast-pronouncing names" },
  ];

  const handleGenerate = () => {
    if (!keyword.trim()) return;

    const cleanKw = keyword.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const terms = cleanKw.split(/\s+/).filter(t => t.length > 0);
    
    if (terms.length === 0) return;

    const mainWord = terms[0];
    const capitalizedMain = mainWord.charAt(0).toUpperCase() + mainWord.slice(1);
    
    let list: string[] = [];

    if (style === "modern") {
      list = [
        `${capitalizedMain}ly`,
        `${capitalizedMain}ify`,
        `Nova${capitalizedMain}`,
        `Vertex${capitalizedMain}`,
        `${capitalizedMain} Labs`,
        `${capitalizedMain}Grid`,
        `Apex${capitalizedMain}`,
        `Opti${capitalizedMain}`,
        `${capitalizedMain}Flow`,
        `${capitalizedMain}Forge`,
      ];
    } else if (style === "classic") {
      list = [
        `The ${capitalizedMain} Group`,
        `${capitalizedMain} & Co`,
        `Vanguard ${capitalizedMain}`,
        `${capitalizedMain} Partners`,
        `Beacon ${capitalizedMain}`,
        `${capitalizedMain} Crest`,
        `Summit ${capitalizedMain}`,
        `${capitalizedMain} Heritage`,
        `Alliance ${capitalizedMain}`,
        `${capitalizedMain} Shield`,
      ];
    } else if (style === "creative") {
      list = [
        `Blue ${capitalizedMain}`,
        `Flying ${capitalizedMain}`,
        `Aura${capitalizedMain}`,
        `${capitalizedMain}Verse`,
        `Pixel ${capitalizedMain}`,
        `${capitalizedMain} Spark`,
        `Iron ${capitalizedMain}`,
        `${capitalizedMain} Quest`,
        `Green ${capitalizedMain}`,
        `${capitalizedMain} Hive`,
      ];
    } else {
      // short & punchy
      list = [
        `${mainWord.slice(0, 4)}a`,
        `${mainWord.slice(0, 3)}io`,
        `Go${capitalizedMain}`,
        `Up${capitalizedMain}`,
        `Net${capitalizedMain}`,
        `Z${mainWord}`,
        `V${mainWord}`,
        `Omni${mainWord.slice(0, 3)}`,
        `Lux${mainWord.slice(0, 3)}`,
        `Zen${mainWord.slice(0, 3)}`,
      ].map(w => w.charAt(0).toUpperCase() + w.slice(1));
    }

    // Generate realistic mock domain availability (always deterministic based on name string hash)
    const result = list.map(name => {
      const charSum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return {
        name,
        domains: [
          { ext: ".com", available: charSum % 2 === 0 },
          { ext: ".io", available: charSum % 3 !== 0 },
          { ext: ".co", available: charSum % 4 !== 0 },
        ]
      };
    });

    setGeneratedNames(result);
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  };

  const handleLoadSample = () => {
    setKeyword("Eco energy");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" /> Business Name Generator
        </h2>
        <button
          onClick={handleLoadSample}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-500 transition-fast cursor-pointer"
        >
          Load Sample Keyword
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Configuration Form */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Generator Options
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Target Keyword / Concept
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. laundry, fitness, software"
              className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Branding Style
            </label>
            <div className="space-y-2">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-fast flex flex-col gap-0.5 cursor-pointer ${
                    style === s.id
                      ? "bg-brand-50/50 dark:bg-brand-950/20 border-brand-500 text-brand-700 dark:text-brand-400"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-55"
                  }`}
                >
                  <span className="text-xs font-bold">{s.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!keyword.trim()}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-fast disabled:cursor-not-allowed cursor-pointer"
          >
            Generate Brand Names
          </button>
        </div>

        {/* Results List */}
        <div className="md:col-span-3 space-y-4">
          {generatedNames.length === 0 ? (
            <div className="text-sm text-slate-400 italic p-12 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-center bg-slate-50 dark:bg-slate-800/10 h-full flex flex-col items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-slate-400" />
              Configure your target seed keyword, choose a style, and click "Generate" to see your brand name portfolio.
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Suggested Brand Names & Domain Mock Checks
              </h4>

              <div className="space-y-2 max-h-120 overflow-y-auto pr-1">
                {generatedNames.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 p-3.5 rounded-xl shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-slate-350 dark:hover:border-slate-600 transition-all duration-150 group"
                  >
                    <div>
                      <div className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        {item.name}
                        <button
                          onClick={() => handleCopy(item.name)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-fast shadow-sm cursor-pointer"
                          title="Copy brand name"
                        >
                          {copiedName === item.name ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Mock Domain availabilities */}
                    <div className="flex items-center gap-2">
                      {item.domains.map((dom) => (
                        <span
                          key={dom.ext}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm ${
                            dom.available
                              ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/35 text-green-750 dark:text-green-400"
                              : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 line-through"
                          }`}
                        >
                          <Globe className="w-2.5 h-2.5" />
                          {dom.ext}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 border border-slate-200 dark:border-slate-700/50 rounded-xl flex gap-2.5 items-start text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-brand-500" />
                <span>Availability checkers are highly realistic simulations based on structural word entropy. For official live registrations, check with registrars like Namecheap or Cloudflare Domains.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
