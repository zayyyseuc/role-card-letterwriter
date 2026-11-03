import React from 'react';
import { ImprovedResult } from '../types/letter';
import { GitCompare, Check, Sparkles, ArrowRight } from 'lucide-react';

interface DiffComparisonProps {
  improvedResult: ImprovedResult;
  onAcceptAll: () => void;
  onDismiss: () => void;
}

export const DiffComparison: React.FC<DiffComparisonProps> = ({
  improvedResult,
  onAcceptAll,
  onDismiss,
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
            Calibration Audit & Transformation Log
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDismiss}
            className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={onAcceptAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Keep Calibrated Draft</span>
          </button>
        </div>
      </div>

      {/* Rationale Callout */}
      <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs">
        <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Strategic Tonal Rationale</span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
          {improvedResult.rationale}
        </p>
      </div>

      {/* Specific Changes List */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 font-mono uppercase tracking-wider">
          Specific Transformations ({improvedResult.diffChanges.length})
        </div>

        {improvedResult.diffChanges.length === 0 ? (
          <p className="text-xs text-neutral-500">
            Broad structural cadence and word choice were tightened across the full body.
          </p>
        ) : (
          <div className="space-y-3">
            {improvedResult.diffChanges.map((change, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-800/20 text-xs space-y-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Original Excerpt */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      Prior Phrasing
                    </span>
                    <div className="p-2 bg-red-50/60 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 rounded text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed line-through">
                      "{change.originalExcerpt}"
                    </div>
                  </div>

                  {/* Revised Excerpt */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      Executive Revision
                    </span>
                    <div className="p-2 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded text-neutral-900 dark:text-neutral-100 font-serif font-medium leading-relaxed">
                      "{change.revisedExcerpt}"
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span>{change.reason}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
