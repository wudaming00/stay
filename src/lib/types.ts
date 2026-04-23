export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface ChatRequest {
  messages: { role: Role; content: string }[];
}
