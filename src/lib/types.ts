export type Role = "user" | "assistant";

export interface SafetyPlan {
  warning_signs?: string[];
  coping_strategies?: string[];
  social_contacts?: string[];
  professionals?: string[];
  means_restriction?: string;
  reasons_for_living?: string[];
}

export interface ToolEvent {
  name:
    | "surface_resource"
    | "suggest_pause"
    | "end_with_reflection"
    | "generate_safety_plan";
  input: {
    id?: string; // surface_resource
    quote?: string; // end_with_reflection
    plan?: SafetyPlan; // generate_safety_plan
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
