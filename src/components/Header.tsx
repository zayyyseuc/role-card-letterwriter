import React from 'react';
import { Printer, Sun, Moon, Sparkles, BookOpen, PenTool, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'ghostwriter' | 'diagnostics' | 'draft' | 'library';
  setActiveTab: (tab: 'editor' | 'ghostwriter' | 'diagnostics' | 'draft' | 'library') => void;
  onPrint: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  onOpenSystemSpecs: () => void;
  onOpenTestRunner: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onPrint,
  isDark,
  toggleTheme,
  onOpenSystemSpecs,
  onOpenTestRunner,
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 h-16">
          {/* Zone 1: Brand wordmark & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('editor')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                VerbaForm
              </span>
            </button>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono hidden sm:inline" aria-hidden="true">
              /
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium hidden lg:inline">
              Humorous Apology &amp; Correspondence Studio
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer ${
                activeTab === 'editor'
                  ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 font-bold'
                  : ''
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Stationery Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('ghostwriter')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer ${
                activeTab === 'ghostwriter'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 font-bold'
                  : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Ghostwriter Agent</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Heeje
              </span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer ${
                activeTab === 'diagnostics'
                  ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 font-bold'
                  : ''
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostics</span>
            </button>

            <button
              onClick={() => setActiveTab('draft')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer ${
                activeTab === 'draft'
                  ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 font-bold'
                  : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Draft from Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 cursor-pointer ${
                activeTab === 'library'
                  ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-neutral-100 font-bold'
                  : ''
              }`}
            >
              <span>Templates</span>
            </button>
          </nav>

          {/* Zone 3: Info & System Architecture Button + Theme + Print */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Info / System Specs Button */}
            <button
              type="button"
              onClick={onOpenSystemSpecs}
              title="View Agent Specifications & System Diagram"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-lg transition-colors cursor-pointer"
            >
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center font-serif text-[11px] font-bold">i</span>
              <span className="hidden sm:inline">System Diagram</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold tracking-wide text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Letter</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="flex md:hidden items-center justify-between border-t border-neutral-200 dark:border-neutral-800 py-2 overflow-x-auto text-xs gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-2.5 py-1 whitespace-nowrap font-medium rounded ${
              activeTab === 'editor' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold' : 'text-neutral-500'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setActiveTab('ghostwriter')}
            className={`px-2.5 py-1 whitespace-nowrap font-medium rounded ${
              activeTab === 'ghostwriter' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold' : 'text-neutral-500'
            }`}
          >
            Agent
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-2.5 py-1 whitespace-nowrap font-medium rounded ${
              activeTab === 'diagnostics' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold' : 'text-neutral-500'
            }`}
          >
            Diagnostics
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-2.5 py-1 whitespace-nowrap font-medium rounded ${
              activeTab === 'draft' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold' : 'text-neutral-500'
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-2.5 py-1 whitespace-nowrap font-medium rounded ${
              activeTab === 'library' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-bold' : 'text-neutral-500'
            }`}
          >
            Templates
          </button>
        </div>
      </div>
    </header>
  );
};

