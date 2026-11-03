import { LetterTemplate } from '../types/letter';

export const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'heeje-lee-apology-to-mom',
    title: 'Warm Apology & Berkeley Update to Mom (Heeje Lee)',
    category: 'Personal & Humorous',
    format: 'formal_letter',
    recommendedTone: 'Warm & Gracious',
    description: 'A lighthearted, warm, and loving apology letter from Heeje Lee to his mother regarding leaving home in SoCal to pursue his master’s in design at UC Berkeley.',
    document: {
      title: 'Letter to Mom (Leaving for UC Berkeley Design)',
      format: 'formal_letter',
      date: 'November 3, 2026',
      subject: 'A Very Official Apology for Moving 350 Miles North to Glue Cardboard at Berkeley',
      salutation: 'Dearest Mom (Omma),',
      body: `First of all, I am formally submitting this written apology for packing up my car, moving 350 miles away to Northern California, and leaving you with Dad, my brother, Grandma, and Choco. I know that without me home, Dad probably loses the TV remote three times a day, Grandma sneaks Choco table scraps while pretending she does not speak English, and you are left doing the detective work for all of them.

I want to promise you that my master’s in design at UC Berkeley is a real academic degree, even if 80% of what I do right now looks like cutting foamcore, obsessing over Helvetica fonts, and drinking iced Americanos at 1:00 AM. I promise I am not starving—I bought a rice cooker on day two, and I have been rationing the frozen mandu you packed with the discipline of a navy commander.

Leaving home in Southern California was not easy. Every time I smell roasted sesame oil or hear an aggressive vacuum cleaner at 7:00 AM on a Saturday, I think of home. I am writing this because while I am sorry for not being downstairs to finish the leftover side dishes, I wanted you to know how deeply grateful I am for everything you gave me to make this step possible.

Please don't worry about me skipping meals. I will call you every Sunday, I will not blow my rent money on fancy typography posters, and I will be home before you even have time to miss my messy shoe collection in the entryway.

Give Grandma a warm hug for me, make sure Dad wears his jacket, and please do not let Choco eat any more kalbi bones.`,
      signOff: 'With all my love and endless gratitude,',
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
        referenceCode: 'HEEJE-MOM-2026-01',
        confidentialBadge: false,
        dateFormat: 'us',
      },
    },
  },

  {
    id: 'vendor-sla-breach',
    title: 'Formal Notice of SLA Breach & Cure Demand',
    category: 'Commercial & Legal',
    format: 'formal_letter',
    recommendedTone: 'Firm & Contractual',
    description: 'A disciplined, legally sound formal demand addressing chronic service outages, requiring root-cause remediation and contractual fee credits within 10 business days.',
    document: {
      title: 'Formal Notice of SLA Breach & Cure Demand',
      format: 'formal_letter',
      date: 'November 3, 2026',
      subject: 'Formal Notice of SLA Non-Compliance (Contract Ref: MSA-2024-889) and Demand for Cure',
      salutation: 'Dear Mr. Sterling,',
      body: `I am writing in my capacity as Chief Operating Officer to place Vantage Cloud Systems on formal notice of sustained failure to meet contractual Service Level Agreements ("SLAs") pursuant to Section 4.2 of our Master Services Agreement dated January 15, 2024.

Over the preceding consecutive billing cycles (August through October 2026), our enterprise production cluster recorded an aggregate downtime of 41.6 hours. This constitutes an effective availability index of 97.2%, falling materially short of the guaranteed 99.95% tier. These recurring service interruptions have impaired our primary transaction gateway and caused substantial operational disruption across our regional hubs.

Notwithstanding multiple informal communications between our respective engineering leads, the fundamental architectural instabilities remain unresolved. Accordingly, we formally request the following actions:

1. Delivery of an exhaustive Root-Cause Analysis (RCA) and comprehensive remediation roadmap no later than 5:00 PM EST on November 17, 2026;
2. Immediate application of the contractual 20% service fee credit for the affected quarterly billing period ($48,500.00 USD);
3. Direct executive oversight from your Principal Reliability Architect during the scheduled migration on November 21, 2026.

While we value our historical commercial partnership, we must underscore that continued non-performance will leave us no alternative but to exercise our statutory rights to terminate for material breach under Section 9.1 without penalty.

We anticipate your prompt written acknowledgment of this notice within two business days.`,
      signOff: 'Respectfully yours,',
      sender: {
        name: 'Eleanor Vance',
        title: 'Chief Operating Officer',
        company: 'Meridian Global Logistics Corp.',
        department: 'Executive Operations',
        addressLine1: '450 Park Avenue, 28th Floor',
        addressLine2: 'New York, NY 10022',
        email: 'e.vance@meridianglobal.com',
      },
      recipient: {
        name: 'Marcus Sterling',
        title: 'Executive Vice President, Client Services',
        company: 'Vantage Cloud Systems, Inc.',
        addressLine1: '100 Montgomery Street, Suite 1400',
        addressLine2: 'San Francisco, CA 94104',
        email: 'm.sterling@vantagecloud.io',
      },
      letterhead: {
        enabled: true,
        organizationName: 'MERIDIAN GLOBAL LOGISTICS',
        division: 'Office of the Chief Operating Officer',
        tagline: 'Global Supply Chain Architecture & Infrastructure',
        address: '450 Park Avenue, 28th Floor · New York, NY 10022 · Tel: (212) 555-0190',
        referenceCode: 'MGL-CORR-2026-1104',
        confidentialBadge: true,
        dateFormat: 'us',
      },
    },
  },
  {
    id: 'executive-board-memo',
    title: 'Board Memorandum: Capital Reallocation & Expansion',
    category: 'Governance & Strategy',
    format: 'executive_memo',
    recommendedTone: 'Executive & Decisive',
    description: 'Strategic C-suite memorandum briefing the Board of Directors on phased capital reallocation toward autonomous fulfillment automation.',
    document: {
      title: 'Strategic Capital Reallocation (Project Horizon)',
      format: 'executive_memo',
      date: 'November 3, 2026',
      subject: 'Recommendation for Phased Capital Reallocation into Phase II Automation Infrastructure',
      salutation: 'TO: The Board of Directors\nFROM: Arthur Pendelton, Chief Executive Officer\nDATE: November 3, 2026\nSUBJECT: Recommendation for Phased Capital Reallocation ($14.2M)',
      body: `This memorandum outlines executive management's formal recommendation to reallocate $14.2 million from our secondary commercial real estate contingency into our automated warehouse sorting platform (Project Horizon) during Fiscal Year 2027.

BACKGROUND & STRATEGIC RATIONALE:
During Q2 and Q3 2026, our pilot deployment in Columbus, Ohio demonstrated a 34% reduction in order processing cycles alongside a 99.8% precision rate across 2.4 million units dispatched. Concurrently, regional freight labor premiums have risen 11.2% year-over-year. Accelerating the deployment across our Dallas and Atlanta distribution facilities will insulate operating margins against persistent workforce volatility.

FINANCIAL APPRAISAL & ROI:
The total capital requirement of $14.2 million will be disbursed in two structured tranches:
- Tranche A ($8.5M): Robotics hardware procurement and conveyance installation (Q1 2027)
- Tranche B ($5.7M): Warehouse management software integration and validation (Q2 2027)

Conservative financial modelling indicates full capital payback within 22 months post-commissioning, generating an estimated annualized recurring operational saving of $7.8 million beginning in Q4 2027.

RISK GOVERNANCE:
Potential supply-chain bottlenecks for sensor assemblies have been mitigated through guaranteed vendor inventory reserves secured in September 2026. Transition risk will be managed via parallel dual-line processing during initial go-live.

BOARD ACTION REQUESTED:
Management recommends approval of Resolution 2026-11B authorizing the capital reallocation at the upcoming November 18 regular board meeting. Executive leadership is prepared to address questions during the preliminary audit committee review on November 10.`,
      signOff: 'Submitted respectfully,',
      sender: {
        name: 'Arthur Pendelton',
        title: 'Chief Executive Officer',
        company: 'Kensington Industrial Holdings',
        department: 'Executive Office',
        addressLine1: '700 Michigan Avenue',
        addressLine2: 'Chicago, IL 60611',
      },
      recipient: {
        name: 'The Board of Directors',
        title: 'Governing Board',
        company: 'Kensington Industrial Holdings',
      },
      letterhead: {
        enabled: true,
        organizationName: 'KENSINGTON INDUSTRIAL HOLDINGS',
        division: 'Executive Office of the CEO',
        tagline: 'Strategic Governance & Capital Stewardship',
        address: '700 Michigan Avenue · Chicago, IL 60611 · governance@kensington.com',
        referenceCode: 'MEMO-BD-2026-44',
        confidentialBadge: true,
        dateFormat: 'us',
      },
    },
  },
  {
    id: 'client-remediation-delay',
    title: 'High-Stakes Client Escalation & Mitigation Plan',
    category: 'Client & Stakeholder',
    format: 'formal_letter',
    recommendedTone: 'Courteous & Diplomatic',
    description: 'A balanced, reassuring correspondence to an enterprise client addressing an unexpected milestone delay with complete transparency and reinforced commitments.',
    document: {
      title: 'Milestone Timeline Adjustment & Commitment Assurance',
      format: 'formal_letter',
      date: 'November 3, 2026',
      subject: 'Enterprise Platform Delivery: Security Audit Findings and Revised Go-Live Schedule',
      salutation: 'Dear Ms. Gallagher,',
      body: `I am writing to provide an unvarnished briefing regarding the scheduled December 1 delivery of your Customer Operations Platform. 

During our final third-party penetration testing completed this past Tuesday, our external auditor identified two latency vulnerabilities within the single-sign-on cryptographic handshake. While our operational systems remain secure, deploying with these parameters would compromise the sub-second response criteria stipulated in our architectural charter.

Rather than release a compromised build that could jeopardize your peak holiday transactions, our executive technical committee has resolved to execute a targeted two-week remediation sprint. Consequently, user acceptance testing (UAT) will commence on December 8, with general production deployment scheduled for December 18, 2026.

To ensure this brief adjustment creates zero downstream impact on your commercial launch, we have implemented the following compensatory measures:

1. Our Senior Architecture Taskforce has been dedicated exclusively to your instance with 24/7 coverage;
2. We will absorb all external compliance audit and penetration re-testing expenses ($32,000 value);
3. We are providing 60 days of complimentary tier-one white-glove engineering support upon launch.

We recognize the trust you place in our stewardship and regret the brief inconvenience this schedule adjustment causes. I am available for a direct conference tomorrow morning at your convenience to review the technical logs in detail.`,
      signOff: 'With warm regards and appreciation,',
      sender: {
        name: 'Julian Montgomery',
        title: 'Managing Director & Partner',
        company: 'Apex Digital Advisory LLP',
        addressLine1: 'One Financial Center, 34th Floor',
        addressLine2: 'Boston, MA 02111',
        email: 'j.montgomery@apexdigital.com',
      },
      recipient: {
        name: 'Victoria Gallagher',
        title: 'Chief Information Officer',
        company: 'Crestview Financial Group',
        addressLine1: '200 Clarendon Street',
        addressLine2: 'Boston, MA 02116',
      },
      letterhead: {
        enabled: true,
        organizationName: 'APEX DIGITAL ADVISORY',
        division: 'Enterprise Practice Group',
        tagline: 'Strategic Technology Architecture & Assurance',
        address: 'One Financial Center, 34th Floor · Boston, MA 02111 · (617) 555-8200',
        referenceCode: 'ADA-LTR-2026-902',
        confidentialBadge: false,
        dateFormat: 'us',
      },
    },
  },
  {
    id: 'executive-endorsement',
    title: 'Executive Letter of Recommendation',
    category: 'Endorsements & Talent',
    format: 'formal_letter',
    recommendedTone: 'Executive & Decisive',
    description: 'An authoritative, measured, and persuasive endorsement for a senior vice president seeking a C-suite or board appointment.',
    document: {
      title: 'Formal Endorsement for Dr. Helena Vance',
      format: 'formal_letter',
      date: 'November 3, 2026',
      subject: 'Letter of Unqualified Endorsement: Dr. Helena Vance for Chief Technology Officer',
      salutation: 'To the Members of the Nominating Committee,',
      body: `It is an honor to submit this unqualified letter of endorsement for Dr. Helena Vance as candidate for the position of Chief Technology Officer.

Having served alongside Dr. Vance for over six years during her tenure as Senior Vice President of Engineering at Solis Healthcare Informatics, I have observed firsthand her exceptional technical acumen, operational rigor, and strategic governance. She led an international engineering division of over 280 engineers across four continents while maintaining 99.99% compliance across strict HIPAA and FDA regulatory audits.

Her achievements are distinguished by three pivotal strengths:
- Transformative Technical Architecture: Helena orchestrated our enterprise migration to microservices, reducing infrastructure overhead by 28% while unlocking $45M in net-new enterprise software ARR;
- Strategic Talent Development: Under her direct stewardship, engineering attrition remained below 4.5% during industry-wide volatility, reflecting her ability to cultivate high-performance teams;
- Boardroom Articulation: She possesses the rare ability to translate intricate distributed systems complexity into clear commercial terms that non-technical directors can evaluate with absolute confidence.

Beyond her technical pedigree, Dr. Vance is an executive of unimpeachable ethical standard. She commands natural respect from peers and subordinate staff alike. I am confident she will bring transformative vision and disciplined execution to your executive committee.

I welcome the opportunity to discuss her qualifications further at your convenience.`,
      signOff: 'Sincerely yours,',
      sender: {
        name: 'David R. Sterling, Ph.D.',
        title: 'Former Chairman & Chief Executive Officer',
        company: 'Solis Healthcare Informatics',
        addressLine1: '1200 Avenue of the Americas',
        addressLine2: 'New York, NY 10036',
      },
      recipient: {
        name: 'The Search & Nominating Committee',
        title: 'Executive Selection Panel',
        company: 'BioNova Health Systems Corp.',
        addressLine1: '500 Technology Square',
        addressLine2: 'Cambridge, MA 02139',
      },
      letterhead: {
        enabled: true,
        organizationName: 'DAVID R. STERLING',
        division: 'Office of the Former Chairman',
        tagline: 'Private Advisory & Board Governance',
        address: '1200 Avenue of the Americas · New York, NY 10036 · d.sterling@sterling-advisory.com',
        referenceCode: 'REC-EX-2026-09',
        confidentialBadge: true,
        dateFormat: 'us',
      },
    },
  },
  {
    id: 'partnership-renewal-appreciation',
    title: 'Strategic Partnership Commendation & Renewal',
    category: 'Partnership & Alliances',
    format: 'formal_letter',
    recommendedTone: 'Warm & Gracious',
    description: 'An executive letter of cordial appreciation celebrating five years of alliance and laying the foundation for expanded multi-year collaboration.',
    document: {
      title: 'Five-Year Strategic Partnership Commendation',
      format: 'formal_letter',
      date: 'November 3, 2026',
      subject: 'Commendation of Five-Year Alliance and Framework for Expanded Collaboration',
      salutation: 'Dear Mr. Al-Mansoor,',
      body: `As we conclude our fifth fiscal year of shared commercial enterprise, I wish to express our deep institutional gratitude for the extraordinary collaboration between Al-Mansoor Industrial and our North American operations.

When our organizations forged this cross-border venture in 2021, our shared vision was to establish a resilient, high-integrity supply corridor for specialized industrial polymers. Today, through your team's meticulous quality control and consistent delivery standards, that vision has evolved into a premier benchmark for the manufacturing sector.

Our joint ventures over the past twelve months have delivered record efficiency, notably reducing transpacific cargo dwell times by sixteen days while maintaining flawless customs clearance across all ports of entry.

Looking ahead to the upcoming triennial agreement renewal in 2027, our executive board has authorized a proposed expansion of our joint purchasing consortium to encompass sustainable bio-based feedstocks. We believe this initiative will reinforce our collective market leadership for the coming decade.

I look forward to welcoming you and your executive delegation to our headquarters in Chicago next month to celebrate our mutual milestone and finalize our collaborative agenda.`,
      signOff: 'With warmest personal regards,',
      sender: {
        name: 'Katherine Davenport',
        title: 'President & Chief Commercial Officer',
        company: 'Vanguard Industrial Materials',
        addressLine1: '333 South Wacker Drive',
        addressLine2: 'Chicago, IL 60606',
      },
      recipient: {
        name: 'Tariq Al-Mansoor',
        title: 'Managing Director & CEO',
        company: 'Al-Mansoor Industrial Holdings',
        addressLine1: 'King Fahd Road, Al Olaya',
        addressLine2: 'Riyadh 12214, Kingdom of Saudi Arabia',
      },
      letterhead: {
        enabled: true,
        organizationName: 'VANGUARD INDUSTRIAL MATERIALS',
        division: 'Office of the President',
        tagline: 'Advanced Materials Engineering & Global Supply Partnerships',
        address: '333 South Wacker Drive · Chicago, IL 60606 · Tel: (312) 555-0144',
        referenceCode: 'VIM-CORR-2026-558',
        confidentialBadge: false,
        dateFormat: 'us',
      },
    },
  },
];
