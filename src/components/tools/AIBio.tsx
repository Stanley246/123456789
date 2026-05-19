import { useState } from "react";
import { UserCheck, Copy, Check, Sparkles } from "lucide-react";

export default function AiBio() {
  const [platform, setPlatform] = useState("twitter");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("witty");
  const [useEmojis, setUseEmojis] = useState(true);
  const [generatedBios, setGeneratedBios] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const tones = [
    { id: "professional", name: "Professional" },
    { id: "creative", name: "Creative / Out-of-box" },
    { id: "casual", name: "Casual / Relatable" },
    { id: "witty", name: "Witty / Snarky" },
  ];

  const handleGenerate = () => {
    if (!keywords.trim()) return;

    const items = keywords
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    
    const word1 = items[0] || "Creator";
    const word2 = items[1] || "Innovator";
    const word3 = items[2] || "Coffee Drinker";

    let em = {
      work: useEmojis ? "💻" : "",
      sparkle: useEmojis ? "✨" : "",
      rocket: useEmojis ? "🚀" : "",
      wave: useEmojis ? "👋" : "",
      heart: useEmojis ? "❤️" : "",
      coffee: useEmojis ? "☕" : "",
      pin: useEmojis ? "📍" : "",
      brain: useEmojis ? "🧠" : "",
    };

    let biosList: string[] = [];

    if (platform === "twitter") {
      // Twitter: Limit ~160 characters
      if (tone === "professional") {
        biosList = [
          `${word1} & ${word2}. Focused on high-impact solutions ${em.rocket} Building the future of my niche. Open to collaborations.`,
          `${word1} | Passionate about ${word2} & ${word3} ${em.work} Constantly learning, teaching, and building in public.`,
          `Doing ${word2} things. Professional ${word1} with a strong focus on efficiency, systems, and growth ${em.brain} Let's connect!`,
          `Helping businesses scale with ${word1} ${em.sparkle} Co-founder & Developer. Sharing insights about ${word2} and tech.`,
        ];
      } else if (tone === "creative") {
        biosList = [
          `Turning caffeine ${em.coffee} into ${word1}. Architect of ${word2}. Lover of ${word3}. Dancing through the digital realm ${em.sparkle}`,
          `Professional dreamer, full-time ${word1} ${em.brain} Crafting elegant ${word2} structures and chasing ${word3} challenges.`,
          `Weaving stories, code, and ideas ${em.sparkle} ${word1} by day, ${word3} explorer by night. Exploring the edges of ${word2}.`,
          `A combination of ${word1} and ${word3} with a touch of ${word2} wizardry ${em.rocket} Always creating, never sleeping.`,
        ];
      } else if (tone === "casual") {
        biosList = [
          `Just your local ${word1} trying to figure out ${word2} ${em.wave} Probably drinking too much coffee and thinking about ${word3}.`,
          `${word1} by trade, ${word3} by choice ${em.heart} Writing thoughts about ${word2} and life. Let's chat!`,
          `Full-time ${word1}, part-time ${word3} enthusiast. Just building cool stuff in ${word2} and enjoying the journey.`,
          `Hey there! I do ${word1} stuff. When I'm not working on ${word2}, you can find me appreciating ${word3} ${em.coffee}`,
        ];
      } else {
        // witty
        biosList = [
          `Slightly over-engineered ${word1} ${em.brain} I build ${word2} so you don't have to. Funded entirely by ${word3}.`,
          `Professional ${word1} and amateur philosopher. I speak fluent ${word2} and sarcasm. ${word3} is my superpower.`,
          `Not your average ${word1}. Specialized in ${word2} and ignoring notifications ${em.sparkle} Powered by ${word3} and sheer willpower.`,
          `I put the 'pro' in procrastinating ${word1} tasks ${em.coffee} Master of ${word2}. Certified ${word3} critic.`,
        ];
      }
    } else if (platform === "instagram") {
      // Instagram: ~150 chars, line breaks
      if (tone === "professional") {
        biosList = [
          `${em.work} ${word1}\n${em.rocket} Helping you master ${word2}\n${em.sparkle} Passionate about ${word3}\n👇 Let's work together!`,
          `${word1} & Entrepreneur\n${em.brain} Scaling solutions in ${word2}\n${em.coffee} Fuelled by caffeine and ideas\n✉️ DM for inquiries`,
          `${word1} Specialist\n${em.sparkle} ${word2} & Innovation\n${em.pin} Based in the digital sphere\n🚀 Join my journey below!`,
          `Founder & ${word1}\n${em.brain} Simplifying ${word2} for creators\n${em.heart} Loving ${word3}\n👇 Check my latest work!`,
        ];
      } else if (tone === "creative") {
        biosList = [
          `${em.sparkle} Dream. Create. Repeat.\n🎨 ${word1} crafting experiences\n${em.brain} Obsessed with ${word2}\n${em.coffee} Powered by ${word3}`,
          `Visual storyteller & ${word1}\n${em.sparkle} Adding magic to ${word2}\n${em.heart} Living for ${word3} moments\n✨ See the world through my lens 👇`,
          `Curating ideas & ${word2}\n${em.work} Professional ${word1}\n${em.brain} High-key obsessed with ${word3}\n🚀 Exploring the extraordinary`,
          `Design. Code. Inspire.\n${em.sparkle} ${word1} exploring the intersection of ${word2} and ${word3}.\n👇 Dive in!`,
        ];
      } else if (tone === "casual") {
        biosList = [
          `${em.wave} Hi, I'm a ${word1}!\n${em.coffee} Loving all things ${word2}\n${em.heart} Just here to share my ${word3} journey\n👇 Say hello!`,
          `Living life one ${word2} at a time.\n${em.work} Full-time ${word1}\n${em.coffee} Part-time ${word3} fan\n✨ Keeping it real`,
          `Just a human doing ${word1} stuff.\n${em.brain} Obsessed with ${word2} hacks\n${em.heart} Love ${word3} & sunsets\n👇 Let's be friends!`,
          `Welcome to my feed! ${em.sparkle}\n${em.work} Doing ${word1} work\n${em.coffee} fueled by ${word3}\n🚀 Sharing ${word2} vibes`,
        ];
      } else {
        // witty
        biosList = [
          `Certified ${word1} ${em.brain}\n${em.rocket} Making ${word2} look easy\n${em.coffee} 99% coffee, 1% sass\n👇 Don't click this link unless you want to.`,
          `I did not wake up like this.\n${em.work} Heavy lifting in ${word2}\n${em.sparkle} Certified ${word1}\n${em.coffee} Sponsored by ${word3}`,
          `Professional overthinker ${em.brain}\n${em.work} Doing ${word1} things\n${em.heart} Obsessed with ${word3}\n🚀 Send help (or coffee)`,
          `Here to talk about ${word2}.\n${em.brain} Specialized in ${word1}\n${em.coffee} Operating on zero sleep & high ${word3} standards`,
        ];
      }
    } else {
      // LinkedIn: Professional, longer, structured
      biosList = [
        `🚀 Dedicated ${word1} & Strategy Leader | Specialized in driving business value through ${word2} and comprehensive systems optimization. Proven record of scaling developer architectures and cultivating cross-functional alignment. Passionate about ${word3} and tech. Let's connect!`,
        `💻 Accomplished ${word1} with 5+ years in the industry. Leading innovation across ${word2} systems, architectural design, and deployment workflows. Actively building and advising teams on high-performance pipelines and ${word3} integration.`,
        `🧠 Strategic ${word1} | Focused on accelerating growth and digital transformation through advanced ${word2} paradigms. Deeply committed to mentoring, continuous integration, and scaling robust ${word3} models that deliver measurable bottom-line value.`,
        `✨ Co-Founder & Principal ${word1} | Leveraging multidisciplinary expertise in ${word2} to build and launch cutting-edge tech solutions. Sharing insights on development trends, user-centric design, and ${word3} strategies. Always seeking new collaborative opportunities.`,
      ];
    }

    // Truncate Twitter/Instagram to fit character counts roughly if needed, but they are pre-designed to fit
    setGeneratedBios(biosList);
  };

  const handleCopy = (bio: string, index: number) => {
    navigator.clipboard.writeText(bio);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleLoadSample = () => {
    setKeywords("Software Engineer, coding, coffee lover");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-brand-500" /> AI Bio Generator
        </h2>
        <button
          onClick={handleLoadSample}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-500 transition-fast cursor-pointer"
        >
          Load Sample Keywords
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Configuration Sidebar */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Bio Settings
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Target Platform
            </label>
            <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
              {[
                { id: "twitter", label: "Twitter / X" },
                { id: "instagram", label: "Instagram" },
                { id: "linkedin", label: "LinkedIn" },
              ].map((plat) => (
                <button
                  key={plat.id}
                  onClick={() => setPlatform(plat.id)}
                  className={`py-1 text-xs font-semibold rounded-md transition-fast cursor-pointer uppercase tracking-tight ${
                    platform === plat.id
                      ? "bg-brand-500 text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {plat.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Your Keywords / Roles
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. Developer, digital nomad, coffee"
              className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Comma separated keywords work best.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Bio Tone Style
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              {tones.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useEmojis}
                onChange={(e) => setUseEmojis(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-brand-500 focus:ring-brand-500/20 accent-brand-500"
              />
              Integrate Emojis
            </label>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!keywords.trim()}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-fast disabled:cursor-not-allowed cursor-pointer"
          >
            Generate Bios
          </button>
        </div>

        {/* Bios Results */}
        <div className="md:col-span-3 space-y-4">
          {generatedBios.length === 0 ? (
            <div className="text-sm text-slate-400 italic p-12 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-center bg-slate-50 dark:bg-slate-800/10 h-full flex flex-col items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-slate-400" />
              Input your tags or job role keywords on the left, then click "Generate Bios" to load 4 stellar copyable profile bios.
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Generated Bio Options
              </h4>

              <div className="space-y-3">
                {generatedBios.map((bio, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl shadow-sm relative group"
                  >
                    <div className="text-sm text-slate-800 dark:text-slate-150 whitespace-pre-wrap font-sans leading-relaxed pr-12 pb-2">
                      {bio}
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700/50 pt-2 mt-2 text-xs">
                      <span className={`font-semibold ${bio.length > 160 && platform === "twitter" ? "text-red-500" : "text-slate-450"}`}>
                        {bio.length} / {platform === "twitter" ? 160 : platform === "instagram" ? 150 : 3000} chars
                      </span>

                      <button
                        onClick={() => handleCopy(bio, index)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-fast flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        {copiedIdx === index ? <Check className="w-3.5 h-3.5 text-brand-500" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedIdx === index ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
