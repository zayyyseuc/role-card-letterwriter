import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  FileText,
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Laugh,
} from 'lucide-react';
import { AgentTestRunResult } from '../types/letter';

interface AgentTestRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDraft: (draft: {
    subject: string;
    salutation: string;
    body: string;
    signOff: string;
  }) => void;
}

const TEST_SCRIPTS = [
  {
    id: 'berkeley-departure',
    title: 'Test 1: UC Berkeley Departure & Filial Apology',
    desc: 'Tests expression retention ("gluing cardboard together at 2 AM"), Korean-American immigrant family context, and cheerful tone.',
    prompt: `Hey ghostwriter! I need to write an apology letter to my mom. I just moved 350 miles up to Berkeley from SoCal for my master's in design. She was worried I wouldn't eat well or that design isn't a serious thing compared to doctor or lawyer. Tell her I'm sorry for leaving her alone with Dad, my brother, Grandma, and our dog Choco, but make sure she knows I love her and I'm eating her frozen mandu. Use my phrase "gluing cardboard together at 2 AM".`,
  },
  {
    id: 'sunday-dinner-call',
    title: 'Test 2: Missed Sunday Call & Kimchi Stew',
    desc: 'Tests de-escalating maternal worry with lighthearted humor and reassuring concrete promises (calling twice Wednesday).',
    prompt: `I missed mom's Sunday evening FaceTime call because our studio crit went until 10 PM. She thinks I am ignoring the family. Write an apology that makes her laugh, mentions that studio was freezing cold, and promises I will call twice this Wednesday.`,
  },
  {
    id: 'choco-grandma-scraps',
    title: 'Test 3: Checking on Grandma & Dog Choco',
    desc: 'Tests Korean household cultural dynamics (Grandma feeding Choco kalbi bones under the table) with affectionate comedy.',
    prompt: `Write a short warm note checking in on how Grandma is doing with Choco. Tell mom I'm sorry I'm not there to walk Choco, but warn her not to let Grandma feed him spicy kimchi or kalbi bones under the kitchen table. Keep it funny and loving.`,
  },
  {
    id: 'vagueness-boundary-check',
    title: 'Test 4: Boundary & Vagueness Check (Negative/Gate Test)',
    desc: 'Crucial gate test: Verifies that agent does NOT hallucinate details on vague input and triggers Clarifying Questions (Stage 3).',
    prompt: `Hey, write a letter to mom. I did something and feel bad. Make it funny.`,
  },
];

export const AgentTestRunner: React.FC<AgentTestRunnerProps> = ({
  isOpen,
  onClose,
  onApplyDraft,
}) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>('berkeley-departure');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<Record<string, AgentTestRunResult>>({});
  const [activeTab, setActiveTab] = useState<'single' | 'summary'>('single');

  if (!isOpen) return null;

  const handleRunTest = async (scriptId: string) => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/agent/run-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testPromptId: scriptId }),
      });
      const data: AgentTestRunResult = await res.json();
      setResults((prev) => ({ ...prev, [scriptId]: data }));
    } catch (err) {
      console.error('Test prompt execution failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunAll = async () => {
    setIsRunning(true);
    for (const script of TEST_SCRIPTS) {
      try {
        const res = await fetch('/api/agent/run-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testPromptId: script.id }),
        });
        const data: AgentTestRunResult = await res.json();
        setResults((prev) => ({ ...prev, [script.id]: data }));
      } catch (e) {
        console.error(e);
      }
    }
    setIsRunning(false);
  };

  const currentResult = results[selectedScriptId];
  const activeScript = TEST_SCRIPTS.find((s) => s.id === selectedScriptId) || TEST_SCRIPTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Agent Test Bench
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAll}
              disabled={isRunning}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run All</span>
            </button>


            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Script Selection Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 p-2 gap-2 shrink-0">
          {TEST_SCRIPTS.map((script) => {
            const isSelected = selectedScriptId === script.id;
            const res = results[script.id];
            return (
              <button
                key={script.id}
                onClick={() => setSelectedScriptId(script.id)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-neutral-900 border-amber-400 dark:border-amber-500 shadow-xs ring-1 ring-amber-400/30'
                    : 'bg-transparent border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 truncate">
                    {script.title.split(':')[0]}
                  </span>
                  {res && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        res.verdict === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : res.verdict === 'PARTIAL'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {res.verdict}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-500 line-clamp-2 leading-tight">
                  {script.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Test Details Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Active Script Prompt Card */}
          {(() => {
            const activeScript = TEST_SCRIPTS.find((s) => s.id === selectedScriptId)!;
            return (
              <div className="bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                      {activeScript.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500">{activeScript.desc}</p>
                  </div>

                  <button
                    onClick={() => handleRunTest(selectedScriptId)}
                    disabled={isRunning}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-900 dark:text-white bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer disabled:opacity-50"
                  >
                    {isRunning ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>Execute Script</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-700 dark:text-neutral-300">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Standardized User Prompt:
                  </span>
                  &ldquo;{activeScript.prompt}&rdquo;
                </div>
              </div>
            );
          })()}

          {/* Execution Result View */}
          {currentResult ? (
            <div className="space-y-6">
              {/* Verdict & Rule Check Rubric */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-800 dark:text-neutral-200">
                      Behavioral Rule Rubric Verification
                    </span>
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        currentResult.verdict === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      Overall Verdict: {currentResult.verdict}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(currentResult.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Rubric Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentResult.checks.map((chk, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs space-y-1 ${
                        chk.passed
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200'
                          : 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-800/60 text-red-950 dark:text-red-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        {chk.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                        <span>{chk.rule}</span>
                      </div>
                      <p className="text-[11px] opacity-80 pl-6">{chk.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Reply & Output Draft */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Agent Reply (5 cols) */}
                <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide font-mono">
                    <Laugh className="w-4 h-4 text-amber-500" />
                    <span>Ghostwriter Agent Reply</span>
                  </div>
                  <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-800/60 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    {currentResult.agentReply}
                  </div>

                  {currentResult.clarifyingQuestions && currentResult.clarifyingQuestions.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs space-y-1.5">
                      <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Clarifying Questions Asked (Vagueness Gate Triggered):</span>
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                        {currentResult.clarifyingQuestions?.map((q: string, qI: number) => (
                          <li key={qI}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Draft Produced (7 cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide font-mono">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <span>Letter Draft Produced</span>
                    </div>

                    {currentResult.draftProduced && (
                      <button
                        onClick={() => {
                          if (currentResult.draftProduced) {
                            onApplyDraft(currentResult.draftProduced);
                            onClose();
                          }
                        }}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>Apply to Stationery</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {currentResult.draftProduced ? (
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                          Subject:
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {currentResult.draftProduced.subject}
                        </span>
                      </div>

                      <div className="p-3 bg-amber-50/20 dark:bg-neutral-950/60 rounded-lg border border-neutral-200 dark:border-neutral-800 font-letter max-h-[260px] overflow-y-auto leading-relaxed whitespace-pre-wrap text-neutral-800 dark:text-neutral-200">
                        <p className="font-semibold mb-2">{currentResult.draftProduced.salutation}</p>
                        <p>{currentResult.draftProduced.body}</p>
                        <p className="font-semibold mt-3">{currentResult.draftProduced.signOff}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 space-y-2">
                      <HelpCircle className="w-8 h-8 text-amber-500 mx-auto" />
                      <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                        No Draft Output (Correct Gate Behavior)
                      </p>
                      <p className="text-[11px] max-w-sm mx-auto">
                        Because this test deliberately provided vague input, the agent halted draft generation to ask clarifying questions as mandated by Behavioral Rule 4 and Boundaries.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-950/40 rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
              <ShieldCheck className="w-10 h-10 text-neutral-400 mx-auto" />
              <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Ready to Execute {activeScript.title.split(':')[0]}
              </h4>
              <p className="max-w-md mx-auto text-[11px] leading-relaxed">
                Click &ldquo;Execute Script&rdquo; to send the standardized prompt to the agent, evaluate rubric adherence, verify boundary constraints, and inspect the resulting letter.
              </p>
              <button
                onClick={() => handleRunTest(selectedScriptId)}
                disabled={isRunning}
                className="px-4 py-2 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors cursor-pointer"
              >
                Execute Test Now
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 shrink-0">
          <div className="text-xs text-neutral-500 font-mono">
            {Object.keys(results).length} of {TEST_SCRIPTS.length} scripts executed
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Test Bench
          </button>
        </div>
      </div>
    </div>
  );
};
