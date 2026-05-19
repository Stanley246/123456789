import { Tool, Category } from "../types";
import Icon from "./Icon";

interface ToolCardProps {
  tool: Tool;
  category: Category;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onClick: () => void;
}

export default function ToolCard({
  tool,
  category,
  isFavorite,
  onToggleFavorite,
  onClick,
}: ToolCardProps) {
  return (
    <article
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/85 p-5 rounded-2xl shadow-xs hover:shadow-lg hover:border-brand-500/50 dark:hover:border-brand-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden text-left"
    >
      {/* Ambient gradient highlight on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="space-y-3.5 relative">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 rounded-xl group-hover:bg-brand-50 dark:group-hover:bg-brand-950/25 group-hover:text-brand-500 transition-all duration-200 shadow-xs">
            <Icon name={tool.icon} className="w-5 h-5" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/30 dark:border-slate-700/30">
            {category.name.split(" ")[0]}
          </span>
        </div>

        {/* Tool Info */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors flex items-center gap-1">
            {tool.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {tool.shortDescription}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 relative">
        <span className="text-xs font-semibold text-brand-500 group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1 select-none">
          Open Tool <Icon name="ArrowRight" className="w-3.5 h-3.5" />
        </span>

        <button
          onClick={(e) => onToggleFavorite(e, tool.id)}
          className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 transition-all duration-150 cursor-pointer"
          title={isFavorite ? "Remove from favorites" : "Save to favorites"}
        >
          <Icon name="Heart" className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>
    </article>
  );
}
