import React, { useState } from 'react';
import { LetterTemplate, LetterDocument } from '../types/letter';
import { LETTER_TEMPLATES } from '../data/templates';
import { X, BookOpen, ArrowRight, Check } from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: LetterTemplate) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(LETTER_TEMPLATES.map((t) => t.category)))];

  if (!isOpen) return null;

  const filtered = selectedCategory === 'All'
    ? LETTER_TEMPLATES
    : LETTER_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Template Library</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Bar */}
        <div className="px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-850'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all flex flex-col justify-between bg-neutral-50/40 dark:bg-neutral-800/30 text-xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
                  <span className="font-mono uppercase tracking-wider">{tpl.category}</span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {tpl.recommendedTone}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                  {tpl.title}
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-mono">
                  {tpl.format === 'executive_memo' ? 'Memorandum' : 'Block Letter'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(tpl);
                    onClose();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 font-semibold text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                >
                  <span>Load Template</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
