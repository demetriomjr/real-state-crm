import { Injectable } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { Message } from "@/Domain/Chat/Message";
import { CreateMessageDto, UpdateMessageDto } from "@/Application/DTOs";

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: MainDatabaseContext) {}

  async findByChatId(
    chatId: string,
    lastMessageDateTime?: Date,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ messages: Message[]; total: number }> {
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      chat_id: chatId,
      deleted_at: null,
    };

    if (lastMessageDateTime) {
      whereCondition.created_at = {
        gt: lastMessageDateTime,
      };
    }

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { created_at: "asc" },
      }),
      this.prisma.message.count({
        where: whereCondition,
      }),
    ]);

    return {
      messages: messages.map((message) => new Message(message)),
      total,
    };
  }

  async findOne(id: string): Promise<Message | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    return message ? new Message(message as any) : null;
  }

  async findByMessageId(messageId: string): Promise<Message | null> {
    const message = await this.prisma.message.findFirst({
      where: {
        message_id: messageId,
        deleted_at: null,
      },
    });

    return message ? new Message(message as any) : null;
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        chat_id: createMessageDto.chat_id,
        user_id: createMessageDto.user_id,
        message_id: createMessageDto.message_id,
        message_direction: createMessageDto.message_direction,
        message_type: createMessageDto.message_type,
        message_content: createMessageDto.message_content,
      },
    });

    return new Message(message as any);
  }

  async createMany(createMessageDtos: CreateMessageDto[]): Promise<Message[]> {
    await this.prisma.message.createMany({
      data: createMessageDtos.map((dto) => ({
        chat_id: dto.chat_id,
        user_id: dto.user_id,
        message_id: dto.message_id,
        message_direction: dto.message_direction,
        message_type: dto.message_type,
        message_content: dto.message_content,
      })),
    });

    // Fetch the created messages to return them
    const createdMessages = await this.prisma.message.findMany({
      where: {
        chat_id: { in: createMessageDtos.map((dto) => dto.chat_id) },
        message_id: { in: createMessageDtos.map((dto) => dto.message_id) },
      },
      orderBy: { created_at: "asc" },
    });

    return createdMessages.map((message) => new Message(message as any));
  }

  async update(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.prisma.message.update({
      where: { id },
      data: {
        ...(updateMessageDto.message_content && {
          message_content: updateMessageDto.message_content,
        }),
        ...(updateMessageDto.message_type && {
          message_type: updateMessageDto.message_type,
        }),
      },
    });

    return new Message(message as any);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.message.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: "system",
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.message.count({
      where: {
        id,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  async existsByMessageId(messageId: string): Promise<boolean> {
    const count = await this.prisma.message.count({
      where: {
        message_id: messageId,
        deleted_at: null,
      },
    });
    return count > 0;
  }
}
