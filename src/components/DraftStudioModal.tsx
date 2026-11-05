import React, { useState } from 'react';
import { LetterFormat, ToneType, FormalityLevel, LetterDocument } from '../types/letter';
import { Sparkles, ArrowRight, X, Lightbulb } from 'lucide-react';

interface DraftStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (draft: Partial<LetterDocument>) => void;
}

const SAMPLE_PROMPTS = [
  {
    title: 'Vendor Price Increase Dispute',
    prompt: 'Write to our SaaS vendor push back on an unannounced 25% price increase. Mention that our annual agreement capped increases at 5%, remind them of 3 platform outages last quarter, and demand that they honor the 5% cap or we will initiate an RFP for alternative solutions.',
    format: 'formal_letter' as LetterFormat,
    tone: 'Firm & Contractual' as ToneType,
  },
  {
    title: 'Graceful Board Resignation',
    prompt: 'Formal letter resigning from an advisory board due to expanding operational commitments at my primary company. Express genuine gratitude to the Chairman, highlight the 3 milestones achieved during my 2-year tenure, offer to assist with onboarding my successor, and provide 60 days notice.',
    format: 'formal_letter' as LetterFormat,
    tone: 'Warm & Gracious' as ToneType,
  },
  {
    title: 'Internal Audit Remediation Memo',
    prompt: 'Executive memorandum to department heads regarding findings from Q3 internal financial audit. Highlight that travel expenses require VP pre-approval over $1,500, state that vendor contracts over $50k must have legal review, and set compliance deadline of December 1st.',
    format: 'executive_memo' as LetterFormat,
    tone: 'Executive & Decisive' as ToneType,
  },
];

export const DraftStudioModal: React.FC<DraftStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyDraft,
}) => {
  const [promptText, setPromptText] = useState('');
  const [format, setFormat] = useState<LetterFormat>('formal_letter');
  const [tone, setTone] = useState<ToneType>('Executive & Decisive');
  const [formality, setFormality] = useState<FormalityLevel>('strict_protocol');
  const [isDrafting, setIsDrafting] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!promptText.trim()) return;
    setIsDrafting(true);
    try {
      const res = await fetch('/api/letter/draft-from-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          format,
          targetTone: tone,
          formalityLevel: formality,
        }),
      });
      const data = await res.json();
      if (data && data.body) {
        onApplyDraft({
          format,
          subject: data.subjectLine || 'Formal Business Matter',
          salutation: data.salutation || 'Dear Sir or Madam,',
          body: data.body,
          signOff: data.signOff || 'Sincerely,',
          title: data.subjectLine || 'New Formal Draft',
        });
        onClose();
      }
    } catch (err) {
      console.error('Failed to generate draft:', err);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleLoadSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setPromptText(sample.prompt);
    setFormat(sample.format);
    setTone(sample.tone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Draft from Notes
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Sample Prompts */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Presets</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_PROMPTS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleLoadSample(sample)}
                  className="p-2.5 text-left border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-600 transition-all bg-neutral-50/50 dark:bg-neutral-800/40"
                >
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {sample.title}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1 line-clamp-2">
                    {sample.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt / Notes Input */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300">
              Notes or Prompt
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={4}
              placeholder="e.g. Request an 8-week rent abatement during municipal water main repairs that will block customer parking..."
              className="w-full text-xs p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 leading-relaxed font-sans"
            />
          </div>

          {/* Controls: Format & Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as LetterFormat)}
                className="w-full text-xs p-2.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              >
                <option value="formal_letter">Standard Business Letter</option>
                <option value="executive_memo">Memorandum</option>
                <option value="board_letter">Board Governance Letter</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ToneType)}
                className="w-full text-xs p-2.5 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
              >
                <option value="Executive & Decisive">Executive & Decisive</option>
                <option value="Courteous & Diplomatic">Courteous & Diplomatic</option>
                <option value="Firm & Contractual">Firm & Contractual</option>
                <option value="Warm & Gracious">Warm & Gracious</option>
                <option value="Direct & Objective">Direct & Objective</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isDrafting || !promptText.trim()}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isDrafting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
                <span>Drafting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Draft</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
