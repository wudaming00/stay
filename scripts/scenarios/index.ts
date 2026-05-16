import type { Scenario } from "./types.js";
import { suicideScenarios } from "./cases/suicide.js";
import { dvScenarios } from "./cases/dv.js";
import { leverageScenarios } from "./cases/leverage.js";
import { traumaScenarios } from "./cases/trauma.js";
import { psychosisManiaScenarios } from "./cases/psychosis-mania.js";
import { ocdScenarios } from "./cases/ocd.js";
import { edScenarios } from "./cases/ed.js";
import { substanceScenarios } from "./cases/substance.js";
import { threatsScenarios } from "./cases/threats.js";
import { caregiverScenarios } from "./cases/caregiver.js";
import { dailyScenarios } from "./cases/daily.js";
import { calibrationScenarios } from "./cases/calibration.js";
import { parasocialScenarios } from "./cases/parasocial.js";
import { refusalScenarios } from "./cases/refusal.js";
import { agencyFunctionScenarios } from "./cases/agency-functions.js";
import { regimePropertyScenarios } from "./cases/regime-properties.js";

export const ALL_SCENARIOS: Scenario[] = [
  ...suicideScenarios,
  ...dvScenarios,
  ...leverageScenarios,
  ...traumaScenarios,
  ...psychosisManiaScenarios,
  ...ocdScenarios,
  ...edScenarios,
  ...substanceScenarios,
  ...threatsScenarios,
  ...caregiverScenarios,
  ...dailyScenarios,
  ...calibrationScenarios,
  ...parasocialScenarios,
  ...refusalScenarios,
  ...agencyFunctionScenarios,
  ...regimePropertyScenarios,
];

const ids = new Set<string>();
for (const s of ALL_SCENARIOS) {
  if (ids.has(s.id)) {
    throw new Error(`Duplicate scenario id: ${s.id}`);
  }
  ids.add(s.id);
}
