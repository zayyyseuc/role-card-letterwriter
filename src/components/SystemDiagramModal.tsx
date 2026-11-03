import React, { useState } from 'react';
import {
  X,
  Layers,
  Sparkles,
  GitCommit,
  ShieldCheck,
  HeartHandshake,
  MessageSquare,
  FileText,
  Compass,
  ArrowRight,
  HelpCircle,
  Laugh,
  CheckCircle2,
  AlertTriangle,
  User,
  Cpu,
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSpecTab, setActiveSpecTab] = useState<
    'diagram' | 'intent' | 'journeys' | 'rolecard' | 'loop'
  >('diagram');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Agent Specifications & System Architecture
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  v2.4 Active
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Humorous Apology Ghostwriter &bull; Heeje Lee Knowledge Base &bull; 6-Step Interaction Loop
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-6 gap-2 shrink-0 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveSpecTab('diagram')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSpecTab === 'diagram'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive System Diagram</span>
          </button>

          <button
            onClick={() => setActiveSpecTab('intent')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSpecTab === 'intent'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Design Intent</span>
          </button>

          <button
            onClick={() => setActiveSpecTab('journeys')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSpecTab === 'journeys'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User Journeys (Narratives)</span>
          </button>

          <button
            onClick={() => setActiveSpecTab('rolecard')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSpecTab === 'rolecard'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role Card (System Instructions)</span>
          </button>

          <button
            onClick={() => setActiveSpecTab('loop')}
            className={`py-3 px-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeSpecTab === 'loop'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-semibold'
                : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
            }`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span>6-Step Interaction Loop</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SYSTEM ARCHITECTURE DIAGRAM */}
          {activeSpecTab === 'diagram' && (
            <div className="space-y-6">
              <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">System Architecture Overview:</strong> The application bridges Heeje Lee&apos;s raw family anecdotes with a stateful Gemini 3.8 Flash agent governed by the Humorous Apology Role Card. The diagram below illustrates how user prompts pass through vagueness detection, grounding against the Korean-American family knowledge base, and render reactively onto archival stationery.
                </div>
              </div>

              {/* Visual System Flow Chart */}
              <div className="bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 overflow-x-auto">
                <div className="min-w-[760px] flex flex-col gap-6">
                  {/* Row 1: Client Inputs */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Node 1 */}
                    <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-300 dark:border-neutral-700 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wide font-mono mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>1. User Story Intake</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Heeje submits freeform stories, feelings of filial guilt, or chooses a standardized test scenario (e.g. Berkeley departure, missing Sunday dinner).
                      </p>
                    </div>

                    {/* Node 2 */}
                    <div className="bg-white dark:bg-neutral-900 border-2 border-amber-300 dark:border-amber-800 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide font-mono mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>2. Vagueness & Boundary Gate</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        <strong>Rule Check:</strong> If situation or terminology is vague, halt draft generation and trigger clarifying questions. Strictly forbid hallucinating facts.
                      </p>
                    </div>

                    {/* Node 3 */}
                    <div className="bg-white dark:bg-neutral-900 border-2 border-purple-300 dark:border-purple-800 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wide font-mono mb-1">
                        <HeartHandshake className="w-3.5 h-3.5 text-purple-500" />
                        <span>3. Grounding Knowledge Base</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Injects Heeje Lee context: Dad, Mom (Omma), brother, Grandma (Halmoni), dog (Choco), SoCal immigrant background &rarr; UC Berkeley MDes.
                      </p>
                    </div>
                  </div>

                  {/* Flow Connector Line */}
                  <div className="flex items-center justify-center gap-4 text-xs font-mono text-neutral-400">
                    <span className="h-px bg-neutral-300 dark:bg-neutral-700 flex-1" />
                    <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[11px]">
                      REST API: /api/agent/chat &bull; /api/agent/run-test
                    </span>
                    <span className="h-px bg-neutral-300 dark:bg-neutral-700 flex-1" />
                  </div>

                  {/* Row 2: Orchestration & AI Engine */}
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Left: Gemini Engine Core (8 cols) */}
                    <div className="col-span-8 bg-linear-to-br from-neutral-900 to-neutral-800 text-white rounded-xl p-5 border border-neutral-700 shadow-md space-y-3">
                      <div className="flex items-center justify-between border-b border-neutral-700 pb-2">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider">
                            Gemini 3.8 Flash Agent Orchestration
                          </span>
                        </div>
                        <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-mono">
                          System Instruction Enforced
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-neutral-800/80 rounded-lg p-2.5 border border-neutral-700">
                          <strong className="text-amber-300 block mb-1">Emotional Thermostat</strong>
                          <p className="text-[11px] text-neutral-300 leading-relaxed">
                            Maintains cheerful, lighthearted, warm, and loving tone. Prevents letter from sounding like a legal notice or tragic melodrama.
                          </p>
                        </div>
                        <div className="bg-neutral-800/80 rounded-lg p-2.5 border border-neutral-700">
                          <strong className="text-emerald-300 block mb-1">User Expression Retainer</strong>
                          <p className="text-[11px] text-neutral-300 leading-relaxed">
                            Detects authentic vernacular (&quot;gluing cardboard&quot;, &quot;frozen mandu&quot;, &quot;secret kalbi&quot;) and embeds them directly.
                          </p>
                        </div>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-2 pt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>State Machine: Stage 1 (Intake) &rarr; Stage 2 (Interpret) &rarr; Stage 3 (Clarify) &rarr; Stage 4 (Draft) &rarr; Stage 5 (Confirm) &rarr; Stage 6 (Cohesive Polish)</span>
                      </div>
                    </div>

                    {/* Right: Decision Split Branch (4 cols) */}
                    <div className="col-span-4 flex flex-col gap-3">
                      <div className="bg-amber-100/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 font-mono text-[11px] mb-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Branch A: Clarification</span>
                        </div>
                        <p className="text-[10px] text-amber-800 dark:text-amber-300/80">
                          Outputs warm, probing questions to flesh out family nuances without assuming.
                        </p>
                      </div>

                      <div className="bg-emerald-100/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 rounded-xl p-3 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 font-mono text-[11px] mb-1">
                          <Laugh className="w-3.5 h-3.5" />
                          <span>Branch B: Humorous Draft</span>
                        </div>
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-300/80">
                          Generates letter draft: subject line, filial salutation, body paragraphs, and affectionate close.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Flow Connector Line */}
                  <div className="flex items-center justify-center gap-4 text-xs font-mono text-neutral-400">
                    <span className="h-px bg-neutral-300 dark:bg-neutral-700 flex-1" />
                    <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[11px]">
                      Reactive Frontend State & Storage
                    </span>
                    <span className="h-px bg-neutral-300 dark:bg-neutral-700 flex-1" />
                  </div>

                  {/* Row 3: Presentation & User Application Layer */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide font-mono mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        <span>Interactive Agent Chat</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Multi-turn conversational feed with quick-reply clarification chips, stage indicators, and humor technique breakdown.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide font-mono mb-1">
                        <FileText className="w-3.5 h-3.5 text-amber-500" />
                        <span>Archival Stationery Sheet</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Physical letter sheet with Lee Family letterhead, Korean postal stamp styling, print stylesheets, and PDF dispatch.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide font-mono mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Automated Test Bench</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        One-click test suite executing standardized prompts to benchmark role-rule compliance, latency, and boundary integrity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESIGN INTENT */}
          {activeSpecTab === 'intent' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-mono uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-500" />
                  <span>Design Intent: Emotional Architecture for Filial Correspondence</span>
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  The fundamental design intent of this agent is to resolve a profound emotional contradiction common in immigrant families: a child embarking on personal ambition feels an acute sense of filial guilt for leaving the parental nest, yet writing a purely somber, tearful apology would alarm the mother and create unnecessary drama.
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Instead, our ghostwriter serves as an <strong>emotional thermostat</strong>. By infusing affectionate, self-deprecating humor (juxtaposing the gravity of design school against the reality of cutting cardboard at 2:00 AM) with sincere gratitude, the agent produces letters that elicit laughter, reassure maternal anxiety about starvation, and elevate the sacred mother-son bond.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      1. The Zero-Drama Calibration
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Traditional apology generators default to stiff corporate regret or theatrical sorrow. Our agent strictly enforces a cheerful, lighthearted, and loving persona that communicates: &ldquo;I am sorry I am not at the dinner table, but I am thriving and so grateful for you.&rdquo;
                    </p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      2. Clarification Before Hallucination
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      The agent treats user ambiguity with utmost respect. If the user writes a vague note, the agent does NOT invent fake stories or assume family drama. It pauses at Step 3 to ask thoughtful, gentle clarifying questions.
                    </p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      3. Authentic Vernacular Retention
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Korean-American family communication is rich with specific inside jokes (the TV remote, frozen mandu, Grandma secretly sneaking kalbi to the dog). The agent captures the user&apos;s exact phrases verbatim.
                    </p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      4. Seamless Tangible Output
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      A digital message is easily lost in chat threads. The system connects the conversational ghostwriter directly to an archival stationery preview sheet so Heeje can print a real physical letter for his mom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USER JOURNEYS */}
          {activeSpecTab === 'journeys' && (
            <div className="space-y-6">
              {/* Journey 1: The Hero's Journey Narrative */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span>Narrative Journey 1: The Hero&apos;s Journey (Emotional Arc)</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                    Framework: Joseph Campbell Narrative Arc
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="border-l-2 border-blue-500 pl-4 py-1 space-y-1">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      1. The Departure &amp; The Ordinary World Shattered
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Heeje packs his compact car in Southern California and drives 350 miles up Interstate 5 to Berkeley. Back home, his mother is left caring for Dad, his younger brother, his grandmother, and their lively dog Choco. Heeje arrives in his bare student studio apartment smelling of wet paint and instant noodles.
                    </p>
                  </div>

                  <div className="border-l-2 border-amber-500 pl-4 py-1 space-y-1">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      2. The Abyss of Filial Guilt &amp; Writer&apos;s Block
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Mom calls on Sunday with her characteristic mixture of worry and love: &ldquo;Are you eating rice? Why does your master&apos;s degree require glue guns? Did you sleep?&rdquo; Heeje wants to write her a letter, but whenever he types &ldquo;I am sorry for leaving,&rdquo; it feels too heavy and alarming. He deletes his draft three times.
                    </p>
                  </div>

                  <div className="border-l-2 border-purple-500 pl-4 py-1 space-y-1">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      3. Meeting the Ghostwriter Mentor
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Heeje opens VerbaForm and engages the Humorous Apology Ghostwriter. Instead of generating sterile corporate prose, the agent speaks to him with warmth and cheer. When Heeje simply types: &ldquo;I moved to Berkeley and feel bad about Mom dealing with everyone,&rdquo; the agent recognizes ambiguity and asks clarifying questions: &ldquo;What does Dad do when you&apos;re not there? Is Grandma sneaking food to Choco?&rdquo;
                    </p>
                  </div>

                  <div className="border-l-2 border-emerald-500 pl-4 py-1 space-y-1">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      4. The Revelation &amp; Masterpiece Draft
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Heeje laughs and types: &ldquo;Dad loses the TV remote every hour, Grandma feeds Choco kalbi under the table pretending she doesn&apos;t know English, and Mom thinks I am starving.&rdquo; The agent instantly weaves these exact memories into a gorgeous, playful draft.
                    </p>
                  </div>

                  <div className="border-l-2 border-neutral-500 pl-4 py-1 space-y-1">
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      5. Return with the Elixir (The Physical Letter)
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Heeje clicks &ldquo;Apply to Stationery Sheet&rdquo;, reviews the elegant typography on cream paper, and prints it to mail home. When Mom reads it in SoCal, she laughs out loud in the kitchen, wipes a proud tear, and sticks it on the refrigerator.
                    </p>
                  </div>
                </div>
              </div>

              {/* Journey 2: Jobs-To-Be-Done (JTBD) */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Narrative Journey 2: Jobs-To-Be-Done (JTBD)</span>
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Framework: Outcome-Driven JTBD
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">Functional Job</strong>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Draft a complete formal letter formatted with date, salutation, coherent paragraphs, and sign-off that can be dispatched or printed with zero manual formatting friction.
                    </p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">Emotional Job</strong>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Relieve the heavy burden of filial guilt without diminishing the legitimacy of pursuing an unconventional master&apos;s degree in design.
                    </p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                    <strong className="text-neutral-900 dark:text-neutral-100 block mb-1">Social Job</strong>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Provide a heartwarming token of filial piety that Mom can cherish, share with Grandma, or show family members as proof of her son&apos;s devotion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ROLE CARD SYSTEM INSTRUCTIONS */}
          {activeSpecTab === 'rolecard' && (
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 font-mono text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">
                      SYSTEM INSTRUCTION SPECIFICATION: ROLE CARD
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500">Target Model: gemini-3.8-flash</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase">Role Name</span>
                      <p className="text-neutral-900 dark:text-neutral-100 font-bold">Humorous Apology Ghostwriter</p>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase">Purpose</span>
                      <p className="text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
                        Help the user clearly articulate their thoughts and add a sense of humor to an apology letter. Set the right tone and emotional temperature for the user&apos;s intended message.
                      </p>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase">Engagement Context</span>
                      <p className="text-neutral-700 dark:text-neutral-300 text-[11px] leading-relaxed">
                        The user wanted to write a letter to his mother about leaving home to pursue graduate education. The letter was not meant to be entirely apologetic, but rather to leave a warm and loving message for his mother.
                      </p>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase">Behavioral Rules</span>
                      <ul className="text-neutral-700 dark:text-neutral-300 text-[11px] list-disc list-inside space-y-1">
                        <li>Ensure that the letter aligns with the user&apos;s intentions.</li>
                        <li>Personality should be cheerful, lighthearted, warm, and loving.</li>
                        <li>Specific expressions provided by the user MUST be reflected directly in the letter.</li>
                        <li>ALWAYS ask clarifying questions when situations, descriptions, or terminology are vague.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase">Knowledge Base</span>
                      <ul className="text-neutral-700 dark:text-neutral-300 text-[11px] list-disc list-inside space-y-1">
                        <li><strong>Client Name:</strong> Heeje Lee</li>
                        <li><strong>Family &amp; Relationships:</strong> father, mother (Omma), one brother, grandmother (Halmoni), dog (Choco)</li>
                        <li><strong>Background:</strong> immigrant family from South Korea in Southern California</li>
                        <li><strong>Situation:</strong> Heeje left home in SoCal to pursue his master&apos;s in design at UC Berkeley</li>
                      </ul>
                    </div>

                    <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-2.5 rounded-lg">
                      <span className="text-red-700 dark:text-red-400 text-[10px] uppercase font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Boundaries &amp; Does Not Do
                      </span>
                      <ul className="text-red-900 dark:text-red-300 text-[11px] list-disc list-inside mt-1 space-y-0.5">
                        <li>Do not interpret situations or emotions beyond what the user provided without asking.</li>
                        <li>DO NOT make up stories, facts, or feelings.</li>
                        <li>DO NOT become overly serious in tone.</li>
                      </ul>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] uppercase">Outputs</span>
                      <p className="text-neutral-700 dark:text-neutral-300 text-[11px]">
                        Clarifying questions &bull; A well-drafted letter that sounds authentically like the user.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 6-STEP INTERACTION LOOP */}
          {activeSpecTab === 'loop' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono uppercase tracking-wider flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-emerald-500" />
                  <span>The 6-Step Interaction Loop Lifecycle</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      Step 1
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      User Tells a Story
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      The user describes what happened: leaving home, missing a call, or feeling guilty about their departure.
                    </p>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Step 2
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      Assistant Considers Interpretations
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      The assistant maps the emotional temperature: Is this an affectionate apology? What humorous levers can lighten the mood?
                    </p>
                  </div>

                  <div className="border border-amber-300 dark:border-amber-800/80 rounded-xl p-4 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Step 3 (Critical Gate)
                    </span>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Assistant Asks Clarifying Questions
                    </h5>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300/80 leading-relaxed">
                      If situations or descriptions are vague, the assistant halts draft generation and asks precise clarifying questions.
                    </p>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Step 4
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      Writes Rough Draft in Voice
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Once details are clear, the assistant generates a rough draft in the intended cheerful, loving, and funny voice.
                    </p>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      Step 5
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      Asks for Confirmation
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Presents the draft to Heeje, asking if the family jokes feel authentic and if any wording needs adjustment.
                    </p>
                  </div>

                  <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 bg-neutral-50/60 dark:bg-neutral-800/40 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      Step 6
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      Makes Edits &amp; Ensures Cohesion
                    </h5>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Applies user tweaks, ensures perfect emotional flow, and binds the final text to the archival stationery sheet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
            <span>Client: Heeje Lee &bull; Role: Humorous Apology Ghostwriter</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
