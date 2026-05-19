import { useState, useEffect, useRef, ReactNode } from "react";
import { CATEGORIES, TOOLS } from "../utils/completeToolsData";
import Icon from "./Icon";

interface LayoutProps {
  activeToolId: string | null;
  onSelectTool: (id: string | null) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  children: ReactNode;
}

export default function Layout({
  activeToolId,
  onSelectTool,
  favorites,
  onToggleFavorite,
  theme,
  onToggleTheme,
  children,
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<number | null>(null);

  // Handle clicking outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter tools based on search query
  const filteredTools = searchQuery.trim()
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          CATEGORIES.find((c) => c.id === t.categoryId)?.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : [];

  const handleDropdownEnter = (categoryId: string) => {
    if (dropdownTimeoutRef.current) {
      window.clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(categoryId);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small buffer time for smoother navigation
  };

  const activeTool = TOOLS.find((t) => t.id === activeToolId);
  const activeCategory = activeTool ? CATEGORIES.find((c) => c.id === activeTool.categoryId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 grid-bg-light dark:grid-bg-dark">
      {/* Global Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-900/85 backdrop-blur border-b border-slate-200 dark:border-slate-800/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Brand Logo */}
            <div
              onClick={() => {
                onSelectTool(null);
                setSearchQuery("");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer shrink-0 select-none group"
            >
              <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-fast">
                <Icon name="Zap" className="w-5 h-5 fill-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Tool<span className="text-brand-500">Forge</span>
              </span>
            </div>

            {/* Categories Dropdown Menu Desktop */}
            <nav className="hidden lg:flex items-center gap-1 font-sans">
              {CATEGORIES.map((cat) => {
                const catTools = TOOLS.filter((t) => t.categoryId === cat.id);
                const isOpen = activeDropdown === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(cat.id)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 transition-fast cursor-pointer select-none ${
                        activeTool?.categoryId === cat.id
                          ? "text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/10"
                          : "text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {cat.name}
                      <Icon name="ChevronDown" className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Content */}
                    {isOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl p-3.5 grid gap-1.5 animate-fade-in">
                        <div className="px-2.5 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/50">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {cat.description}
                          </span>
                        </div>
                        <div className="grid gap-1 max-h-96 overflow-y-auto">
                          {catTools.map((tool) => (
                            <div
                              key={tool.id}
                              onClick={() => {
                                onSelectTool(tool.id);
                                setActiveDropdown(null);
                              }}
                              className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-fast cursor-pointer text-left"
                            >
                              <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg group-hover:bg-brand-50/10 shrink-0">
                                <Icon name={tool.icon} className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-150">
                                  {tool.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-tight">
                                  {tool.shortDescription}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Search, Favorites, Theme, Mobile Menu Hamburger */}
            <div className="flex items-center gap-2.5 flex-1 lg:flex-initial justify-end">
              
              {/* Live Search Bar */}
              <div ref={searchRef} className="relative w-full max-w-xs hidden md:block">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Icon name="Search" className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search 1,000+ free online tools..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchFocused(true);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    className="w-full bg-slate-100 dark:bg-slate-800/85 border border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 text-sm text-slate-800 dark:text-slate-100 rounded-xl pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-fast font-sans"
                  />
                </div>

                {/* Search results popover */}
                {searchFocused && searchQuery.trim() && (
                  <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-2.5 z-50 animate-fade-in max-h-[400px] overflow-y-auto">
                    {filteredTools.length === 0 ? (
                      <div className="text-xs text-slate-500 dark:text-slate-400 italic py-6 text-center">
                        No tools match "{searchQuery}"
                      </div>
                    ) : (
                      <div className="grid gap-1">
                        <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Matching Utilities ({filteredTools.length})
                        </div>
                        {filteredTools.map((tool) => (
                          <div
                            key={tool.id}
                            onClick={() => {
                              onSelectTool(tool.id);
                              setSearchQuery("");
                              setSearchFocused(false);
                            }}
                            className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-fast cursor-pointer text-left"
                          >
                            <div className="p-1.5 bg-slate-105 dark:bg-slate-800 text-slate-555 dark:text-slate-350 rounded-lg shrink-0 mt-0.5">
                              <Icon name={tool.icon} className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-800 dark:text-slate-150">
                                {tool.name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                                {tool.shortDescription}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Favorites list trigger / status */}
              {favorites.length > 0 && (
                <button
                  onClick={() => onSelectTool(null)} // Reset to homepage to view Favorites instantly
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-fast text-red-500 relative cursor-pointer"
                  title="View favorited tools"
                >
                  <Icon name="Heart" className="w-5 h-5 fill-red-500" />
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm border border-white dark:border-slate-900">
                    {favorites.length}
                  </span>
                </button>
              )}

              {/* Theme Toggle Button */}
              <button
                onClick={onToggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-fast cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Icon name="Moon" className="w-5 h-5" /> : <Icon name="Sun" className="w-5 h-5 text-amber-400 fill-amber-400" />}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-fast cursor-pointer"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? <Icon name="X" className="w-6 h-6" /> : <Icon name="Menu" className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Only shown on mobile) */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Icon name="Search" className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              className="w-full bg-slate-100 dark:bg-slate-800/85 border border-slate-200 dark:border-slate-700/60 hover:border-slate-350 text-sm text-slate-800 dark:text-slate-100 rounded-xl pl-9 pr-4 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-fast font-sans"
            />
          </div>

          {/* Mobile Search Popover */}
          {searchFocused && searchQuery.trim() && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-2.5 z-50 max-h-80 overflow-y-auto">
              {filteredTools.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-slate-400 italic py-4 text-center">
                  No matching tools.
                </div>
              ) : (
                <div className="grid gap-1">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        onSelectTool(tool.id);
                        setSearchQuery("");
                        setSearchFocused(false);
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-fast cursor-pointer"
                    >
                      <Icon name={tool.icon} className="w-4 h-4 text-slate-400" />
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-150">
                        {tool.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[112px] z-40 bg-slate-50 dark:bg-slate-950 overflow-y-auto p-4 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
          <div className="space-y-6 pb-12">
            {CATEGORIES.map((cat) => {
              const catTools = TOOLS.filter((t) => t.categoryId === cat.id);
              return (
                <div key={cat.id} className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                    {cat.name}
                  </h3>
                  <div className="grid grid-cols-1 gap-1.5">
                    {catTools.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => {
                          onSelectTool(tool.id);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/70 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 transition-fast cursor-pointer shadow-sm"
                      >
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                          <Icon name={tool.icon} className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-150">
                          {tool.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Breadcrumb (Only when a tool is active) */}
      {activeTool && activeCategory && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 px-4 py-2.5 rounded-xl shadow-xs">
            <span
              onClick={() => onSelectTool(null)}
              className="hover:text-brand-500 cursor-pointer transition-fast"
            >
              Home
            </span>
            <span className="text-slate-300 dark:text-slate-700 select-none">/</span>
            <button
              onClick={() => {
                onSelectTool(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-slate-500 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 cursor-pointer transition-fast font-medium"
            >
              {activeCategory.name}
            </button>
            <span className="text-slate-300 dark:text-slate-700 select-none">/</span>
            <span className="text-slate-800 dark:text-slate-100 font-bold flex items-center gap-1.5">
              <Icon name={activeTool.icon} className="w-3.5 h-3.5 text-brand-500" />
              {activeTool.name}
            </span>

            {/* Favorite toggle inside breadcrumb for super clean UI */}
            <button
              onClick={() => onToggleFavorite(activeTool.id)}
              className="ml-auto p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer transition-fast flex items-center gap-1"
              title={favorites.includes(activeTool.id) ? "Remove from Pinned" : "Pin to Favorites"}
            >
              <Icon
                name="Heart"
                className={`w-4 h-4 ${favorites.includes(activeTool.id) ? "fill-red-500 text-red-500" : ""}`}
              />
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider">
                {favorites.includes(activeTool.id) ? "Pinned" : "Pin Tool"}
              </span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Section */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Global Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800/85 mt-auto py-10 text-sm font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Col 1: Logo & Trust */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                  <Icon name="Zap" className="w-4 h-4 fill-white" />
                </div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  ToolForge
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                1,000+ free, privacy-first online tools for developers, creators, and everyday users. 100% browser-based, zero uploads, instant results.
              </p>
              <div className="text-xs text-brand-500 font-bold flex items-center gap-1">
                <Icon name="Check" className="w-3.5 h-3.5" /> 100% Safe & Browser-Local
              </div>
            </div>

            {/* Col 2: Categories Links */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Tool Categories
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350 font-medium">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        onSelectTool(null);
                        setSearchQuery("");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="hover:text-brand-550 dark:hover:text-brand-400 transition-fast cursor-pointer"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Featured utilities */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Most Pinned Tools
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-350 font-medium">
                <li>
                  <button
                    onClick={() => onSelectTool("image-compressor")}
                    className="hover:text-brand-550 dark:hover:text-brand-400 transition-fast cursor-pointer"
                  >
                    Image Compressor
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool("password-generator")}
                    className="hover:text-brand-550 dark:hover:text-brand-400 transition-fast cursor-pointer"
                  >
                    Secure Password Generator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool("json-formatter")}
                    className="hover:text-brand-550 dark:hover:text-brand-400 transition-fast cursor-pointer"
                  >
                    JSON Formatter & Validator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onSelectTool("ai-prompt")}
                    className="hover:text-brand-550 dark:hover:text-brand-400 transition-fast cursor-pointer"
                  >
                    AI Prompt Optimizer
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Privacy Seal */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/45 p-4 rounded-xl space-y-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                🔒 1,000+ Tools, Zero Server Uploads
              </div>
              <p>
                Unlike other platforms, ToolForge processes all 1,000+ utilities directly inside your browser. Images, code, passwords, and documents never touch our servers. Complete privacy, zero data footprint.
              </p>
            </div>
          </div>

          <div className="h-[1px] bg-slate-200/60 dark:bg-slate-800/50 my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-450">
            <p>© 2026 ToolForge. 1,000+ Free Online Tools. All rights reserved. Privacy-friendly, browser-based utilities.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Terms</a>
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</a>
              <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
