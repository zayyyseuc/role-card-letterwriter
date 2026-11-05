import React from 'react';
import { Printer, Sun, Moon, Sparkles, BookOpen, PenTool, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'ghostwriter' | 'diagnostics';
  setActiveTab: (tab: 'editor' | 'ghostwriter' | 'diagnostics') => void;
  onPrint: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenSystemSpecs: () => void;
  onOpenTestRunner: () => void;
  onOpenTemplates?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrint,
  isDark,
  toggleTheme,
  onOpenSystemSpecs,
  onOpenTestRunner,
  onOpenTemplates,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-14">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('editor')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                VerbaForm
              </span>
            </button>
          </div>

          {/* Clean Primary Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold'
                  : 'hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('ghostwriter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'ghostwriter'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold'
                  : 'hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ghostwriter Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'diagnostics'
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold'
                  : 'hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostics</span>
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenTemplates && (
              <button
                type="button"
                onClick={onOpenTemplates}
                className="px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                Templates
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSystemSpecs}
              title="Agent Architecture & Specs"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center font-serif text-[10px] font-bold">i</span>
              <span className="hidden sm:inline">Specs</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};


