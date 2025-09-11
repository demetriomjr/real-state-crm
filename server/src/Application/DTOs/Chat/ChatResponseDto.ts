export class ChatResponseDto {
  id: string;
  contact_name: string;
  contact_phone: string;
  user_observations?: string;
  session_id: string;
  last_message_at: Date;
  // Note: person_id and all audit fields are concealed for security reasons
}
