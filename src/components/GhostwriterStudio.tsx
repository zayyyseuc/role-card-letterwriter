import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  FileText,
  User,
  Heart,
  Laugh,
  RefreshCw,
  ArrowRight,
  Info,
  ShieldAlert,
  PlayCircle,
  Copy,
  Check,
} from 'lucide-react';
import { AgentChatMessage, AgentStage, LetterDocument } from '../types/letter';

interface GhostwriterStudioProps {
  onApplyDraftToLetter: (draft: {
    subject: string;
    salutation: string;
    body: string;
    signOff: string;
  }) => void;
  onOpenSystemSpecs: () => void;
  onOpenTestRunner: () => void;
}

const INITIAL_MESSAGES: AgentChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    content: `Annyeonghaseyo, Heeje! I'm your Humorous Apology Ghostwriter.

I know moving 350 miles up to UC Berkeley for your Master’s in Design from SoCal was a huge leap—and leaving Omma with Dad, your brother, Grandma (Halmoni), and dog Choco comes with that heavy filial guilt. 

Tell me what's on your mind or share a recent family story. Together, we'll calibrate the emotional temperature: keeping it cheerful, lighthearted, warm, and loving—never overly solemn or tragic!`,
    timestamp: 'Just now',
    stage: 1,
    clarifyingQuestions: [
      'What specific situation or apology would you like to write about today?',
      'Are there any funny household quirks you want me to mention (Dad’s remote, Grandma’s secret food scraps)?',
    ],
  },
];

const PRESET_STORIES = [
  {
    label: 'Leaving SoCal for Berkeley',
    text: `Mom, I want to apologize for packing up and moving 350 miles to Berkeley to pursue my master's in design. She's worried I'm starving and wasting my life "gluing cardboard together at 2 AM". Make sure she knows I love her and I'm eating her frozen mandu.`,
  },
  {
    label: 'Missed Sunday Dinner Call',
    text: `I missed Mom's Sunday evening FaceTime call because our design critique ran late until 10 PM. She thinks I am ignoring the family. Write a funny apology that explains the studio was freezing cold and promise I'll call twice on Wednesday.`,
  },
  {
    label: 'Grandma & Dog Choco Care',
    text: `Write a quick note checking in on how Grandma is doing with Choco. Apologize that I'm not home to walk him, but playfully warn Mom not to let Grandma feed him kalbi ribs or spicy kimchi under the dining table.`,
  },
  {
    label: 'Boundary Check (Vague)',
    text: `Write an apology to Mom for something bad. Make it funny.`,
  },
];

export const GhostwriterStudio: React.FC<GhostwriterStudioProps> = ({
  onApplyDraftToLetter,
  onOpenSystemSpecs,
  onOpenTestRunner,
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<AgentStage>(1);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Send message to backend agent
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: AgentChatMessage = {
      id: 'msg-user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({ role: m.role, content: m.content })),
          currentStage,
        }),
      });

      const data = await res.json();
      if (data && data.reply) {
        const agentMsg: AgentChatMessage = {
          id: 'msg-agent-' + Date.now(),
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          stage: data.stage as AgentStage,
          clarifyingQuestions: data.clarifyingQuestions,
          draftLetter: data.draftLetter,
          humorMechanics: data.humorMechanics,
        };

        setMessages((prev) => [...prev, agentMsg]);
        if (data.stage) {
          setCurrentStage(data.stage as AgentStage);
        }
      }
    } catch (err) {
      console.error('Agent chat error:', err);
      // Fallback message
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-agent-err-' + Date.now(),
          role: 'assistant',
          content: `Heeje, I hear you! Let's make sure Mom gets the warmest, funniest letter possible. Could you tell me a little more about what specific inside joke or detail from home you want to emphasize?`,
          timestamp: 'Just now',
          stage: 3,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setCurrentStage(1);
  };

  const stageLabels = [
    { num: 1, name: 'Story Intake' },
    { num: 2, name: 'Interpretation' },
    { num: 3, name: 'Clarification' },
    { num: 4, name: 'Rough Draft' },
    { num: 5, name: 'Confirmation' },
    { num: 6, name: 'Final Polish' },
  ];

  return (
    <div className="space-y-6">
      {/* Ghostwriter Persona Header Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl shadow-xs">
              <Laugh className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Humorous Apology Ghostwriter Studio
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
                  Cheerful &bull; Warm &bull; Loving
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  Client: Heeje Lee
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Balancing heartfelt filial apology with playful warmth for Mom regarding your Berkeley design master&apos;s journey.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onOpenSystemSpecs}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-amber-500" />
              <span>System Diagram &amp; Specs</span>
            </button>

            <button
              onClick={onOpenTestRunner}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Run Test Bench</span>
            </button>

            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6-Step Interaction Loop Progress Bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Interaction Loop Lifecycle
            </span>
            <span>Step {currentStage} of 6: {stageLabels.find((s) => s.num === currentStage)?.name}</span>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {stageLabels.map((s) => {
              const isCurrent = s.num === currentStage;
              const isPassed = s.num < currentStage;
              return (
                <div
                  key={s.num}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                      : isPassed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/60 text-emerald-800 dark:text-emerald-300 font-medium'
                      : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div className="text-[10px] font-mono opacity-80">Step {s.num}</div>
                  <div className="text-xs truncate">{s.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grounding Knowledge Base Status Pill */}
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Grounding Context:</span>
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Client: Heeje Lee</span>
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Target: Mom (Omma)</span>
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Family: Dad, Brother, Grandma (Halmoni), Dog Choco</span>
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">Location: SoCal &rarr; UC Berkeley MDes</span>
        </div>
      </div>

      {/* Main Conversation Stream & Draft Production View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Stream (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden h-[620px]">
          {/* Preset Prompts Shelf */}
          <div className="p-3 bg-neutral-50/80 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 shrink-0 font-semibold">
              Quick Scenarios:
            </span>
            {PRESET_STORIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(preset.text)}
                disabled={isLoading}
                className="px-2.5 py-1 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-500 rounded-lg text-neutral-700 dark:text-neutral-300 hover:text-amber-600 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAgent = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAgent ? 'items-start' : 'items-start justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      <Laugh className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-2 max-w-[85%] ${isAgent ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAgent
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-xs'
                          : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Humor Mechanics badge */}
                      {msg.humorMechanics && (
                        <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[10px] font-mono text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          <span><strong>Humor Mechanics:</strong> {msg.humorMechanics}</span>
                        </div>
                      )}
                    </div>

                    {/* Clarifying Questions Chips (if present) */}
                    {msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 text-left space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 font-mono">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Clarification Needed (Interaction Loop Step 3):</span>
                        </div>
                        <p className="text-[11px] text-amber-800 dark:text-amber-300/90">
                          To make this sound authentically like you and avoid making up facts, please tell me:
                        </p>
                        <div className="space-y-1.5">
                          {msg.clarifyingQuestions.map((q, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => {
                                setInputValue(`Regarding "${q}": `);
                              }}
                              className="w-full text-left p-2 rounded-lg bg-white dark:bg-neutral-900 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-neutral-800 dark:text-neutral-200 hover:border-amber-400 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                            >
                              <span>{q}</span>
                              <span className="text-[10px] text-amber-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                Answer &rarr;
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-neutral-400 font-mono px-1">
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAgent && (
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono py-2 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <span>Ghostwriter is considering emotional temperature &amp; drafting...</span>
              </div>
            )}
          </div>

          {/* User Input Bar */}
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Tell a family story, answer questions, or ask to tweak the jokes..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Live Draft Output & Direct Action Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {(() => {
            // Find most recent draft produced
            const latestMsgWithDraft = [...messages].reverse().find((m) => m.draftLetter);
            const draft = latestMsgWithDraft?.draftLetter;

            if (!draft) {
              return (
                <div className="h-full min-h-[420px] bg-neutral-50/70 dark:bg-neutral-900/60 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    Awaiting Story &amp; Clarification
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed">
                    Once you share your story and answer clarifying questions, the Humorous Apology draft will materialize here with one-click transfer to your stationery letterhead.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleSendMessage(PRESET_STORIES[0].text)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 rounded-lg hover:bg-amber-200 transition-colors"
                    >
                      Try Story: &ldquo;Leaving for Berkeley&rdquo;
                    </button>
                  </div>
                </div>
              );
            }

            const fullText = `${draft.salutation}\n\n${draft.body}\n\n${draft.signOff}`;

            return (
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs flex flex-col space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
                      Generated Letter Draft
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyDraft(fullText)}
                      className="p-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                      title="Copy text"
                    >
                      {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Subject Box */}
                <div className="bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase font-bold">
                    Subject Line
                  </span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {draft.subject}
                  </span>
                </div>

                {/* Letter Body Preview Box */}
                <div className="p-4 bg-amber-50/20 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-letter leading-relaxed space-y-3 max-h-[340px] overflow-y-auto">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {draft.salutation}
                  </div>
                  <div className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                    {draft.body}
                  </div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap pt-2">
                    {draft.signOff}
                  </div>
                </div>

                {/* Primary Action Button: Transfer to Stationery Sheet */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => onApplyDraftToLetter(draft)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Apply Draft to Stationery Sheet &amp; Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <p className="text-[10px] text-neutral-400 text-center font-mono">
                    Transfers text into physical paper layout for printing or fine-tuning.
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
