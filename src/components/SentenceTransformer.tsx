import React, { useState } from 'react';
import { SentenceAlternative } from '../types/letter';
import { Sparkles, ArrowRight, Copy, Check, CornerDownLeft } from 'lucide-react';

interface SentenceTransformerProps {
  onInsertSentence?: (text: string) => void;
}

export const SentenceTransformer: React.FC<SentenceTransformerProps> = ({ onInsertSentence }) => {
  const [inputSentence, setInputSentence] = useState(
    "I just wanted to check in because we haven't received the updated pricing schedule and our timeline is getting tight."
  );
  const [alternatives, setAlternatives] = useState<SentenceAlternative[]>([
    {
      style: 'Decisive & Direct',
      text: 'Please provide the finalized pricing schedule by close of business today to preserve our delivery timeline.',
      tip: 'Active imperative phrasing eliminates passive uncertainty and establishes a clear action trigger.',
    },
    {
      style: 'Diplomatic & Tactful',
      text: 'We would be grateful to receive the updated pricing schedule at your earliest convenience so that we may maintain our project schedule.',
      tip: 'Courteous framing avoids accusatory tones while reaffirming commercial alignment.',
    },
    {
      style: 'Firm & Authoritative',
      text: 'Delivery of the outstanding pricing schedule is now overdue; timely submission is required to avoid schedule disruption.',
      tip: 'Formally documents the delay as a factual status without emotional charge.',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleTransform = async () => {
    if (!inputSentence.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/letter/suggest-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: inputSentence }),
      });
      const data = await res.json();
      if (data.options && Array.isArray(data.options)) {
        setAlternatives(data.options);
      }
    } catch (err) {
      console.error('Failed to transform sentence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
            Sentence Lab & Phrasing Refiner
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Test and contrast three executive angles for any delicate sentence or phrase
          </p>
        </div>
      </div>

      {/* Input Field */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Raw or Informal Sentence
        </label>
        <div className="flex gap-2">
          <textarea
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            rows={2}
            placeholder="Type or paste any draft sentence you wish to polish..."
            className="flex-1 text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
          <button
            type="button"
            onClick={handleTransform}
            disabled={loading || !inputSentence.trim()}
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors shrink-0 flex flex-col items-center justify-center gap-1"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white dark:border-neutral-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Refine</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Alternatives */}
      <div className="space-y-2.5 pt-1">
        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono text-[11px] tracking-wide">
                {alt.style}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy(alt.text, idx)}
                  className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded hover:bg-neutral-200/50 dark:hover:bg-neutral-700 transition-colors"
                  title="Copy variation"
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                {onInsertSentence && (
                  <button
                    type="button"
                    onClick={() => onInsertSentence(alt.text)}
                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-200/60 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-colors"
                    title="Append to letter body"
                  >
                    <CornerDownLeft className="w-2.5 h-2.5" />
                    <span>Insert</span>
                  </button>
                )}
              </div>
            </div>

            <p className="font-letter text-neutral-900 dark:text-neutral-100 text-[13px] leading-relaxed">
              "{alt.text}"
            </p>

            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-sans">
              {alt.tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
