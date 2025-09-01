export class FeedbackResponseDto {
  id: string;
  chat_id: string;
  user_id: string;
  feedback_type: "positive" | "negative" | "neutral";
  feedback_content: string;
  created_at: Date;
}
