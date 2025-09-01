import { Injectable, BadRequestException, Logger } from "@nestjs/common";
import {
  CreateChatDto,
  UpdateChatDto,
  CreateMessageDto,
  UpdateMessageDto,
} from "@/Application/DTOs";

@Injectable()
export class ChatValidator {
  private readonly logger = new Logger(ChatValidator.name);

  async validateCreate(createChatDto: CreateChatDto): Promise<void> {
    this.logger.log("Validating chat creation");

    if (!createChatDto.person_id) {
      throw new BadRequestException("Person ID is required");
    }

    if (
      !createChatDto.contact_name ||
      createChatDto.contact_name.trim().length === 0
    ) {
      throw new BadRequestException("Contact name is required");
    }

    if (
      !createChatDto.contact_phone ||
      createChatDto.contact_phone.trim().length === 0
    ) {
      throw new BadRequestException("Contact phone is required");
    }

    // Basic phone number validation
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(createChatDto.contact_phone)) {
      throw new BadRequestException("Invalid phone number format");
    }
  }

  async validateUpdate(updateChatDto: UpdateChatDto): Promise<void> {
    this.logger.log("Validating chat update");

    if (
      updateChatDto.contact_name !== undefined &&
      updateChatDto.contact_name.trim().length === 0
    ) {
      throw new BadRequestException("Contact name cannot be empty");
    }

    if (updateChatDto.contact_phone !== undefined) {
      if (updateChatDto.contact_phone.trim().length === 0) {
        throw new BadRequestException("Contact phone cannot be empty");
      }

      // Basic phone number validation
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(updateChatDto.contact_phone)) {
        throw new BadRequestException("Invalid phone number format");
      }
    }
  }

  async validateMessageCreate(
    createMessageDto: CreateMessageDto,
  ): Promise<void> {
    this.logger.log("Validating message creation");

    if (!createMessageDto.chat_id) {
      throw new BadRequestException("Chat ID is required");
    }

    if (!createMessageDto.message_id) {
      throw new BadRequestException("Message ID is required");
    }

    if (!createMessageDto.message_direction) {
      throw new BadRequestException("Message direction is required");
    }

    if (!["received", "sent"].includes(createMessageDto.message_direction)) {
      throw new BadRequestException(
        'Message direction must be either "received" or "sent"',
      );
    }

    if (!createMessageDto.message_type) {
      throw new BadRequestException("Message type is required");
    }

    if (
      !["text", "image", "audio", "video", "file"].includes(
        createMessageDto.message_type,
      )
    ) {
      throw new BadRequestException(
        "Message type must be one of: text, image, audio, video, file",
      );
    }

    if (
      !createMessageDto.message_content ||
      createMessageDto.message_content.trim().length === 0
    ) {
      throw new BadRequestException("Message content is required");
    }
  }

  async validateMessageUpdate(
    updateMessageDto: UpdateMessageDto,
  ): Promise<void> {
    this.logger.log("Validating message update");

    if (
      updateMessageDto.message_content !== undefined &&
      updateMessageDto.message_content.trim().length === 0
    ) {
      throw new BadRequestException("Message content cannot be empty");
    }

    if (
      updateMessageDto.message_type !== undefined &&
      !["text", "image", "audio", "video", "file"].includes(
        updateMessageDto.message_type,
      )
    ) {
      throw new BadRequestException(
        "Message type must be one of: text, image, audio, video, file",
      );
    }
  }
}
