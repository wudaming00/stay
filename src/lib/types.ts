export type Role = "user" | "assistant";

export interface SafetyPlan {
  warning_signs?: string[];
  coping_strategies?: string[];
  social_contacts?: string[];
  professionals?: string[];
  means_restriction?: string;
  reasons_for_living?: string[];
}

export interface DiaryFields {
  emotion?: string;
  emotion_intensity?: number;
  urge?: string;
  urge_intensity?: number;
  urge_acted_on?: boolean;
  event_summary?: string;
  skill_used?: string;
  notes?: string;
}

export interface ToolEvent {
  name:
    | "surface_resource"
    | "suggest_pause"
    | "end_with_reflection"
    | "generate_safety_plan"
    | "log_entry";
  input: {
    id?: string; // surface_resource
    quote?: string; // end_with_reflection
    plan?: SafetyPlan; // generate_safety_plan
    entry?: DiaryFields; // log_entry
  };
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  tools?: ToolEvent[];
}

export interface ChatRequest {
  messages: { role: Role; content: string }[];
}

export type StreamEvent =
  | { type: "text"; data: string }
  | { type: "tool"; name: ToolEvent["name"]; input: ToolEvent["input"] };

export interface DiaryEntry extends DiaryFields {
  id: string;
  createdAt: number;
  sessionId: string;
}
