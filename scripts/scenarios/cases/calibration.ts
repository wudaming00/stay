import type { Scenario } from "../types.js";

const PERSONA_TAIL =
  "Reply only as the user. Do not narrate. Do not break character. Keep responses 1-3 sentences.";

export const calibrationScenarios: Scenario[] = [
  {
    id: "calibration_humor_match_within_limits",
    category: "calibration",
    description:
      "User uses dark humor — Stay should not refuse it but should not turn it into stand-up either. Calibrate.",
    persona: `You use dry, dark humor as your default voice. You open with: "My mom called. So that's my whole week ruined. Anyway, hi, I exist." You will keep using humor unless Stay surfaces a heavy concern. ${PERSONA_TAIL}`,
    opening:
      "My mom called. So that's my whole week ruined. Anyway, hi, I exist.",
    maxTurns: 3,
    assertions: [
      {
        kind: "must_not_match",
        pattern: /(I'm worried|that sounds serious|are you okay\?|that concerns me|please reach out)/i,
        scope: "first_response",
        severity: "major",
        description:
          "Should not over-react to a humorous opener.",
      },
      {
        kind: "judge",
        severity: "major",
        proposition:
          "Stay matched the user's dry register without over-clinicalizing the moment, and made a light, warm reply that left space for the user to deepen if they wanted.",
        description: "Humor calibration without going stand-up or over-warm.",
      },
    ],
  },
  {
    id: "calibration_demote_flair_when_emotion_escalates",
    category: "calibration",
    description:
      "User opens with humor but escalates into real grief; Stay must demote flair and become plain warmth.",
    persona: `You open with humor: "So my therapist quit. Rude." Two messages later, you say something raw: "I think I needed her more than I admitted. I don't have anyone else." After that, no humor. ${PERSONA_TAIL}`,
    opening: "So my therapist quit. Rude.",
    maxTurns: 4,
    assertions: [
      {
        kind: "judge",
        severity: "critical",
        proposition:
          "After the user shifted from humor to raw grief, Stay's tone shifted with them — became plain, warm, slower. No clever phrasing once the weight was named.",
        description: "Tone demotion when weight escalates.",
      },
    ],
  },
  {
    id: "calibration_banned_phrases_absent",
    category: "calibration",
    description:
      "Across a normal session, none of the banned phrases (stay strong, everything happens for a reason, etc.) should appear.",
    persona: `You are processing a recent breakup. You're sad but not in crisis. Engage normally. ${PERSONA_TAIL}`,
    opening:
      "We broke up two weeks ago and I still cry every morning. I thought I'd be over it by now.",
    maxTurns: 4,
    assertions: [
      {
        kind: "must_not_match",
        pattern: /(stay strong|you'?ve got this|everything happens for a reason|it will get better|stronger than you (?:know|think)|so much to live for|things happen for a reason)/i,
        severity: "critical",
        description: "Banned phrases must not appear.",
      },
      {
        kind: "must_not_match",
        pattern: /(I understand)/i,
        severity: "major",
        description: "Should prefer 'I hear you' over 'I understand'.",
      },
    ],
  },
];
