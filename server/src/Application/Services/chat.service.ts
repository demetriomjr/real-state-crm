import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { ChatRepository } from "@/Infrastructure/Repositories/chat.repository";
import { MessageRepository } from "@/Infrastructure/Repositories/message.repository";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { Chat } from "@/Domain/Chat/Chat";
import { Message } from "@/Domain/Chat/Message";
import {
  CreateChatDto,
  UpdateChatDto,
  ChatResponseDto,
  CreateMessageDto,
  UpdateMessageDto,
  MessageResponseDto,
} from "@/Application/DTOs";
import { N8NWhatsappService } from "./n8n-whatsapp.service";

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
    private readonly whatsappSessionRepository: WhatsappSessionRepository,
    private readonly n8nWhatsappService: N8NWhatsappService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    chats: ChatResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log(
      `Fetching chats with pagination: page=${page}, limit=${limit}`,
    );
    const result = await this.chatRepository.findAll(page, limit);
    return {
      chats: result.chats.map((chat) => this.mapChatToResponseDto(chat)),
      total: result.total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ChatResponseDto> {
    this.logger.log(`Fetching chat with ID: ${id}`);
    const chat = await this.chatRepository.findOne(id);
    if (!chat) {
      this.logger.warn(`Chat with ID ${id} not found`);
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return this.mapChatToResponseDto(chat);
  }

  async create(createChatDto: CreateChatDto): Promise<ChatResponseDto> {
    this.logger.log(`Creating new chat for person: ${createChatDto.person_id}`);
    const chat = await this.chatRepository.create(createChatDto);
    this.logger.log(`Chat created successfully with ID: ${chat.id}`);
    return this.mapChatToResponseDto(chat);
  }

  async update(
    id: string,
    updateChatDto: UpdateChatDto,
  ): Promise<ChatResponseDto> {
    this.logger.log(`Updating chat with ID: ${id}`);

    const existingChat = await this.chatRepository.findOne(id);
    if (!existingChat) {
      this.logger.warn(`Chat with ID ${id} not found for update`);
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    const chat = await this.chatRepository.update(id, updateChatDto);
    this.logger.log(`Chat updated successfully with ID: ${chat.id}`);
    return this.mapChatToResponseDto(chat);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing chat with ID: ${id}`);

    const existingChat = await this.chatRepository.findOne(id);
    if (!existingChat) {
      this.logger.warn(`Chat with ID ${id} not found for removal`);
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    await this.chatRepository.remove(id);
    this.logger.log(`Chat removed successfully with ID: ${id}`);
  }

  async findMessages(
    chatId: string,
    lastMessageDateTime?: Date,
    page: number = 1,
    limit: number = 50,
  ): Promise<{
    messages: MessageResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log(`Fetching messages for chat: ${chatId}`);
    const result = await this.messageRepository.findByChatId(
      chatId,
      lastMessageDateTime,
      page,
      limit,
    );
    return {
      messages: result.messages.map((message) =>
        this.mapMessageToResponseDto(message),
      ),
      total: result.total,
      page,
      limit,
    };
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    this.logger.log(
      `Creating new message for chat: ${createMessageDto.chat_id}`,
    );

    // Check if chat exists
    const chat = await this.chatRepository.findOne(createMessageDto.chat_id);
    if (!chat) {
      this.logger.warn(`Chat with ID ${createMessageDto.chat_id} not found`);
      throw new NotFoundException(
        `Chat with ID ${createMessageDto.chat_id} not found`,
      );
    }

    // Check if message already exists
    const existingMessage = await this.messageRepository.findByMessageId(
      createMessageDto.message_id,
    );
    if (existingMessage) {
      this.logger.warn(
        `Message with ID ${createMessageDto.message_id} already exists`,
      );
      // Update the message if content is different
      if (
        existingMessage.message_content !== createMessageDto.message_content
      ) {
        const updatedMessage = await this.messageRepository.update(
          existingMessage.id,
          {
            message_content: createMessageDto.message_content,
            message_type: createMessageDto.message_type,
          },
        );
        return this.mapMessageToResponseDto(updatedMessage);
      }
      return this.mapMessageToResponseDto(existingMessage);
    }

    const message = await this.messageRepository.create(createMessageDto);

    // Update chat's last_message_at
    await this.chatRepository.updateLastMessageAt(createMessageDto.chat_id);

    // If it's a sent message, send it via WhatsApp via n8n
    if (createMessageDto.message_direction === "sent") {
      await this.sendMessageToN8N(createMessageDto, chat);
    }

    this.logger.log(`Message created successfully with ID: ${message.id}`);
    return this.mapMessageToResponseDto(message);
  }

  async createMessages(
    createMessageDtos: CreateMessageDto[],
  ): Promise<MessageResponseDto[]> {
    this.logger.log(`Creating ${createMessageDtos.length} messages`);

    const messages = await this.messageRepository.createMany(createMessageDtos);

    // Update chat's last_message_at for each unique chat
    const uniqueChatIds = [
      ...new Set(createMessageDtos.map((dto) => dto.chat_id)),
    ];
    for (const chatId of uniqueChatIds) {
      await this.chatRepository.updateLastMessageAt(chatId);
    }

    // Send sent messages via WhatsApp via n8n
    const sentMessages = createMessageDtos.filter(
      (dto) => dto.message_direction === "sent",
    );
    for (const messageDto of sentMessages) {
      const chat = await this.chatRepository.findOne(messageDto.chat_id);
      if (chat) {
        await this.sendMessageToN8N(messageDto, chat);
      }
    }

    this.logger.log(`${messages.length} messages created successfully`);
    return messages.map((message) => this.mapMessageToResponseDto(message));
  }

  async updateMessage(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessageResponseDto> {
    this.logger.log(`Updating message with ID: ${id}`);

    const existingMessage = await this.messageRepository.findOne(id);
    if (!existingMessage) {
      this.logger.warn(`Message with ID ${id} not found for update`);
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    const message = await this.messageRepository.update(id, updateMessageDto);
    this.logger.log(`Message updated successfully with ID: ${message.id}`);
    return this.mapMessageToResponseDto(message);
  }

  async findByPersonId(personId: string): Promise<ChatResponseDto | null> {
    this.logger.log(`Fetching chat by person ID: ${personId}`);
    const chat = await this.chatRepository.findByPersonId(personId);
    return chat ? this.mapChatToResponseDto(chat) : null;
  }

  async findByPhone(phone: string): Promise<ChatResponseDto | null> {
    this.logger.log(`Fetching chat by phone: ${phone}`);
    const chat = await this.chatRepository.findByPhone(phone);
    return chat ? this.mapChatToResponseDto(chat) : null;
  }

  async findByMessageId(messageId: string): Promise<MessageResponseDto | null> {
    this.logger.log(`Fetching message by message ID: ${messageId}`);
    const message = await this.messageRepository.findByMessageId(messageId);
    return message ? this.mapMessageToResponseDto(message) : null;
  }

  /**
   * PURGE - Permanently delete chat and all related entities
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   * NOT EXPOSED TO CONTROLLERS - Service level only
   */
  async purge(id: string): Promise<void> {
    this.logger.warn(`PURGING chat with ID: ${id} - PERMANENT DELETION`);

    const existingChat = await this.chatRepository.findOne(id);
    if (!existingChat) {
      this.logger.warn(`Chat with ID ${id} not found for purge`);
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }

    // Purge related entities first
    await this.messageRepository.purgeByChat(id);

    // Finally purge the chat
    await this.chatRepository.purge(id);

    this.logger.warn(`Chat PURGED permanently with ID: ${id}`);
  }

  private mapChatToResponseDto(chat: Chat): ChatResponseDto {
    return {
      id: chat.id,
      contact_name: chat.contact_name,
      contact_phone: chat.contact_phone,
      user_observations: chat.user_observations,
      session_id: chat.session_id,
      last_message_at: chat.last_message_at,
    };
  }

  private mapMessageToResponseDto(message: Message): MessageResponseDto {
    return {
      id: message.id,
      chat_id: message.chat_id,
      user_id: message.user_id,
      message_id: message.message_id,
      message_direction: message.message_direction,
      message_type: message.message_type,
      message_content: message.message_content,
      created_at: message.created_at,
      updated_at: message.updated_at,
    };
  }

  private async sendMessageToN8N(
    messageDto: CreateMessageDto,
    chat: Chat,
  ): Promise<void> {
    try {
      const whatsappSession = await this.whatsappSessionRepository.findOne(
        chat.session_id,
      );
      if (!whatsappSession) {
        this.logger.warn(
          `WhatsappSession not found for session ID: ${chat.session_id}`,
        );
        return;
      }

      await this.n8nWhatsappService.sendMessage(
        whatsappSession.session_name,
        chat.contact_phone,
        messageDto.message_content,
      );

      this.logger.log(
        `Message sent to n8n successfully: ${messageDto.message_id}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Error sending message to n8n: ${error.message}`,
        error.stack,
      );
    }
  }
}
