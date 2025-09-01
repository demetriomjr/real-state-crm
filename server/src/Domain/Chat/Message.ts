export class Message {
  id: string;
  chat_id: string;
  user_id?: string;
  message_id: string;
  message_direction: "received" | "sent";
  message_type: "text" | "image" | "audio" | "video" | "file";
  message_content: string;

  created_at: Date;
  created_by?: string;
  updated_at: Date;
  updated_by?: string;
  deleted_at?: Date;
  deleted_by?: string;

  constructor(data: any) {
    this.id = data.id || "";
    this.chat_id = data.chat_id || "";
    this.user_id = data.user_id;
    this.message_id = data.message_id || "";
    this.message_direction = data.message_direction as "received" | "sent";
    this.message_type = data.message_type as
      | "text"
      | "image"
      | "audio"
      | "video"
      | "file";
    this.message_content = data.message_content || "";
    this.created_at = data.created_at || new Date();
    this.created_by = data.created_by;
    this.updated_at = data.updated_at || new Date();
    this.updated_by = data.updated_by;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }
}
