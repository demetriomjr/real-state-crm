import { IAudit } from "../Interfaces/IAudit";

export class Feedback implements IAudit {
  id: string;
  chat_id: string;
  user_id: string;
  feedback_type: "positive" | "negative" | "neutral";
  generation_type: "user_prompt" | "ai_suggestion";
  user_prompt?: string;
  feedback_content: string;
  tenant_id: string;
  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: Partial<Feedback>) {
    this.id = data.id || "";
    this.chat_id = data.chat_id || "";
    this.user_id = data.user_id || "";
    this.feedback_type = data.feedback_type as
      | "positive"
      | "negative"
      | "neutral";
    this.generation_type = data.generation_type as
      | "user_prompt"
      | "ai_suggestion";
    this.user_prompt = data.user_prompt;
    this.feedback_content = data.feedback_content || "";
    this.tenant_id = data.tenant_id || "";
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }
}
