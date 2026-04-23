export type Role = "user" | "assistant";

export interface ToolEvent {
  name: "surface_resource" | "suggest_pause" | "end_with_reflection";
  input: {
    id?: string; // for surface_resource
    quote?: string; // for end_with_reflection
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

// Stream events from /api/chat (JSONL, one per line)
export type StreamEvent =
  | { type: "text"; data: string }
  | { type: "tool"; name: ToolEvent["name"]; input: ToolEvent["input"] };
