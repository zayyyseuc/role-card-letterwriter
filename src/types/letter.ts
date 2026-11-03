export type LetterFormat = 'formal_letter' | 'executive_memo' | 'board_letter' | 'formal_notice';

export type ToneType = 
  | 'Executive & Decisive'
  | 'Courteous & Diplomatic'
  | 'Firm & Contractual'
  | 'Warm & Gracious'
  | 'Direct & Objective';

export type FormalityLevel = 'strict_protocol' | 'elevated_business' | 'standard_formal';

export interface RiskFlag {
  phrase: string;
  issue: string;
  suggestedAlternative: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ProtocolCheck {
  salutationValid: boolean;
  signOffValid: boolean;
  structureAssessment: string;
  wordCount: number;
  readingTimeMinutes: number;
}

export interface LetterAnalysis {
  overallTone: string;
  clarityScore: number;
  formalityScore: number;
  diplomacyScore: number;
  concisenessScore: number;
  executiveSummary: string;
  riskFlags: RiskFlag[];
  protocolCheck: ProtocolCheck;
}

export interface DiffChange {
  originalExcerpt: string;
  revisedExcerpt: string;
  reason: string;
}

export interface ImprovedResult {
  improvedContent: string;
  subjectLine: string;
  salutation: string;
  signOff: string;
  rationale: string;
  diffChanges: DiffChange[];
}

export interface SentenceAlternative {
  style: 'Decisive & Direct' | 'Diplomatic & Tactful' | 'Firm & Authoritative';
  text: string;
  tip: string;
}

export interface LetterContact {
  name: string;
  title: string;
  company: string;
  department?: string;
  addressLine1?: string;
  addressLine2?: string;
  email?: string;
}

export interface LetterheadConfig {
  enabled: boolean;
  organizationName: string;
  division: string;
  tagline: string;
  address: string;
  referenceCode: string;
  confidentialBadge: boolean;
  dateFormat: 'us' | 'iso' | 'uk';
}

export interface LetterDocument {
  id: string;
  title: string;
  format: LetterFormat;
  date: string;
  subject: string;
  salutation: string;
  body: string;
  signOff: string;
  sender: LetterContact;
  recipient: LetterContact;
  letterhead: LetterheadConfig;
  lastAnalysis?: LetterAnalysis;
  originalDraft?: string;
  improvedResult?: ImprovedResult;
}

export interface LetterTemplate {
  id: string;
  title: string;
  category: string;
  format: LetterFormat;
  recommendedTone: ToneType;
  description: string;
  document: Omit<LetterDocument, 'id'>;
}

export type AgentStage = 1 | 2 | 3 | 4 | 5 | 6;

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  stage?: AgentStage;
  clarifyingQuestions?: string[];
  draftLetter?: {
    subject: string;
    salutation: string;
    body: string;
    signOff: string;
  };
  humorMechanics?: string;
}

export interface AgentTestPrompt {
  id: string;
  title: string;
  description: string;
  category: string;
  userPrompt: string;
  expectedBehavior: string[];
}

export interface AgentTestRunResult {
  promptId: string;
  title: string;
  timestamp: string;
  userPrompt: string;
  agentReply: string;
  draftProduced?: {
    subject: string;
    salutation: string;
    body: string;
    signOff: string;
  };
  clarificationsCount: number;
  clarifyingQuestions?: string[];
  userExpressionsRetained?: string[];
  humorMechanics?: string;
  checks: {
    rule: string;
    passed: boolean;
    evidence: string;
  }[];
  verdict: 'PASS' | 'PARTIAL' | 'FAIL';
}


