import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StationeryPreview } from './components/StationeryPreview';
import { ToneCalibrator } from './components/ToneCalibrator';
import { ToneDiagnostics } from './components/ToneDiagnostics';
import { DiffComparison } from './components/DiffComparison';

import { DraftStudioModal } from './components/DraftStudioModal';
import { TemplateGalleryModal } from './components/TemplateGalleryModal';
import { StationerySettingsModal } from './components/StationerySettingsModal';
import { GhostwriterStudio } from './components/GhostwriterStudio';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import { AgentTestRunner } from './components/AgentTestRunner';

import {
  LetterDocument,
  ToneType,
  FormalityLevel,
  LetterFormat,
  LetterAnalysis,
  ImprovedResult,
  RiskFlag,
  LetterTemplate,
} from './types/letter';
import { LETTER_TEMPLATES } from './data/templates';
import {
  PenLine,
  Eye,
  GitCompare,
  SlidersHorizontal,
  Plus,
  Save,
  CheckCircle,
  FileText,
  AlertCircle,
  Undo2,
  Sparkles,
} from 'lucide-react';

const STORAGE_KEY = 'verbaform_active_letter';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('verbaform_theme') === 'dark' ||
        (!localStorage.getItem('verbaform_theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      window.document.documentElement.classList.add('dark');
      localStorage.setItem('verbaform_theme', 'dark');
    } else {
      window.document.documentElement.classList.remove('dark');
      localStorage.setItem('verbaform_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'editor' | 'ghostwriter' | 'diagnostics'>('editor');

  // Active document state with fallback to initial template
  const [document, setDocument] = useState<LetterDocument>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved letter:', e);
    }
    // Default initial template
    const defaultTpl = LETTER_TEMPLATES[0];
    return {
      ...defaultTpl.document,
      id: 'doc-' + Date.now(),
    };
  });

  // Editor sub-view: 'stationery' (physical sheet) vs 'diff' (audit comparison)
  const [previewMode, setPreviewMode] = useState<'stationery' | 'diff'>('stationery');

  // Tone and Calibration parameters
  const [targetTone, setTargetTone] = useState<ToneType>('Firm & Contractual');
  const [formalityLevel, setFormalityLevel] = useState<FormalityLevel>('strict_protocol');
  const [customDirectives, setCustomDirectives] = useState('');

  // Async API states
  const [isImproving, setIsImproving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [isDraftStudioOpen, setIsDraftStudioOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSystemSpecsOpen, setIsSystemSpecsOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);

  // Apply draft produced by Ghostwriter Agent directly to the letter stationery
  const handleApplyAgentDraft = (draft: {
    subject: string;
    salutation: string;
    body: string;
    signOff: string;
  }) => {
    setDocument((prev) => ({
      ...prev,
      title: 'Apology & Warm Letter to Mom (Berkeley)',
      subject: draft.subject,
      salutation: draft.salutation,
      body: draft.body,
      signOff: draft.signOff,
      sender: {
        name: 'Heeje Lee',
        title: 'Master of Design Candidate',
        company: 'UC Berkeley Jacobs Institute',
        addressLine1: 'Berkeley, CA 94720',
        email: 'heeje.lee@berkeley.edu',
      },
      recipient: {
        name: 'Mom (Omma)',
        title: 'Chief Household Executive & Best Cook',
        company: 'The Lee Family Residence',
        addressLine1: 'Southern California, CA',
      },
      letterhead: {
        enabled: true,
        organizationName: 'LEE FAMILY CORRESPONDENCE',
        division: 'Office of the Eldest Son',
        tagline: 'Warmth, Apologies & Berkeley Design Studio Dispatch',
        address: 'Berkeley, CA · SoCal Family Dispatch · heeje.lee@berkeley.edu',
        referenceCode: `HEEJE-MOM-${new Date().getFullYear()}-01`,
        confidentialBadge: false,
        dateFormat: 'us',
      },
    }));
    setTargetTone('Warm & Gracious');
    setActiveTab('editor');
    setPreviewMode('stationery');
    showToast('Humorous Apology draft applied to Stationery Sheet!');
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
    } catch (e) {
      console.warn('Failed to save document:', e);
    }
  }, [document]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateDocument = (updated: Partial<LetterDocument>) => {
    setDocument((prev) => ({ ...prev, ...updated }));
  };

  // 1. Run Tone & Protocol Analysis
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/letter/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `${document.salutation}\n\n${document.body}\n\n${document.signOff}`,
          format: document.format,
          context: document.subject,
        }),
      });
      const data: LetterAnalysis = await res.json();
      if (data && data.clarityScore !== undefined) {
        handleUpdateDocument({ lastAnalysis: data });
        showToast('Tone & clarity diagnosis complete.');
      } else {
        showToast('Analysis completed with notes.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      showToast('Could not reach analysis service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Improve and Polish Letter
  const handleImproveLetter = async () => {
    setIsImproving(true);
    // Keep record of original pre-calibrated text for revert
    if (!document.originalDraft) {
      handleUpdateDocument({ originalDraft: document.body });
    }

    try {
      const res = await fetch('/api/letter/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: document.body,
          targetTone,
          formalityLevel,
          format: document.format,
          customInstructions: customDirectives,
          senderInfo: document.sender,
          recipientInfo: document.recipient,
        }),
      });
      const data: ImprovedResult = await res.json();
      if (data && data.improvedContent) {
        handleUpdateDocument({
          body: data.improvedContent,
          subject: data.subjectLine || document.subject,
          salutation: data.salutation || document.salutation,
          signOff: data.signOff || document.signOff,
          improvedResult: data,
        });
        setPreviewMode('diff');
        showToast(`Correspondence calibrated to ${targetTone}.`);
      }
    } catch (err: any) {
      console.error('Improvement error:', err);
      showToast('Failed to polish correspondence.');
    } finally {
      setIsImproving(false);
    }
  };

  // 3. Revert to original pre-calibrated draft
  const handleRevertToOriginal = () => {
    if (document.originalDraft) {
      handleUpdateDocument({
        body: document.originalDraft,
        improvedResult: undefined,
      });
      setPreviewMode('stationery');
      showToast('Reverted to original pre-calibration draft.');
    }
  };

  // 4. Apply diagnostic risk fix
  const handleApplyFix = (flag: RiskFlag) => {
    if (document.body.includes(flag.phrase)) {
      const updatedBody = document.body.replace(flag.phrase, flag.suggestedAlternative);
      handleUpdateDocument({ body: updatedBody });
      showToast(`Replaced "${flag.phrase}" with recommended phrasing.`);
    } else {
      // Look for case-insensitive match
      const regex = new RegExp(flag.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      if (regex.test(document.body)) {
        const updatedBody = document.body.replace(regex, flag.suggestedAlternative);
        handleUpdateDocument({ body: updatedBody });
        showToast(`Replaced "${flag.phrase}" with recommended phrasing.`);
      } else {
        showToast(`Phrase "${flag.phrase}" was already edited.`);
      }
    }
  };

  // 5. Append sentence from SentenceTransformer
  const handleInsertSentence = (text: string) => {
    handleUpdateDocument({
      body: document.body + `\n\n${text}`,
    });
    showToast('Appended refined sentence to letter body.');
  };

  // 6. Load Template
  const handleSelectTemplate = (template: LetterTemplate) => {
    setDocument({
      ...template.document,
      id: 'doc-' + Date.now(),
    });
    setTargetTone(template.recommendedTone);
    setPreviewMode('stationery');
    showToast(`Loaded "${template.title}".`);
  };

  // 7. Print action
  const handlePrint = () => {
    window.print();
  };

  // 8. Create blank correspondence
  const handleCreateBlank = () => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    setDocument({
      id: 'doc-' + Date.now(),
      title: 'Formal Correspondence',
      format: 'formal_letter',
      date: today,
      subject: 'Formal Notification and Business Overview',
      salutation: 'Dear Mr./Ms. [Surname],',
      body: 'I am writing to formally communicate our position regarding the recent matters discussed during our executive review.\n\nPlease review the accompanying documentation and provide your confirmation by Friday.',
      signOff: 'Respectfully yours,',
      sender: {
        name: 'Executive Name',
        title: 'Managing Director',
        company: 'Corporate Enterprise LLC',
      },
      recipient: {
        name: 'Recipient Name',
        title: 'Executive Officer',
        company: 'Partner Organization Inc.',
        addressLine1: '100 Financial Way',
        addressLine2: 'New York, NY 10001',
      },
      letterhead: {
        enabled: true,
        organizationName: 'CORPORATE ENTERPRISE',
        division: 'Executive Office',
        tagline: 'Strategic Advisory & Operations',
        address: '100 Financial Way · New York, NY 10001 · contact@corp-enterprise.com',
        referenceCode: `REF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        confidentialBadge: false,
        dateFormat: 'us',
      },
    });
    setPreviewMode('stationery');
    showToast('Created new formal letter draft.');
  };

  return (
    <div className="min-h-screen bg-neutral-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      {/* Toast Notification */}
      {notification && (
        <div className="no-print fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Top Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPrint={handlePrint}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenSystemSpecs={() => setIsSystemSpecsOpen(true)}
        onOpenTestRunner={() => setIsTestRunnerOpen(true)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* View Switch: Ghostwriter Studio vs Full Diagnostics View vs Editor */}
        {activeTab === 'ghostwriter' ? (
          <GhostwriterStudio
            onApplyDraftToLetter={handleApplyAgentDraft}
            onOpenSystemSpecs={() => setIsSystemSpecsOpen(true)}
            onOpenTestRunner={() => setIsTestRunnerOpen(true)}
          />
        ) : activeTab === 'diagnostics' ? (
          <div className="space-y-4">
            <ToneDiagnostics
              analysis={document.lastAnalysis}
              isLoading={isAnalyzing}
              onRunAnalysis={handleRunAnalysis}
              onApplyFix={handleApplyFix}
            />
          </div>
        ) : (
          /* Editor Dual-Column Layout */
          <div className="space-y-4">
            {/* Minimal Editor Toolbar */}
            <div className="no-print flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {document.title || 'Untitled Correspondence'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCreateBlank}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>

                <button
                  onClick={() => setIsTemplateGalleryOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Templates</span>
                </button>

                <button
                  onClick={() => setIsDraftStudioOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  <span>Draft from Notes</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">


            {/* Left Column: Draft Inputs, Calibrator, and Sentence Lab (5 cols) */}
            <div className="no-print lg:col-span-5 space-y-6">
              {/* Tone Calibrator Panel */}
              <ToneCalibrator
                currentTone={targetTone}
                setTone={setTargetTone}
                formality={formalityLevel}
                setFormality={setFormalityLevel}
                format={document.format}
                setFormat={(fmt) => handleUpdateDocument({ format: fmt })}
                customInstructions={customDirectives}
                setCustomInstructions={setCustomDirectives}
                onImprove={handleImproveLetter}
                onAnalyze={handleRunAnalysis}
                isImproving={isImproving}
                isAnalyzing={isAnalyzing}
                hasOriginalDraft={Boolean(document.originalDraft)}
                onRevertToOriginal={handleRevertToOriginal}
              />

              {/* Interactive Text Editor Fields */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
                      Draft Composition
                    </h3>
                  </div>

                  <span className="text-[11px] text-neutral-400 font-mono tabular-nums">
                    {document.body.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                {/* Subject / RE: Field */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                    Subject / RE: Title
                  </label>
                  <input
                    type="text"
                    value={document.subject}
                    onChange={(e) => handleUpdateDocument({ subject: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 font-medium"
                  />
                </div>

                {/* Salutation Field (if standard letter) */}
                {document.format !== 'executive_memo' && (
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                      Formal Salutation
                    </label>
                    <input
                      type="text"
                      value={document.salutation}
                      onChange={(e) => handleUpdateDocument({ salutation: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 font-letter"
                    />
                  </div>
                )}

                {/* Main Body Textarea */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                    Correspondence Body Paragraphs
                  </label>
                  <textarea
                    value={document.body}
                    onChange={(e) => handleUpdateDocument({ body: e.target.value })}
                    rows={12}
                    className="w-full text-xs p-3.5 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 font-letter leading-relaxed"
                    placeholder="Enter or draft correspondence body here..."
                  />
                </div>

                {/* Sign-Off Field */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                    Complimentary Close (Sign-Off)
                  </label>
                  <input
                    type="text"
                    value={document.signOff}
                    onChange={(e) => handleUpdateDocument({ signOff: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 font-letter"
                  />
                </div>
              </div>
            </div>


            {/* Right Column: Live Stationery Preview or Diff Comparison (7 cols) */}
            <div className="lg:col-span-7 flex flex-col h-full sticky top-20">
              {/* View Mode Switcher Header */}
              <div className="no-print flex items-center justify-between pb-3 mb-2">
                <div className="flex items-center gap-1 p-1 bg-neutral-200/70 dark:bg-neutral-800 rounded-lg text-xs">
                  <button
                    onClick={() => setPreviewMode('stationery')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                      previewMode === 'stationery'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Stationery Sheet</span>
                  </button>

                  <button
                    onClick={() => setPreviewMode('diff')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                      previewMode === 'diff'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Transformation Diff</span>
                    {document.improvedResult && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Letterhead & Recipient</span>
                  </button>
                </div>
              </div>

              {/* View Content */}
              {previewMode === 'diff' && document.improvedResult ? (
                <div className="space-y-6">
                  <DiffComparison
                    improvedResult={document.improvedResult}
                    onAcceptAll={() => {
                      setPreviewMode('stationery');
                      showToast('Calibrated draft locked in.');
                    }}
                    onDismiss={() => setPreviewMode('stationery')}
                  />
                  {/* Secondary Sheet Preview beneath diff */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <StationeryPreview
                      document={document}
                      onUpdateDocument={handleUpdateDocument}
                      onOpenSettings={() => setIsSettingsOpen(true)}
                    />
                  </div>
                </div>
              ) : (
                <StationeryPreview
                  document={document}
                  onUpdateDocument={handleUpdateDocument}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Modals */}
      <DraftStudioModal
        isOpen={isDraftStudioOpen}
        onClose={() => setIsDraftStudioOpen(false)}
        onApplyDraft={(draft) => {
          handleUpdateDocument(draft);
          setActiveTab('editor');
          setPreviewMode('stationery');
          showToast('Draft generated and applied to editor.');
        }}
      />

      <TemplateGalleryModal
        isOpen={isTemplateGalleryOpen}
        onClose={() => setIsTemplateGalleryOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      <StationerySettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        document={document}
        onUpdateDocument={handleUpdateDocument}
      />

      {/* System Architecture Diagram & Specifications Modal (Behind Info Button) */}
      <SystemDiagramModal
        isOpen={isSystemSpecsOpen}
        onClose={() => setIsSystemSpecsOpen(false)}
      />

      {/* Agent Standardized Test Suite Runner */}
      <AgentTestRunner
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
        onApplyDraft={handleApplyAgentDraft}
      />
    </div>
  );
}

