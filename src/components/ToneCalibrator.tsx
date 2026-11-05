import React from 'react';
import { ToneType, FormalityLevel, LetterFormat } from '../types/letter';
import { Sparkles, Wand2, RotateCcw, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ToneCalibratorProps {
  currentTone: ToneType;
  setTone: (tone: ToneType) => void;
  formality: FormalityLevel;
  setFormality: (formality: FormalityLevel) => void;
  format: LetterFormat;
  setFormat: (format: LetterFormat) => void;
  customInstructions: string;
  setCustomInstructions: (inst: string) => void;
  onImprove: () => void;
  onAnalyze: () => void;
  isImproving: boolean;
  isAnalyzing: boolean;
  hasOriginalDraft: boolean;
  onRevertToOriginal: () => void;
}

const TONE_OPTIONS: { id: ToneType; label: string }[] = [
  { id: 'Executive & Decisive', label: 'Executive & Decisive' },
  { id: 'Courteous & Diplomatic', label: 'Courteous & Diplomatic' },
  { id: 'Firm & Contractual', label: 'Firm & Contractual' },
  { id: 'Warm & Gracious', label: 'Warm & Gracious' },
  { id: 'Direct & Objective', label: 'Direct & Objective' },
];

export const ToneCalibrator: React.FC<ToneCalibratorProps> = ({
  currentTone,
  setTone,
  formality,
  setFormality,
  format,
  setFormat,
  customInstructions,
  setCustomInstructions,
  onImprove,
  onAnalyze,
  isImproving,
  isAnalyzing,
  hasOriginalDraft,
  onRevertToOriginal,
}) => {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-4">
      {/* Header & Format Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
          Tone Calibration
        </h3>

        {/* Format Selector */}
        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setFormat('formal_letter')}
            className={`px-2.5 py-1 font-medium rounded transition-all whitespace-nowrap cursor-pointer ${
              format === 'formal_letter'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Letter
          </button>
          <button
            type="button"
            onClick={() => setFormat('executive_memo')}
            className={`px-2.5 py-1 font-medium rounded transition-all whitespace-nowrap cursor-pointer ${
              format === 'executive_memo'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Memo
          </button>
        </div>
      </div>

      {/* Tone Preset Buttons */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
          Tone
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TONE_OPTIONS.map((item) => {
            const isSelected = currentTone === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTone(item.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Formality Protocol Level */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
          Formality
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { id: 'strict_protocol' as FormalityLevel, label: 'Strict' },
            { id: 'elevated_business' as FormalityLevel, label: 'Elevated' },
            { id: 'standard_formal' as FormalityLevel, label: 'Standard' },
          ].map((level) => {
            const isSelected = formality === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => setFormality(level.id)}
                className={`py-1.5 text-center rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {level.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specific Custom Directives */}
      <div className="space-y-1">
        <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
          Directives (Optional)
        </label>
        <input
          type="text"
          value={customInstructions}
          onChange={(e) => setCustomInstructions(e.target.value)}
          placeholder="e.g. Keep concise, emphasize deadline..."
          className="w-full text-xs px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-colors"
        />
      </div>


      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onImprove}
          disabled={isImproving || isAnalyzing}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-all shadow-xs"
        >
          {isImproving ? (
            <>
              <div className="w-4 h-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
              <span>Calibrating Tone & Prose...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Calibrate & Polish Letter</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={isImproving || isAnalyzing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
        >
          {isAnalyzing ? (
            <div className="w-3.5 h-3.5 border-2 border-neutral-600 dark:border-neutral-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          <span>Diagnose Tone Risks</span>
        </button>

        {hasOriginalDraft && (
          <button
            type="button"
            onClick={onRevertToOriginal}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Revert to original pre-calibrated draft"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Revert</span>
          </button>
        )}
      </div>
    </div>
  );
};
