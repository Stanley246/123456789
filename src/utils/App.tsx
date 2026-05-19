import { useState, useEffect } from "react";
import { CATEGORIES, TOOLS } from "./utils/completeToolsData";
import Layout from "./components/Layout";
import ToolCard from "./components/ToolCard";
import ToolWorkspace from "./components/ToolWorkspace";
import SEOContent from "./components/SEOContent";
import Icon from "./components/Icon";

export default function App() {
  // 1. Dark/Light Mode State
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    // Default to dark mode since developer tools look premium and clean in dark format
    return "dark";
  });

  // 2. Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Recents state
  const [recents, setRecents] = useState<string[]>(() => {
    const saved = localStorage.getItem("recents");
    return saved ? JSON.parse(saved) : [];
  });

  // 4. Navigation & Filters
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [homeSearchQuery, setHomeSearchQuery] = useState("");

  // Sync theme with document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Sync recents to localStorage
  useEffect(() => {
    localStorage.setItem("recents", JSON.stringify(recents));
  }, [recents]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCardFavoriteToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the tool when clicking favorite icon
    handleToggleFavorite(id);
  };

  const handleSelectTool = (id: string | null) => {
    setActiveToolId(id);
    setHomeSearchQuery("");
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    if (id) {
      // Add to recents
      setRecents((prev) => {
        const filtered = prev.filter((item) => item !== id);
        return [id, ...filtered].slice(0, 3); // Keep last 3 items
      });
    }
  };

  // Filter tools on homepage
  const getFilteredTools = () => {
    let items = TOOLS;

    if (selectedCategory !== "all") {
      items = items.filter((t) => t.categoryId === selectedCategory);
    }

    if (homeSearchQuery.trim()) {
      items = items.filter(
        (t) =>
          t.name.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(homeSearchQuery.toLowerCase())
      );
    }

    return items;
  };

  const filteredTools = getFilteredTools();
  const activeTool = TOOLS.find((t) => t.id === activeToolId);

  return (
    <Layout
      activeToolId={activeToolId}
      onSelectTool={handleSelectTool}
      favorites={favorites}
      onToggleFavorite={handleToggleFavorite}
      theme={theme}
      onToggleTheme={handleToggleTheme}
    >
      {activeTool ? (
        /* ACTIVE TOOL WORKSPACE PAGE */
        <div className="space-y-4 max-w-5xl mx-auto font-sans">
          {/* Title Header */}
          <div className="space-y-2.5 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="p-2.5 bg-brand-500/10 text-brand-500 rounded-2xl inline-flex shadow-sm">
                <Icon name={activeTool.icon} className="w-7 h-7" />
              </span>
              {activeTool.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              {activeTool.shortDescription}
            </p>
          </div>

          {/* The actual utility workspace */}
          <ToolWorkspace toolId={activeTool.id} />

          {/* SEO content description & guides */}
          <SEOContent tool={activeTool} />
        </div>
      ) : (
        /* HOMEPAGE DASHBOARD VIEW */
        <div className="space-y-10 font-sans">
          
          {/* Hero section */}
          <section className="text-center py-6 sm:py-12 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-brand-50/50 dark:bg-brand-950/10 border border-brand-100 dark:border-brand-900/20 px-3.5 py-1 rounded-full text-xs font-semibold text-brand-600 dark:text-brand-400 shadow-sm">
              <Icon name="Zap" className="w-3.5 h-3.5 fill-current" />
              100% Browser-Local & Privacy-Friendly
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                1,000+ Free Online Tools for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-emerald-400">
                  Developers, Creators & Everyone
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                The largest collection of free, secure, client-side utilities. Format JSON, compress images, generate AI content, calculate finances, convert files, and much more. 100% browser-based, zero uploads, instant results.
              </p>
            </div>

            {/* Instant Search Block */}
            <div className="relative max-w-lg mx-auto">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                <Icon name="Search" className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search among 1,000+ free tools instantly..."
                value={homeSearchQuery}
                onChange={(e) => setHomeSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800/85 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all duration-150 shadow-sm text-sm sm:text-base"
              />
            </div>
          </section>

          {/* Dashboard Sections: Favorites & Recents */}
          {(favorites.length > 0 || recents.length > 0) && (
            <section className="grid md:grid-cols-2 gap-6 border-b border-slate-200 dark:border-slate-800/60 pb-8">
              {/* Favorites */}
              {favorites.length > 0 && (
                <div className="space-y-3 text-left">
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="Heart" className="w-4 h-4 text-red-500 fill-red-500" /> Your Pinned Tools
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {favorites.map((id) => {
                      const tool = TOOLS.find((t) => t.id === id);
                      const cat = tool ? CATEGORIES.find((c) => c.id === tool.categoryId) : null;
                      if (!tool || !cat) return null;

                      return (
                        <div
                          key={id}
                          onClick={() => handleSelectTool(id)}
                          className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500/40 cursor-pointer transition-fast shadow-xs group text-left"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg group-hover:text-brand-500 transition-fast shrink-0">
                              <Icon name={tool.icon} className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-150 truncate">
                                {tool.name}
                              </div>
                              <div className="text-[10px] text-slate-400 uppercase font-bold">
                                {cat.name.split(" ")[0]}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleCardFavoriteToggle(e, id)}
                            className="p-1 text-red-555 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md shrink-0 transition-fast cursor-pointer"
                          >
                            <Icon name="Heart" className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recents */}
              {recents.length > 0 && (
                <div className="space-y-3 text-left">
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Icon name="Clock" className="w-4 h-4 text-brand-500" /> Recently Used Utilities
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {recents.map((id) => {
                      const tool = TOOLS.find((t) => t.id === id);
                      const cat = tool ? CATEGORIES.find((c) => c.id === tool.categoryId) : null;
                      if (!tool || !cat) return null;

                      return (
                        <div
                          key={id}
                          onClick={() => handleSelectTool(id)}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-brand-500/40 cursor-pointer transition-fast shadow-xs group text-left"
                        >
                          <div className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg group-hover:text-brand-500 transition-fast shrink-0">
                            <Icon name={tool.icon} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-150 truncate">
                              {tool.name}
                            </div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">
                              {cat.name.split(" ")[0]}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Categories filter tabs */}
          <section className="space-y-6">
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-slate-800/60 pb-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-fast cursor-pointer select-none uppercase tracking-wider ${
                  selectedCategory === "all"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
                }`}
              >
                All Utilities
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-fast cursor-pointer select-none uppercase tracking-wider flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  <Icon name={cat.icon} className="w-3.5 h-3.5" />
                  {cat.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Grid of toolcards */}
            {filteredTools.length === 0 ? (
              <div className="text-slate-450 text-sm italic p-16 border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl text-center bg-white dark:bg-slate-900/20">
                No utilities matching "{homeSearchQuery}" in this category...
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4.5">
                {filteredTools.map((tool) => {
                  const cat = CATEGORIES.find((c) => c.id === tool.categoryId)!;
                  return (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      category={cat}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={handleCardFavoriteToggle}
                      onClick={() => handleSelectTool(tool.id)}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* High SEO explanation block for Homepage */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 p-6 sm:p-8 rounded-2xl space-y-4 text-left">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Icon name="Zap" className="w-5.5 h-5.5 text-brand-500" /> Why Choose ToolForge? — 1,000+ Free Online Tools
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-350 mt-2">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  ⚡ Instant Zero-Latency Processing
                </h4>
                <p>
                  Unlike traditional online tools that force you to upload files and wait for server queues, ToolForge computes everything instantaneously inside your browser. All 1,000+ utilities run locally with zero network latency. No file limits, no queues, no waiting.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  🔒 100% Private & Secure
                </h4>
                <p>
                  Your data never leaves your device. Passwords, documents, images, and code are processed entirely in-browser using native Web APIs. No uploads, no servers, no tracking. Your files and information are never stored, logged, or shared with any third party.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  🛠️ Complete Free Tool Suite
                </h4>
                <p>
                  Over 1,000 developer utilities, creator tools, text processors, image converters, AI content generators, finance calculators, and everyday tools. Whether you're a software engineer, content creator, marketer, student, or casual user — ToolForge has everything you need, completely free, forever.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
}
