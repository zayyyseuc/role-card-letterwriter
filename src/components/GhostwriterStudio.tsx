import React, { useState } from 'react';
import {
  Send,
  HelpCircle,
  CheckCircle2,
  FileText,
  User,
  Laugh,
  RefreshCw,
  ArrowRight,
  Info,
  PlayCircle,
  Copy,
  Check,
} from 'lucide-react';
import { AgentChatMessage, AgentStage } from '../types/letter';

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
    content: "Hi Heeje! I'm your Humorous Apology Ghostwriter. Share your story or what you'd like to say to Mom, and I'll craft a warm, funny letter in your authentic voice.",
    timestamp: 'Just now',
    stage: 1,
  },
];

const PRESET_STORIES = [
  {
    label: 'Berkeley Move',
    text: `Mom, I want to apologize for packing up and moving 350 miles to Berkeley to pursue my master's in design. She's worried I'm starving and wasting my life "gluing cardboard together at 2 AM". Make sure she knows I love her and I'm eating her frozen mandu.`,
  },
  {
    label: 'Missed Call',
    text: `I missed Mom's Sunday evening FaceTime call because our design critique ran late until 10 PM. She thinks I am ignoring the family. Write a funny apology that explains the studio was freezing cold and promise I'll call twice on Wednesday.`,
  },
  {
    label: 'Choco & Grandma',
    text: `Write a quick note checking in on how Grandma is doing with Choco. Apologize that I'm not home to walk him, but playfully warn Mom not to let Grandma feed him kalbi ribs or spicy kimchi under the dining table.`,
  },
  {
    label: 'Vague Test',
    text: `Write an apology to Mom for something bad. Make it funny.`,
  },
];

const STAGE_NAMES: Record<number, string> = {
  1: 'Story Intake',
  2: 'Interpretation',
  3: 'Clarification',
  4: 'Rough Draft',
  5: 'Confirmation',
  6: 'Final Polish',
};

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
        };

        setMessages((prev) => [...prev, agentMsg]);
        if (data.stage) {
          setCurrentStage(data.stage as AgentStage);
        }
      }
    } catch (err) {
      console.error('Agent chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-agent-err-' + Date.now(),
          role: 'assistant',
          content: `Heeje, tell me a little more about what specific inside joke or detail from home you want to emphasize!`,
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

  // Find most recent draft produced
  const latestMsgWithDraft = [...messages].reverse().find((m) => m.draftLetter);
  const draft = latestMsgWithDraft?.draftLetter;

  return (
    <div className="space-y-4">
      {/* Streamlined Header Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Laugh className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Ghostwriter Agent
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Step {currentStage}/6 · {STAGE_NAMES[currentStage] || 'Story Intake'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSystemSpecs}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>

          <button
            onClick={onOpenTestRunner}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg transition-colors cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Test Bench</span>
          </button>

          <button
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Conversation & Draft Output View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chat Stream (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden h-[540px]">
          {/* Quick Scenario Chips */}
          <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-neutral-400 shrink-0 font-semibold px-1">
              Scenarios:
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
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map((msg) => {
              const isAgent = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAgent ? 'items-start' : 'items-start justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-xs mt-0.5">
                      <Laugh className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`space-y-1.5 max-w-[85%] ${isAgent ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        isAgent
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tl-xs'
                          : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-tr-xs'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>

                    {/* Clarifying Questions */}
                    {msg.clarifyingQuestions && msg.clarifyingQuestions.length > 0 && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-lg p-2.5 text-left space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900 dark:text-amber-300">
                          <HelpCircle className="w-3 h-3 text-amber-600" />
                          <span>Clarification needed:</span>
                        </div>
                        <div className="space-y-1">
                          {msg.clarifyingQuestions.map((q, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => setInputValue(`Regarding "${q}": `)}
                              className="w-full text-left p-1.5 rounded bg-white dark:bg-neutral-900 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-neutral-800 dark:text-neutral-200 hover:border-amber-400 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                            >
                              <span className="truncate">{q}</span>
                              <span className="text-[10px] text-amber-600 font-semibold shrink-0">
                                Answer &rarr;
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[9px] text-neutral-400 font-mono px-1">
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAgent && (
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center shrink-0 text-xs mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono py-1 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>Ghostwriter is thinking...</span>
              </div>
            )}
          </div>

          {/* User Input Bar */}
          <div className="p-2.5 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
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
                placeholder="Tell your story or reply to questions..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-40 shrink-0"
              >
                <span>Send</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Live Draft Output Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          {!draft ? (
            <div className="h-full min-h-[360px] bg-neutral-50 dark:bg-neutral-900/40 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
              <FileText className="w-8 h-8 text-neutral-400" />
              <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                Letter Draft
              </h4>
              <p className="text-[11px] text-neutral-400 max-w-xs">
                Your draft will appear here after sharing your story.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs flex flex-col space-y-3 h-[540px]">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Draft Preview</span>
                </div>
                <button
                  onClick={() => handleCopyDraft(`${draft.salutation}\n\n${draft.body}\n\n${draft.signOff}`)}
                  className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs flex items-center gap-1 cursor-pointer"
                  title="Copy text"
                >
                  {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Subject */}
              <div className="bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs shrink-0">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {draft.subject}
                </span>
              </div>

              {/* Letter Body Preview */}
              <div className="flex-1 overflow-y-auto p-3 bg-amber-50/20 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-letter leading-relaxed space-y-2.5">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {draft.salutation}
                </div>
                <div className="whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                  {draft.body}
                </div>
                <div className="font-semibold text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap pt-1">
                  {draft.signOff}
                </div>
              </div>

              {/* Primary Action Button: Transfer to Stationery Sheet */}
              <button
                onClick={() => onApplyDraftToLetter(draft)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span>Apply to Stationery Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
