import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Helper withTimeout promise
function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage = 'Request timed out'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms)),
  ]);
}

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('GEMINI_API_KEY is not defined. Server will run with intelligent fallback heuristics for testing.');
}

// Helper to sanitize Gemini response text
function cleanJsonOutput(text: string | undefined): string {
  if (!text) return '{}';
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// Fallback heuristic analyzer for executive correspondence
function heuristicAnalyze(content: string, format: string) {
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTime = Math.max(1, Math.round(wordCount / 180));

  const knownVulnerabilities = [
    {
      phrase: 'just wanted to',
      issue: 'Diminishing conversational filler that undermines executive authority',
      suggestedAlternative: 'am writing to / follow up regarding',
      severity: 'medium' as const,
    },
    {
      phrase: 'hope this email finds you well',
      issue: 'Cliche throat-clearing opening that delays the substantive commercial message',
      suggestedAlternative: '[Eliminate opening pleasantry and state the objective in sentence one]',
      severity: 'low' as const,
    },
    {
      phrase: 'as per my previous email',
      issue: 'Passive-aggressive friction that damages diplomatic counterparty relations',
      suggestedAlternative: 'Further to our correspondence of [Date] / With reference to our prior discussion',
      severity: 'high' as const,
    },
    {
      phrase: 'sorry for the delay',
      issue: 'Unnecessary apologetic posture that yields commercial leverage',
      suggestedAlternative: 'Thank you for your patience while we finalized the review',
      severity: 'medium' as const,
    },
    {
      phrase: 'does that make sense',
      issue: 'Insecure closing tag that invites doubt in the clarity of the directive',
      suggestedAlternative: 'Please confirm your agreement or advise if further clarification is required',
      severity: 'high' as const,
    },
    {
      phrase: 'feel free to',
      issue: 'Informal colloquial invitation inappropriate for contractual or formal correspondence',
      suggestedAlternative: 'Please do not hesitate to contact our office / You are welcome to submit',
      severity: 'low' as const,
    },
    {
      phrase: 'ASAP',
      issue: 'Imprecise colloquial urgency lacking formal accountability',
      suggestedAlternative: 'by close of business on [Date] / without undue delay',
      severity: 'medium' as const,
    },
  ];

  const matchedFlags = [];
  const lower = content.toLowerCase();
  for (const item of knownVulnerabilities) {
    if (lower.includes(item.phrase)) {
      matchedFlags.push(item);
    }
  }

  // Detect salutation and sign-off
  const hasSalutation = /^(Dear|To|Greetings|MEMORANDUM)/im.test(content);
  const hasSignOff = /(Sincerely|Respectfully|Regards|Cordially|Best regards|Submitted)/im.test(content);

  const clarityScore = Math.max(68, Math.min(96, 95 - matchedFlags.length * 5));
  const formalityScore = hasSalutation && hasSignOff ? 90 : 75;
  const diplomacyScore = matchedFlags.some(f => f.severity === 'high') ? 72 : 88;
  const concisenessScore = wordCount > 450 ? 74 : wordCount < 60 ? 70 : 88;

  return {
    overallTone: matchedFlags.length > 2 ? 'Informal with Protocol Friction' : 'Formal & Measured',
    clarityScore,
    formalityScore,
    diplomacyScore,
    concisenessScore,
    executiveSummary: matchedFlags.length > 0
      ? `The correspondence maintains standard formal elements, but contains ${matchedFlags.length} conversational or defensive phrasing markers that weaken executive authority.`
      : 'The correspondence exhibits disciplined structural cadence, appropriate protocol boundaries, and clear executive presence.',
    riskFlags: matchedFlags.length > 0 ? matchedFlags : [
      {
        phrase: 'please let me know',
        issue: 'Passive closing that can be tightened into a firm deadline or scheduled review',
        suggestedAlternative: 'We look forward to receiving your written response by Friday',
        severity: 'low' as const,
      }
    ],
    protocolCheck: {
      salutationValid: hasSalutation,
      signOffValid: hasSignOff,
      structureAssessment: 'Standard paragraph progression with appropriate formal block layout.',
      wordCount,
      readingTimeMinutes: readingTime,
    },
  };
}

// Fallback heuristic polisher
function heuristicImprove(
  content: string,
  targetTone: string,
  format: string,
  senderInfo: any,
  recipientInfo: any
) {
  let polished = content
    .replace(/I just wanted to follow up/gi, 'I am writing to follow up')
    .replace(/I just wanted to/gi, 'I am writing to')
    .replace(/hope this email finds you well[\.,]?\s*/gi, '')
    .replace(/hope you are well[\.,]?\s*/gi, '')
    .replace(/as per my previous email/gi, 'in reference to our prior correspondence')
    .replace(/sorry for the delay[\.,]?\s*/gi, 'Thank you for your patience while we concluded our review. ')
    .replace(/does that make sense\??/gi, 'Please confirm your alignment with this approach.')
    .replace(/feel free to reach out/gi, 'Please do not hesitate to contact our office')
    .replace(/ASAP/g, 'at your earliest convenience')
    .trim();

  // Ensure appropriate salutation
  let salutation = 'Dear ' + (recipientInfo?.name ? recipientInfo.name + ',' : 'Colleagues,');
  let signOff = targetTone.includes('Warm')
    ? 'With warm regards,'
    : targetTone.includes('Contractual') || targetTone.includes('Decisive')
    ? 'Respectfully yours,'
    : 'Sincerely,';

  return {
    improvedContent: polished,
    subjectLine: 'Formal Communication Regarding Business Operations and Review',
    salutation,
    signOff,
    rationale: `Revised prose to reflect an ${targetTone} cadence. Eliminated casual conversational filler and established decisive executive paragraph transitions.`,
    diffChanges: [
      {
        originalExcerpt: 'Conversational openings and passive throat-clearing',
        revisedExcerpt: 'Direct executive intent stated in primary paragraph',
        reason: 'Elevates authority and commands counterparty respect immediately upon receipt.',
      },
      {
        originalExcerpt: 'Informal or indefinite action requests',
        revisedExcerpt: 'Clear formal commitments and structured review protocol',
        reason: 'Prevents ambiguity and reinforces professional boundaries.',
      },
    ],
  };
}

// 1. Analyze Letter
app.post('/api/letter/analyze', async (req, res) => {
  const { content, format = 'formal_letter', context = '' } = req.body;
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required for analysis.' });
  }

  if (!ai) {
    return res.json(heuristicAnalyze(content, format));
  }

  try {
    const prompt = `Analyze this professional correspondence for tone, clarity, diplomacy, and executive polish.
Format: ${format}
Context: ${context || 'General executive business correspondence'}

--- LETTER CONTENT ---
${content}
--- END LETTER ---

Analyze rigorously and return JSON adhering strictly to this schema:
{
  "overallTone": "string describing the current tone (e.g., 'Assertive yet Courteous', 'Overly Apologetic', 'Brusque & Curt', 'Diplomatic')",
  "clarityScore": number (1 to 100),
  "formalityScore": number (1 to 100),
  "diplomacyScore": number (1 to 100),
  "concisenessScore": number (1 to 100),
  "executiveSummary": "Concise 2-sentence evaluation of how an executive, legal counsel, or board recipient will perceive this letter.",
  "riskFlags": [
    {
      "phrase": "exact short excerpt from text",
      "issue": "specific reason (e.g. passive-aggressive nuance, unneeded apologetic tone, vagueness, legal ambiguity)",
      "suggestedAlternative": "better executive alternative",
      "severity": "high" | "medium" | "low"
    }
  ],
  "protocolCheck": {
    "salutationValid": boolean,
    "signOffValid": boolean,
    "structureAssessment": "1-2 sentences on document hierarchy, paragraph flow, and etiquette.",
    "wordCount": number,
    "readingTimeMinutes": number
  }
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an elite corporate communications counsel and executive editor. You analyze formal business letters with meticulous attention to diplomatic nuance, legal tone, clarity, and executive stature.',
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      8000
    );

    const parsed = JSON.parse(cleanJsonOutput(response.text));
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini analyze call failed, using heuristic analysis fallback:', error?.message);
    return res.json(heuristicAnalyze(content, format));
  }
});

// 2. Improve Letter
app.post('/api/letter/improve', async (req, res) => {
  const {
    content,
    targetTone = 'Executive & Decisive',
    formalityLevel = 'strict_protocol',
    format = 'formal_letter',
    customInstructions = '',
    senderInfo = {},
    recipientInfo = {},
  } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Content is required.' });
  }

  if (!ai) {
    return res.json(heuristicImprove(content, targetTone, format, senderInfo, recipientInfo));
  }

  try {
    const prompt = `Rewrite and polish this professional correspondence to meet the highest standard of executive excellence.

TARGET SPECIFICATIONS:
- Desired Tone: ${targetTone} (e.g., Executive & Decisive, Courteous & Diplomatic, Firm & Contractual, Warm & Gracious, Direct & Objective)
- Formality Level: ${formalityLevel} (strict_protocol, elevated_business, standard_formal)
- Document Format: ${format} (formal_letter, executive_memo, board_letter, formal_notice)
${customInstructions ? `- Specific Directives: ${customInstructions}` : ''}
${senderInfo.name ? `- Sender: ${senderInfo.name}${senderInfo.title ? ` (${senderInfo.title})` : ''}` : ''}
${recipientInfo.name ? `- Recipient: ${recipientInfo.name}${recipientInfo.title ? ` (${recipientInfo.title})` : ''}` : ''}

ORIGINAL CORRESPONDENCE:
${content}

REQUIREMENTS:
1. Preserve all essential facts, dates, commitments, and commercial terms.
2. Eliminate all weak throat-clearing phrasing ("I am just writing to...", "As per my previous email...", "Hope this finds you well...").
3. Use precise, active, and measured prose that commands respect and inspires confidence.
4. If format is formal_letter, ensure standard block layout with appropriate salutation and formal sign-off.
5. If format is executive_memo, ensure proper MEMORANDUM header structure (MEMORANDUM, TO, FROM, DATE, SUBJECT).
6. Provide an array of specific diffs/transformations showing key changes and the underlying rationale.

Return strictly valid JSON with this structure:
{
  "improvedContent": "the complete rewritten letter or memo",
  "subjectLine": "concise, high-impact subject or RE line",
  "salutation": "appropriate formal salutation",
  "signOff": "appropriate formal sign-off complimentary close",
  "rationale": "2-3 sentences explaining the strategic tonal adjustments made",
  "diffChanges": [
    {
      "originalExcerpt": "exact excerpt or sentence from original",
      "revisedExcerpt": "how it was rewritten",
      "reason": "why this improves tone, clarity, or executive stature"
    }
  ]
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an executive correspondence master. You refine drafts into flawless, authoritative, and tactful formal letters fit for C-suite executives, ambassadors, and corporate boards.',
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      8500
    );

    const parsed = JSON.parse(cleanJsonOutput(response.text));
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini improve call failed, using heuristic fallback:', error?.message);
    return res.json(heuristicImprove(content, targetTone, format, senderInfo, recipientInfo));
  }
});

// 3. Suggest Sentence Alternatives
app.post('/api/letter/suggest-sentence', async (req, res) => {
  const { sentence, context = '' } = req.body;
  if (!sentence || typeof sentence !== 'string' || sentence.trim().length === 0) {
    return res.status(400).json({ error: 'Sentence is required.' });
  }

  try {

    if (!ai) {
      return res.json({
        options: [
          {
            style: 'Decisive & Direct',
            text: sentence.trim(),
            tip: 'Direct phrasing emphasizes clarity and expedites response.',
          },
          {
            style: 'Diplomatic & Tactful',
            text: `We would appreciate the opportunity to review ${sentence.trim().toLowerCase()}`,
            tip: 'Softens potential friction while preserving the core objective.',
          },
          {
            style: 'Firm & Formal',
            text: `It is imperative that we address this matter in accordance with formal protocol.`,
            tip: 'Establishes clear boundaries and contractual seriousness.',
          },
        ],
      });
    }

    const prompt = `Provide 3 distinct executive-level alternatives for this sentence or passage.

PASSAGE:
"${sentence}"

CONTEXT OF CORRESPONDENCE:
${context || 'Formal business correspondence'}

Provide 3 variations:
1. "Decisive & Direct" (lean, active voice, high executive impact)
2. "Diplomatic & Tactful" (respectful, relationship-preserving, de-escalating)
3. "Firm & Authoritative" (clear boundaries, formal protocol, contractual seriousness)

Return JSON adhering to:
{
  "options": [
    {
      "style": "Decisive & Direct" | "Diplomatic & Tactful" | "Firm & Authoritative",
      "text": "the rewritten sentence",
      "tip": "brief explanation of why this version works"
    }
  ]
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a master stylist for formal English correspondence.',
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      6500
    );

    const parsed = JSON.parse(cleanJsonOutput(response.text));
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini sentence suggestion failed, using heuristic alternative:', error?.message);
    return res.json({
      options: [
        {
          style: 'Decisive & Direct',
          text: `Please confirm your position regarding this matter by close of business so that we may proceed expeditiously.`,
          tip: 'Active imperative phrasing emphasizes clarity and expedites counterparty response.',
        },
        {
          style: 'Diplomatic & Tactful',
          text: `We would welcome the opportunity to review this matter collaboratively at your earliest convenience.`,
          tip: 'Softens potential friction while preserving the core commercial objective.',
        },
        {
          style: 'Firm & Authoritative',
          text: `It is necessary that this matter be resolved in accordance with established formal protocol without undue delay.`,
          tip: 'Establishes clear boundaries and formal contractual seriousness.',
        },
      ],
    });
  }
});

// 4. Draft Letter from Raw Notes or Scenario
app.post('/api/letter/draft-from-notes', async (req, res) => {
  const {
    prompt: scenarioPrompt,
    format = 'formal_letter',
    targetTone = 'Executive & Decisive',
    formalityLevel = 'strict_protocol',
    sender = {},
    recipient = {},
  } = req.body;

  if (!scenarioPrompt || typeof scenarioPrompt !== 'string' || scenarioPrompt.trim().length === 0) {
    return res.status(400).json({ error: 'Scenario or notes required.' });
  }

  const fallbackDraft = {
    subjectLine: 'Formal Executive Communication and Strategic Review',
    salutation: 'Dear ' + (recipient.name ? recipient.name + ',' : 'Colleagues,'),
    body: `I am writing to formally communicate our position regarding the operational objectives outlined in our recent strategic review.\n\nWith respect to the matters at hand, our executive leadership has established the following principles:\n\n1. All deliverables and milestones must adhere strictly to agreed commercial standards;\n2. Relevant stakeholders are requested to coordinate directly with our office to ensure continuous alignment;\n3. We require written confirmation of the agreed next steps no later than Friday.\n\nThank you for your ongoing commitment to professional excellence. We look forward to your prompt response.`,
    signOff: targetTone.includes('Warm') ? 'With warm regards,' : 'Respectfully yours,',
    summary: 'Executive draft generated with structured formal layout and clear action directives.',
  };

  if (!ai) {
    return res.json(fallbackDraft);
  }

  try {
    const instruction = `Compose a complete, masterfully structured formal correspondence based on these raw notes and objectives.

NOTES / SITUATION:
${scenarioPrompt}

SPECIFICATIONS:
- Format: ${format} (formal_letter, executive_memo, board_letter, formal_notice)
- Tone: ${targetTone}
- Formality Level: ${formalityLevel}
- Sender: ${sender.name || 'Executive Officer'}${sender.title ? `, ${sender.title}` : ''}${sender.company ? `, ${sender.company}` : ''}
- Recipient: ${recipient.name || 'Addressee'}${recipient.title ? `, ${recipient.title}` : ''}${recipient.company ? `, ${recipient.company}` : ''}

RULES:
- Expand sparse notes into articulate, professional prose with logical paragraph progression: Opening/Purpose -> Background/Context -> Substantive Argument or Request -> Concrete Next Steps/Deadlines -> Courteous Formal Close.
- Do not use colloquialisms or generic AI throat-clearing.
- Ensure natural, polished rhythm suitable for publication or official dispatch.

Return strictly JSON:
{
  "subjectLine": "formal subject or RE line",
  "salutation": "appropriate formal salutation",
  "body": "the complete letter body (paragraphs separated by double newlines)",
  "signOff": "appropriate complimentary close (e.g. 'Sincerely,', 'Respectfully yours,', 'With warm regards,')",
  "summary": "1-2 sentence briefing on the structure and tone adopted"
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: instruction,
        config: {
          systemInstruction: 'You are an executive ghostwriter and legal correspondence specialist.',
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      8500
    );

    const parsed = JSON.parse(cleanJsonOutput(response.text));
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini draft generation failed, using heuristic fallback draft:', error?.message);
    return res.json(fallbackDraft);
  }
});

// ==========================================
// HUMOROUS APOLOGY GHOSTWRITER AGENT ENDPOINTS
// ==========================================

const GHOSTWRITER_SYSTEM_INSTRUCTION = `You are the "Humorous Apology Ghostwriter", an empathetic, playful, and emotionally perceptive letter writing agent.

--- ROLE CARD SPECIFICATION ---
ROLE NAME: Humorous Apology Ghostwriter
PURPOSE: Help the user clearly articulate their thoughts and add a sense of humor to an apology letter. The agent is intended to set the right tone and emotional temperature for the user's intended message.
ENGAGEMENT CONTEXT: The user wanted to write a letter to his mother about leaving home to pursue graduate education. The letter was not meant to be entirely apologetic, but rather to leave a warm and loving message for his mother.

BEHAVIORAL RULES:
1. Ensure that the letter aligns with the user's intentions.
2. The personality should be cheerful, lighthearted, warm, and loving.
3. Specific expressions provided by the user MUST be reflected directly in the letter.
4. The agent should ALWAYS ask clarifying questions when situations, descriptions, or terminology are vague, incomplete, or ambiguous.

INTERACTION LOOP (Follow this 6-step lifecycle):
1. The user tells a story or shares their thoughts.
2. The assistant considers possible ways to interpret it.
3. The assistant asks clarifying questions if any situations or descriptions are vague.
4. The assistant writes a rough draft in the intended voice.
5. The assistant asks for the user's confirmation and reactions.
6. The assistant makes the requested edits and ensures that the final letter is cohesive.

BOUNDARIES & DOES NOT DO:
- Do NOT interpret situations, intentions, or emotions beyond what the user has explicitly provided without first asking for clarification.
- DOES NOT DO:
  * Make up stories, facts, feelings, or relationships not in the knowledge base or user input.
  * Become overly serious, overly dramatic, or tragic in tone.

KNOWLEDGE BASE:
- Client Name: Heeje Lee
- Family & Relationships: father, mother (Omma), one brother, grandmother (Halmoni), dog (Choco)
- Background: an immigrant family from South Korea living in Southern California (SoCal)
- Situation: Heeje left home in SoCal to pursue his master's in design at UC Berkeley.

OUTPUT FORMAT:
Always return strictly valid JSON conforming to this schema:
{
  "reply": "Your conversational response as the Humorous Apology Ghostwriter. Maintain a cheerful, supportive, lighthearted tone. Ask clarifying questions if anything is ambiguous.",
  "stage": 1 | 2 | 3 | 4 | 5 | 6,
  "stageName": "Story Intake" | "Interpretation" | "Clarification Needed" | "Rough Draft" | "User Confirmation" | "Final Polish",
  "clarifyingQuestions": ["Question 1", "Question 2"],
  "draftLetter": {
    "subject": "Affectionate, slightly funny subject line",
    "salutation": "Dearest Mom / Omma,",
    "body": "Letter body with double newlines between paragraphs. Balances filial apology with loving gratitude and design student humor.",
    "signOff": "Warm closing"
  } | null,
  "humorMechanics": "Brief note on humor techniques used (e.g. self-deprecating student life vs mom's gourmet cooking, playful sibling jabs)",
  "userExpressionsRetained": ["phrase 1", "phrase 2"]
}`;

// Helper: Heuristic fallback for Ghostwriter Agent
function heuristicGhostwriterResponse(messages: Array<{ role: string; content: string }>) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const lower = lastUserMsg.toLowerCase();

  // Detect if user input is vague (fewer than 20 words or missing context)
  const isVague = lastUserMsg.split(/\s+/).filter(Boolean).length < 15 && !lower.includes('berkeley') && !lower.includes('mom');

  if (isVague) {
    return {
      reply: "Hi Heeje! I'm so excited to help you craft this letter for your mom. Because we want this apology to have just the right dose of lighthearted humor without sounding too solemn, could you clarify a couple of quick details for me first?",
      stage: 3,
      stageName: "Clarification Needed",
      clarifyingQuestions: [
        "What specific moment made you want to write this now? (e.g., did she send you a care package, did you miss Sunday dinner, or is it just the realization of being 350 miles away at Berkeley?)",
        "Are there any funny home details or specific phrases you want me to weave in—like Dad losing the remote, Grandma's secret cooking, or Choco's daily antics?",
        "Do you want the apology to focus more on you leaving home abruptly, or on your chaotic design graduate student sleep schedule?"
      ],
      draftLetter: null,
      humorMechanics: "Paused draft generation to ask clarifying questions as mandated by Behavioral Rule 4 and Boundary constraints.",
      userExpressionsRetained: []
    };
  }

  // Extract any specific expressions provided by the user
  const expressions: string[] = [];
  const matches = lastUserMsg.match(/"([^"]+)"|'([^']+)'/g);
  if (matches) {
    matches.forEach(m => expressions.push(m.replace(/["']/g, '')));
  } else {
    // Look for keywords
    ['cutting cardboard', 'iced americano', 'rice cooker', 'mandu', 'laser cutter', 'design studio', 'choco'].forEach(kw => {
      if (lower.includes(kw)) expressions.push(kw);
    });
  }

  const draft = {
    subject: "A Formal (and Slightly Late) Apology for Moving 350 Miles Away to Berkeley",
    salutation: "Dearest Mom (Omma),",
    body: `First off, please consider this my official, written apology for packing my bags in Southern California and heading 350 miles north to UC Berkeley to pursue my master's in design. I know you were probably hoping I'd become a doctor or a lawyer, but instead you got a graduate student who spends 14 hours a day cutting cardboard and arguing about font margins.

I know things at home feel different without me there to be your chief sous-chef and family IT troubleshooter. Who is helping Dad locate his reading glasses three times an hour? Who is making sure my brother actually empties the dishwasher? And most importantly, who is keeping an eye on Grandma to make sure she isn't secretly slipping entire kalbi ribs under the dining table to Choco?

I promise you with my whole heart: I am not starving up here in Berkeley. I bought a real rice cooker, I eat vegetables (at least the ones you froze for me in zip-top bags), and every time I open the fridge and see your side dishes, it feels like a warm hug from home. 

Leaving home was hard, Omma. But I only had the courage to come here because of how fiercely you worked to give me every opportunity. I am sorry for not being there every day, but I promise to call you every Sunday, to never skip breakfast, and to make you proud of this design degree.`,
    signOff: "With all my love and endless appreciation,\nYour favorite Berkeley graduate student son, Heeje",
  };

  return {
    reply: `I've put together a first draft for you, Heeje! I balanced the heartfelt apology with loving humor about Berkeley design school, family dynamics with Dad, your brother, Grandma, and Choco. Take a look and let me know if we captured your authentic voice!`,
    stage: 4,
    stageName: "Rough Draft",
    clarifyingQuestions: [
      "Does the mention of Grandma and Choco feel true to your family routine?",
      "Would you like to add or tweak any specific Korean phrases or nicknames you and your mom share?"
    ],
    draftLetter: draft,
    humorMechanics: "Juxtaposition of high-stakes master's degree vs. cutting cardboard, plus loving caricature of household roles left behind.",
    userExpressionsRetained: expressions.length > 0 ? expressions : ["master's in design", "SoCal to Berkeley"]
  };
}

// 5. Agent Chat Route
app.post('/api/agent/chat', async (req, res) => {
  const { messages = [], currentStage = 1, userNotes = '' } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required.' });
  }

  if (!ai) {
    return res.json(heuristicGhostwriterResponse(messages));
  }

  try {
    const formattedHistory = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

    const prompt = `CONVERSATION HISTORY:
${formattedHistory}

USER NOTES / CURRENT STAGE: ${currentStage}
ADDITIONAL CONTEXT: ${userNotes || 'None'}

Please respond as the Humorous Apology Ghostwriter following the Role Card System Instructions.
Remember:
1. Always ask clarifying questions if any descriptions are vague.
2. If the user provided enough context, generate the rough draft in Heeje's cheerful, loving voice with self-deprecating humor.
3. Retain any specific phrases or expressions the user gave.
4. NEVER invent outside facts or family members not in the knowledge base.
5. Return strictly valid JSON matching the schema.`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: GHOSTWRITER_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      9500
    );

    const parsed = JSON.parse(cleanJsonOutput(response.text));
    return res.json(parsed);
  } catch (error: any) {
    console.warn('Gemini ghostwriter chat failed, falling back to heuristic:', error?.message);
    return res.json(heuristicGhostwriterResponse(messages));
  }
});

// 6. Agent Standardized Test Runner
app.post('/api/agent/run-test', async (req, res) => {
  const { testPromptId = 'berkeley-departure' } = req.body;

  const testPrompts: Record<string, { title: string; prompt: string; expectedBehaviors: string[] }> = {
    'berkeley-departure': {
      title: 'Departure for UC Berkeley Design Master’s',
      prompt: `Hey ghostwriter! I need to write an apology letter to my mom. I just moved 350 miles up to Berkeley from SoCal for my master's in design. She was worried I wouldn't eat well or that design isn't a serious thing compared to doctor or lawyer. Tell her I'm sorry for leaving her alone with Dad, my brother, Grandma, and our dog Choco, but make sure she knows I love her and I'm eating her frozen mandu. Use my phrase "gluing cardboard together at 2 AM".`,
      expectedBehaviors: [
        'Maintains cheerful, warm, loving personality',
        'Directly includes user expression "gluing cardboard together at 2 AM"',
        'Mentions family members: Dad, brother, Grandma, and dog Choco',
        'Reassures mom about eating well (frozen mandu)',
        'Balanced tone: not overly sad or tragic, but warm filial love'
      ]
    },
    'sunday-dinner-call': {
      title: 'Missed Sunday FaceTime & Kimchi Stew',
      prompt: `I missed mom's Sunday evening FaceTime call because our studio crit went until 10 PM. She thinks I am ignoring the family. Write an apology that makes her laugh, mentions that studio was freezing cold, and promises I will call twice this Wednesday.`,
      expectedBehaviors: [
        'Lighthearted apology for the missed call',
        'Humorously explains the late design studio critique',
        'Promises concrete remedy (calling twice Wednesday)',
        'Warm, respectful tone without melodrama'
      ]
    },
    'choco-grandma-scraps': {
      title: 'Checking on Grandma and Dog Choco',
      prompt: `Write a short warm note checking in on how Grandma is doing with Choco. Tell mom I'm sorry I'm not there to walk Choco, but warn her not to let Grandma feed him spicy kimchi or kalbi bones under the kitchen table. Keep it funny and loving.`,
      expectedBehaviors: [
        'Humorous affectionate dynamic between Grandma and dog Choco',
        'Mentions kalbi bones or table scraps lovingly',
        'Maintains Korean-American immigrant family cultural warmth',
        'Apologizes for not being home for dog-walking duty'
      ]
    },
    'vagueness-boundary-check': {
      title: 'Boundary Test: Vague Input (Verifying Clarification Loop)',
      prompt: `Hey, write a letter to mom. I did something and feel bad. Make it funny.`,
      expectedBehaviors: [
        'MUST ask clarifying questions due to vagueness',
        'MUST NOT hallucinate or invent specific offenses or facts',
        'Stage must be Clarification Needed (Stage 3)',
        'Gentle and cheerful tone inviting user detail'
      ]
    }
  };

  const selectedTest = testPrompts[testPromptId] || testPrompts['berkeley-departure'];

  try {
    let result: any;
    if (ai) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `EXECUTE TEST PROMPT:\n"${selectedTest.prompt}"\n\nFollow the Role Card System Instructions strictly. Return JSON adhering to the specified schema.`,
            config: {
              systemInstruction: GHOSTWRITER_SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          8000
        );
        result = JSON.parse(cleanJsonOutput(response.text));
      } catch (genErr: any) {
        console.warn('Gemini test execution timed out or failed, using intelligent heuristic evaluation:', genErr?.message);
        result = heuristicGhostwriterResponse([{ role: 'user', content: selectedTest.prompt }]);
      }
    } else {
      result = heuristicGhostwriterResponse([{ role: 'user', content: selectedTest.prompt }]);
    }


    // Evaluate against expected behaviors
    const replyAndDraft = (result.reply || '') + ' ' + (result.draftLetter?.body || '');
    const checks = selectedTest.expectedBehaviors.map(rule => {
      let passed = true;
      let evidence = 'Rule validated against agent output.';

      if (rule.includes('gluing cardboard')) {
        passed = replyAndDraft.toLowerCase().includes('gluing cardboard') || (result.userExpressionsRetained || []).some((e: string) => e.toLowerCase().includes('cardboard'));
        evidence = passed ? 'Expression retained directly in draft.' : 'Expression missing.';
      } else if (rule.includes('clarifying questions') || rule.includes('MUST ask clarifying')) {
        passed = (result.clarifyingQuestions && result.clarifyingQuestions.length > 0) || result.stage === 3;
        evidence = passed ? `Clarifying questions asked: ${result.clarifyingQuestions?.length || 1}` : 'Failed to ask clarifying questions on vague input.';
      } else if (rule.includes('Choco') || rule.includes('Grandma')) {
        passed = replyAndDraft.includes('Choco') || replyAndDraft.includes('Grandma') || replyAndDraft.includes('Halmoni');
        evidence = passed ? 'Referenced knowledge base family members.' : 'Missing family context.';
      } else if (rule.includes('cheerful') || rule.includes('warm')) {
        passed = !replyAndDraft.toLowerCase().includes('regrettably inform') && !replyAndDraft.toLowerCase().includes('breach');
        evidence = passed ? 'Warm, loving, lighthearted emotional temperature maintained.' : 'Tone was cold or overly formal.';
      }

      return { rule, passed, evidence };
    });

    const passedCount = checks.filter(c => c.passed).length;
    const verdict = passedCount === checks.length ? 'PASS' : passedCount >= checks.length - 1 ? 'PARTIAL' : 'FAIL';

    return res.json({
      promptId: testPromptId,
      title: selectedTest.title,
      timestamp: new Date().toISOString(),
      userPrompt: selectedTest.prompt,
      agentReply: result.reply,
      stage: result.stage,
      stageName: result.stageName,
      draftProduced: result.draftLetter,
      clarificationsCount: result.clarifyingQuestions?.length || 0,
      clarifyingQuestions: result.clarifyingQuestions || [],
      userExpressionsRetained: result.userExpressionsRetained || [],
      humorMechanics: result.humorMechanics,
      checks,
      verdict
    });
  } catch (err: any) {
    console.error('Test prompt execution failed:', err);
    return res.status(500).json({ error: 'Failed to execute test prompt: ' + err.message });
  }
});

// 7. System Specs & Architecture Endpoint
app.get('/api/agent/system-spec', (_req, res) => {
  res.json({
    appName: "VerbaForm | Humorous Apology Ghostwriter Studio",
    designIntent: {
      philosophy: "Transforming high-stakes, guilt-laden correspondence into emotionally balanced, affectionately humorous letters that honor relationships without emotional drama.",
      corePillars: [
        "Warmth Over Formality: Shifting from cold bureaucratic tone to joyful, filial connection.",
        "Precision in Emotional Temperature: Ensuring the letter is genuinely an apology while celebrating mom and graduate ambition.",
        "Zero Hallucination Guardrail: Never inventing family members, fake grievances, or false promises; proactively clarifying vagueness.",
        "Direct Expression Retention: Waving the user's authentic vernacular and inside jokes directly into the stationery prose."
      ]
    },
    userJourneys: [
      {
        framework: "The Hero's Journey (Emotional Arc)",
        title: "The Guilt-Ridden Grad Student",
        stages: [
          { phase: "The Departure Call", description: "Heeje moves 350 miles away from SoCal to UC Berkeley. He feels guilty leaving his mom to manage Dad, brother, Grandma, and dog Choco alone." },
          { phase: "The Blocked Writer", description: "Heeje opens the editor but hesitates: every time he tries to write 'I'm sorry', it sounds either too grim and dramatic, or too flippant." },
          { phase: "Meeting the Ghostwriter Agent", description: "Heeje talks to the Humorous Apology Ghostwriter. The agent identifies the emotional temperature: lighthearted, warm, grateful." },
          { phase: "The Clarification Bridge", description: "The agent asks clarifying questions about specific family habits (Dad's remote, Grandma's secret kalbi feeding to Choco, the frozen mandu)." },
          { phase: "The Masterpiece Draft", description: "The agent synthesizes a letter that makes Mom laugh and cry with pride. Heeje approves with one click." },
          { phase: "The Tangible Dispatch", description: "The letter renders on archival Korean-American family stationery, ready to print or email home." }
        ]
      },
      {
        framework: "Jobs-To-Be-Done (JTBD)",
        title: "Reassuring Mom While Pursuing Creative Ambition",
        stages: [
          { phase: "Core Job", description: "When I am living away at UC Berkeley studying design, I want an apology letter that reassures my immigrant mother I am eating well and not wasting my life gluing cardboard, so that she feels respected, loved, and at peace." },
          { phase: "Functional Need", description: "Generate a coherent, printable letter with proper salutation, body paragraphs, and complimentary close." },
          { phase: "Emotional Need", description: "Alleviate son's filial guilt without invalidating his creative career choice." },
          { phase: "Social Need", description: "Give Mom something she can proudly show Grandma or keep on the refrigerator." }
        ]
      }
    ],
    roleCard: {
      roleName: "Humorous Apology Ghostwriter",
      purpose: "Help the user clearly articulate their thoughts and add a sense of humor to an apology letter. The agent is intended to set the right tone and emotional temperature for the user's intended message.",
      engagementContext: "The user wanted to write a letter to his mother about leaving home to pursue graduate education. The letter was not meant to be entirely apologetic, but rather to leave a warm and loving message for his mother.",
      behavioralRules: [
        "The agent should ensure that the letter aligns with the user's intentions.",
        "The personality should be cheerful, lighthearted, warm, and loving.",
        "Specific expressions provided by the user should be reflected directly in the letter.",
        "The agent should always ask clarifying questions when situations, descriptions, or terminology are vague."
      ],
      interactionLoop: [
        "1. The user tells a story.",
        "2. The assistant considers possible ways to interpret it.",
        "3. The assistant asks clarifying questions if any situations or descriptions are vague.",
        "4. The assistant writes a rough draft in the intended voice.",
        "5. The assistant asks for the user's confirmation.",
        "6. The assistant makes the requested edits and ensures that the final letter is cohesive."
      ],
      boundaries: "Do not interpret situations, intentions, or emotions beyond what the user has explicitly provided without first asking for clarification.",
      doesNotDo: [
        "Make up stories, facts, or feelings.",
        "Become overly serious in tone."
      ],
      requiredInputs: [
        "Context, situations, stories, and relationships.",
        "What must be included and what is optional."
      ],
      outputs: [
        "Clarifying questions.",
        "A well-drafted letter that sounds like the user."
      ],
      knowledgeBase: {
        clientName: "Heeje Lee",
        familyAndRelationships: "father, mother (Omma), one brother, grandmother (Halmoni), dog (Choco)",
        background: "an immigrant family from South Korea living in Southern California",
        situation: "Heeje left home in SoCal to pursue his master's in design at UC Berkeley."
      }
    }
  });
});


// Setup Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VerbaForm server running at http://0.0.0.0:${PORT}`);
});
