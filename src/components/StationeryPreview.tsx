import React from 'react';
import { LetterDocument } from '../types/letter';
import { Copy, Check, Download, FileText, SlidersHorizontal } from 'lucide-react';

interface StationeryPreviewProps {
  document: LetterDocument;
  onUpdateDocument: (updated: Partial<LetterDocument>) => void;
  onOpenSettings: () => void;
  isEditingInline?: boolean;
}

export const StationeryPreview: React.FC<StationeryPreviewProps> = ({
  document,
  onUpdateDocument,
  onOpenSettings,
  isEditingInline = false,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    let fullText = '';
    if (document.format === 'executive_memo') {
      fullText = `MEMORANDUM\n\nTO: ${document.recipient.name}${document.recipient.title ? `, ${document.recipient.title}` : ''}\nFROM: ${document.sender.name}${document.sender.title ? `, ${document.sender.title}` : ''}\nDATE: ${document.date}\nSUBJECT: ${document.subject}\n\n${document.body}\n\n${document.signOff}\n${document.sender.name}`;
    } else {
      fullText = `${document.letterhead.enabled ? `${document.letterhead.organizationName}\n${document.letterhead.address}\n\n` : ''}${document.date}\n\n${document.recipient.name}\n${document.recipient.title || ''}\n${document.recipient.company || ''}\n${document.recipient.addressLine1 || ''}\n${document.recipient.addressLine2 || ''}\n\nSubject: ${document.subject}\n\n${document.salutation}\n\n${document.body}\n\n${document.signOff}\n\n${document.sender.name}\n${document.sender.title || ''}\n${document.sender.company || ''}`;
    }

    navigator.clipboard.writeText(fullText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([document.body], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title.toLowerCase().replace(/\s+/g, '-') || 'letter'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stationery Utility Toolbar */}
      <div className="no-print flex items-center justify-between pb-3 mb-3 border-b border-neutral-200 dark:border-neutral-800 text-xs">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            {document.format === 'executive_memo' ? 'Executive Memorandum' : 'Executive Block Letter'}
          </span>
          <span aria-hidden="true">·</span>
          <span>US Standard (8.5 × 11")</span>
          {document.letterhead.referenceCode && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{document.letterhead.referenceCode}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            title="Configure Letterhead & Addresses"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Format & Letterhead</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            title="Copy plain correspondence"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            title="Export Markdown"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .md</span>
          </button>
        </div>
      </div>

      {/* Physical Letter Sheet Container */}
      <div className="flex-1 overflow-y-auto pr-1">
        <article className="letter-sheet relative mx-auto w-full max-w-[820px] min-h-[1050px] bg-white text-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-8 sm:p-14 mb-8 font-letter transition-all">
          {/* Subtle Confidential Watermark Badge if enabled */}
          {document.letterhead.confidentialBadge && (
            <div className="no-print absolute top-6 right-6 border border-neutral-300 text-neutral-400 text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 pointer-events-none select-none">
              Confidential Correspondence
            </div>
          )}

          {/* Format Branch: Formal Memorandum vs Formal Business Letter */}
          {document.format === 'executive_memo' ? (
            /* ================= EXECUTIVE MEMORANDUM ================= */
            <div>
              {/* Memo Header */}
              <div className="border-b-2 border-neutral-900 pb-6 mb-8">
                <h1 className="text-2xl font-bold tracking-widest text-neutral-900 uppercase font-sans mb-4">
                  MEMORANDUM
                </h1>

                {document.letterhead.enabled && (
                  <div className="text-xs text-neutral-600 font-sans tracking-wide mb-6">
                    <span className="font-bold text-neutral-900">{document.letterhead.organizationName}</span>
                    {document.letterhead.division && <span> · {document.letterhead.division}</span>}
                  </div>
                )}

                <div className="grid grid-cols-[80px_1fr] gap-y-2 text-sm font-sans">
                  <div className="font-bold text-neutral-800 tracking-wider">TO:</div>
                  <div className="text-neutral-900 font-medium">
                    {document.recipient.name}
                    {document.recipient.title && <span className="text-neutral-600 font-normal">, {document.recipient.title}</span>}
                    {document.recipient.company && <span className="text-neutral-600 font-normal"> ({document.recipient.company})</span>}
                  </div>

                  <div className="font-bold text-neutral-800 tracking-wider">FROM:</div>
                  <div className="text-neutral-900 font-medium">
                    {document.sender.name}
                    {document.sender.title && <span className="text-neutral-600 font-normal">, {document.sender.title}</span>}
                    {document.sender.company && <span className="text-neutral-600 font-normal"> ({document.sender.company})</span>}
                  </div>

                  <div className="font-bold text-neutral-800 tracking-wider">DATE:</div>
                  <div className="text-neutral-900">{document.date}</div>

                  <div className="font-bold text-neutral-800 tracking-wider">SUBJECT:</div>
                  <div className="text-neutral-900 font-bold uppercase tracking-tight">
                    {document.subject}
                  </div>
                </div>
              </div>

              {/* Memo Body */}
              <div className="text-[15px] leading-[1.75] text-neutral-900 whitespace-pre-line font-letter">
                {document.body}
              </div>

              {/* Memo Sign-Off / Author Initials */}
              <div className="mt-12 pt-6 border-t border-neutral-200 text-sm font-sans text-neutral-600 flex justify-between items-center">
                <div>
                  <span className="font-semibold text-neutral-800">{document.sender.name}</span>
                  {document.sender.title && <div>{document.sender.title}</div>}
                </div>
                {document.letterhead.referenceCode && (
                  <div className="font-mono text-xs text-neutral-400">
                    Ref: {document.letterhead.referenceCode}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= FORMAL BUSINESS LETTER ================= */
            <div>
              {/* Executive Letterhead */}
              {document.letterhead.enabled && (
                <header className="border-b border-neutral-300 pb-5 mb-8 text-center">
                  <h2 className="text-lg font-bold tracking-[0.2em] uppercase text-neutral-900 font-sans">
                    {document.letterhead.organizationName}
                  </h2>
                  {document.letterhead.division && (
                    <div className="text-xs text-neutral-700 font-sans tracking-wider uppercase mt-1">
                      {document.letterhead.division}
                    </div>
                  )}
                  {document.letterhead.tagline && (
                    <div className="text-[11px] text-neutral-500 font-sans italic mt-1">
                      {document.letterhead.tagline}
                    </div>
                  )}
                  {document.letterhead.address && (
                    <div className="text-[11px] text-neutral-500 font-sans mt-2 tracking-tight">
                      {document.letterhead.address}
                    </div>
                  )}
                </header>
              )}

              {/* Date Block */}
              <div className="text-sm text-neutral-900 font-sans mb-6">
                {document.date}
              </div>

              {/* Recipient Address Block */}
              <div className="text-sm text-neutral-900 font-sans leading-relaxed mb-6">
                <div className="font-semibold">{document.recipient.name}</div>
                {document.recipient.title && <div className="text-neutral-700">{document.recipient.title}</div>}
                {document.recipient.company && <div className="text-neutral-700">{document.recipient.company}</div>}
                {document.recipient.addressLine1 && <div className="text-neutral-600">{document.recipient.addressLine1}</div>}
                {document.recipient.addressLine2 && <div className="text-neutral-600">{document.recipient.addressLine2}</div>}
              </div>

              {/* Subject / RE: Line */}
              {document.subject && (
                <div className="text-sm font-sans font-bold text-neutral-900 mb-6">
                  <span className="text-neutral-600 uppercase tracking-wider text-xs mr-2 font-mono">RE:</span>
                  <span>{document.subject}</span>
                </div>
              )}

              {/* Salutation */}
              <div className="text-[15px] font-letter text-neutral-900 mb-5 font-semibold">
                {document.salutation}
              </div>

              {/* Letter Body Paragraphs */}
              <div className="text-[15px] leading-[1.8] text-neutral-900 whitespace-pre-line font-letter">
                {document.body}
              </div>

              {/* Complimentary Close & Signature Block */}
              <div className="mt-8 text-[15px] font-letter text-neutral-900">
                <div className="mb-8">{document.signOff}</div>

                {/* Simulated Executive Signature Script */}
                <div className="font-serif italic text-2xl text-neutral-800 tracking-wide font-normal mb-2 select-none opacity-85">
                  {document.sender.name}
                </div>

                {/* Typed Sender Name & Title */}
                <div className="font-sans text-sm">
                  <div className="font-bold text-neutral-900">{document.sender.name}</div>
                  {document.sender.title && <div className="text-neutral-700">{document.sender.title}</div>}
                  {document.sender.company && <div className="text-neutral-600">{document.sender.company}</div>}
                  {document.sender.department && <div className="text-neutral-500 text-xs">{document.sender.department}</div>}
                </div>
              </div>

              {/* Document Reference Stamp */}
              {document.letterhead.referenceCode && (
                <div className="mt-12 pt-4 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                  REF: {document.letterhead.referenceCode}
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
};
