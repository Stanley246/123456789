import { Tool } from "../types";
import { CheckCircle2, HelpCircle, Info } from "lucide-react";

interface SEOContentProps {
  tool: Tool;
}

export default function SEOContent({ tool }: SEOContentProps) {
  const faqs = [
    {
      q: `Is the ${tool.name} secure and private?`,
      a: `Yes, absolutely. The ${tool.name} at ToolForge operates 100% client-side. Your input data, files, and content are processed directly inside your web browser using secure HTML5 and JavaScript APIs. No information is ever sent, uploaded, or stored on any server, ensuring complete privacy and offline compatibility.`
    },
    {
      q: `How much does it cost to use this online ${tool.name}?`,
      a: `All 1,000+ utilities on ToolForge, including the ${tool.name}, are completely free of charge with no limits, no trial periods, no registrations, and no hidden fees. Use it as many times as you want, forever.`
    },
    {
      q: `Does the ${tool.name} work on mobile devices?`,
      a: `Yes! The ${tool.name} is fully responsive and optimized for mobile phones, tablets, laptops, and desktop screens. It works perfectly on iOS, Android, Windows, macOS, and Linux — delivering a seamless experience on any device or browser.`
    }
  ];

  return (
    <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-10 space-y-8 font-sans">
      {/* Instructions section with SEO-rich heading */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <CheckCircle2 className="w-5.5 h-5.5 text-green-500 shrink-0" />
          How to Use the Free {tool.name} — Step-by-Step Guide
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The {tool.name} is designed to be simple and intuitive. Follow these steps to get the most out of this free online tool:
        </p>
        <ol className="grid sm:grid-cols-2 gap-4">
          {tool.instructions.map((step, idx) => (
            <li
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl flex gap-3.5 items-start"
            >
              <span className="w-6 h-6 rounded-full bg-green-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Detailed explanation section for SEO */}
      <div className="space-y-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/40 p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-5 h-5 text-green-500 shrink-0" />
          About {tool.name} — What It Does and Why You Need It
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {tool.longDescription}
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          The {tool.name} is one of over 1,000 free utilities available on ToolForge. It is designed to be fast, intuitive, and completely private — all processing happens in your browser, meaning your data never leaves your device. This makes it ideal for handling sensitive text, code, images, and documents safely.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ToolForge provides instant, lightweight browser solutions to daily productivity tasks. By running operations locally, we maximize performance, eliminate server latency, and protect our users' data with zero data collection policies.
        </p>
      </div>

      {/* FAQ Accordion for SEO structured data */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5.5 h-5.5 text-green-500 shrink-0" />
          Frequently Asked Questions About {tool.name}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Here are answers to the most common questions users ask about the {tool.name}.
        </p>
        <div className="divide-y divide-slate-200 dark:divide-slate-700/60 border border-slate-200 dark:border-slate-700/60 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group p-4 [&_summary::-webkit-details-marker]:hidden"
              open={index === 0}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-slate-800 dark:text-slate-100 font-semibold text-sm sm:text-base select-none hover:text-green-600 dark:hover:text-green-400 transition-colors">
                <span>{faq.q}</span>
                <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-500 dark:text-slate-400 group-open:rotate-180 transition-transform duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Related tools section for SEO internal linking */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Explore More Free Online Tools on ToolForge
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          ToolForge offers over 1,000 free utilities across 7 categories: Text Tools, Image Tools, Developer Tools, Creator Tools, AI Tools, Finance Tools, and Utility Tools. All tools are free, private, and run entirely in your browser.
        </p>
      </div>
    </div>
  );
}
