/**
 * Crisis resource directory — hardcoded.
 *
 * The AI is instructed in the system prompt to NEVER speak phone numbers from
 * its own knowledge. All numbers users see come from this directory, surfaced
 * via the frontend. This prevents hallucination of incorrect crisis numbers.
 */

export interface CrisisResource {
  id: string;
  name: string;
  shortName: string;
  call?: string;
  text?: string;
  url?: string;
  description: string;
}

export const RESOURCES: Record<string, CrisisResource> = {
  "988": {
    id: "988",
    name: "988 Suicide & Crisis Lifeline",
    shortName: "988",
    call: "988",
    text: "988",
    description: "Free, 24/7. Trained counselors for any crisis.",
  },
  crisis_text_line: {
    id: "crisis_text_line",
    name: "Crisis Text Line",
    shortName: "Crisis Text Line",
    text: "741741",
    description: "Text HOME to 741741 to reach a crisis counselor.",
  },
  dv_hotline: {
    id: "dv_hotline",
    name: "National Domestic Violence Hotline",
    shortName: "DV Hotline",
    call: "1-800-799-7233",
    text: "88788",
    description:
      "Free, confidential. 24/7 trained advocates. Text START to 88788.",
  },
  childhelp: {
    id: "childhelp",
    name: "Childhelp National Child Abuse Hotline",
    shortName: "Childhelp",
    call: "1-800-422-4453",
    description: "24/7. For children, parents, anyone concerned about a child.",
  },
  trevor: {
    id: "trevor",
    name: "The Trevor Project",
    shortName: "Trevor Project",
    call: "1-866-488-7386",
    text: "678-678",
    description:
      "For LGBTQ+ youth in crisis. Text START to 678-678. 24/7.",
  },
  rainn: {
    id: "rainn",
    name: "RAINN — National Sexual Assault Hotline",
    shortName: "RAINN",
    call: "1-800-656-4673",
    description: "Free, confidential, 24/7 for survivors of sexual violence.",
  },
  samhsa: {
    id: "samhsa",
    name: "SAMHSA National Helpline",
    shortName: "SAMHSA",
    call: "1-800-662-4357",
    description:
      "Treatment referral and information for substance use and mental health.",
  },
  neda: {
    id: "neda",
    name: "NEDA Helpline",
    shortName: "NEDA",
    call: "1-800-931-2237",
    description: "Eating disorder support. Call or text.",
  },
  alzheimers: {
    id: "alzheimers",
    name: "Alzheimer's Association",
    shortName: "Alzheimer's Assoc.",
    call: "1-800-272-3900",
    description: "24/7 support for those living with dementia and caregivers.",
  },
  "911": {
    id: "911",
    name: "911 — Emergency",
    shortName: "911",
    call: "911",
    description: "Life-threatening emergencies. Police, fire, medical.",
  },
} as const;

export interface ProfessionalResource {
  id: string;
  name: string;
  url: string;
  description: string;
  best_for?: string;
}

export const PROFESSIONAL_REFERRALS: ProfessionalResource[] = [
  {
    id: "psychology_today",
    name: "Psychology Today",
    url: "https://www.psychologytoday.com/us/therapists",
    description:
      "Find a licensed therapist. Filter by insurance, modality (CBT, EMDR, IFS, DBT), identity, and location.",
    best_for: "Starting your search",
  },
  {
    id: "openpath",
    name: "Open Path Collective",
    url: "https://openpathcollective.org",
    description:
      "Network of therapists offering sessions at $30-80 on a sliding scale, for people without insurance or with financial limits.",
    best_for: "If cost is a barrier",
  },
  {
    id: "inclusive_therapists",
    name: "Inclusive Therapists",
    url: "https://www.inclusivetherapists.com",
    description:
      "Identity-affirming therapist directory. Filter for Black, Latinx, Asian, LGBTQ+, and disability-affirming clinicians.",
    best_for: "Culturally affirming care",
  },
  {
    id: "nami",
    name: "NAMI Helpline",
    url: "https://www.nami.org/help",
    description:
      "Call 1-800-950-NAMI (6264) or text 62640. Navigation, family support, and mental illness resources.",
    best_for: "Navigating the system or supporting a loved one",
  },
  {
    id: "samhsa_locator",
    name: "SAMHSA Treatment Locator",
    url: "https://findtreatment.gov",
    description:
      "Federal directory for substance use, mental health, and dual diagnosis treatment programs.",
    best_for: "Substance use or severe mental illness",
  },
  {
    id: "therapy_for_black_girls",
    name: "Therapy for Black Girls",
    url: "https://therapyforblackgirls.com/therapist-directory",
    description: "Directory and community for Black women and girls.",
  },
  {
    id: "latinx_therapy",
    name: "Latinx Therapy",
    url: "https://latinxtherapy.com",
    description: "Spanish-speaking and Latinx-affirming therapist directory.",
  },
  {
    id: "asian_mental_health",
    name: "Asian Mental Health Collective",
    url: "https://www.asianmhc.org",
    description: "Asian-affirming therapist directory and community.",
  },
];

export const PHONE_PATTERNS: Array<{ pattern: RegExp; tel: string }> = [
  { pattern: /\b988\b/g, tel: "988" },
  { pattern: /\b911\b/g, tel: "911" },
  {
    pattern: /\b1-?800-?799-?(?:7233|SAFE)\b/gi,
    tel: "18007997233",
  },
  { pattern: /\b1-?866-?488-?7386\b/g, tel: "18664887386" },
  { pattern: /\b1-?800-?656-?(?:4673|HOPE)\b/gi, tel: "18006564673" },
  { pattern: /\b1-?800-?422-?4453\b/g, tel: "18004224453" },
  { pattern: /\b1-?800-?662-?(?:4357|HELP)\b/gi, tel: "18006624357" },
  { pattern: /\b1-?800-?931-?2237\b/g, tel: "18009312237" },
  { pattern: /\b1-?800-?272-?3900\b/g, tel: "18002723900" },
  { pattern: /\b741741\b/g, tel: "741741" },
];
