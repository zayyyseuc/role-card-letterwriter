import React from 'react';
import { LetterAnalysis, RiskFlag } from '../types/letter';
import { ShieldAlert, CheckCircle, AlertTriangle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

interface ToneDiagnosticsProps {
  analysis: LetterAnalysis | undefined;
  isLoading: boolean;
  onRunAnalysis: () => void;
  onApplyFix: (flag: RiskFlag) => void;
}

export const ToneDiagnostics: React.FC<ToneDiagnosticsProps> = ({
  analysis,
  isLoading,
  onRunAnalysis,
  onApplyFix,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center space-y-4">
        <div className="inline-block w-8 h-8 border-3 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin" />
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Conducting Comprehensive Tone & Protocol Diagnosis...
        </h3>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          Scanning for passive-aggressive nuance, apologetic throat-clearing, clarity friction, and formal protocol compliance.
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 text-center space-y-4">
        <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            No Active Diagnosis Available
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            Analyze your draft to measure clarity, executive authority, emotional vulnerability, and protocol etiquette.
          </p>
        </div>
        <button
          type="button"
          onClick={onRunAnalysis}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-xs"
        >
          <span>Run Diagnosis Now</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-mono uppercase">Detected Tone</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              {analysis.overallTone}
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
            Correspondence Health & Risk Diagnosis
          </h3>
        </div>

        <button
          onClick={onRunAnalysis}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          title="Re-run diagnostic analysis"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Audit</span>
        </button>
      </div>

      {/* Executive Perception Summary */}
      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700/60 text-xs">
        <div className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center gap-1.5">
          <span>Executive Recipient Perception</span>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
          {analysis.executiveSummary}
        </p>
      </div>

      {/* Quantitative Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Clarity', score: analysis.clarityScore },
          { label: 'Formality', score: analysis.formalityScore },
          { label: 'Diplomacy', score: analysis.diplomacyScore },
          { label: 'Conciseness', score: analysis.concisenessScore },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20"
          >
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              {stat.label}
            </div>
            <div className="text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-neutral-100 mt-0.5">
              {stat.score}%
            </div>
          </div>
        ))}
      </div>


      {/* Protocol & Etiquette Checklist */}
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
        <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
          Structural Protocol Checklist
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            {analysis.protocolCheck.salutationValid ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span className="text-neutral-700 dark:text-neutral-300">Formal Salutation Validated</span>
          </div>
          <div className="flex items-center gap-2">
            {analysis.protocolCheck.signOffValid ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span className="text-neutral-700 dark:text-neutral-300">Complimentary Close Etiquette</span>
          </div>
        </div>
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <span>{analysis.protocolCheck.structureAssessment}</span>
          <span className="ml-2 font-mono tabular-nums">
            ({analysis.protocolCheck.wordCount} words · ~{analysis.protocolCheck.readingTimeMinutes} min read)
          </span>
        </div>
      </div>

      {/* Tone Risk Flags & Direct Fixes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Tone Vulnerabilities & Refinements</span>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {analysis.riskFlags.length} detected
          </span>
        </div>

        {analysis.riskFlags.length === 0 ? (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>No critical tone vulnerabilities detected. The correspondence exhibits strong executive posture.</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {analysis.riskFlags.map((flag, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                      <span className="line-through text-neutral-400 dark:text-neutral-500 font-serif">"{flag.phrase}"</span>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">
                        [{flag.severity} impact]
                      </span>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      {flag.issue}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onApplyFix(flag)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Apply Fix</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-2 bg-neutral-50 dark:bg-neutral-800/60 rounded border border-neutral-200 dark:border-neutral-700/60 font-serif text-neutral-800 dark:text-neutral-200 text-xs flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 shrink-0 font-sans">
                    Recommended:
                  </span>
                  <span>"{flag.suggestedAlternative}"</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
