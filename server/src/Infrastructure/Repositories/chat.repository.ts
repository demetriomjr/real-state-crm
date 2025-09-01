import { Injectable } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { Chat } from "@/Domain/Chat/Chat";
import { CreateChatDto, UpdateChatDto } from "@/Application/DTOs";

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: MainDatabaseContext) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ chats: Chat[]; total: number }> {
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      this.prisma.chat.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { last_message_at: "desc" },
        include: {
          messages: {
            where: { deleted_at: null },
            orderBy: { created_at: "desc" },
            take: 1,
          },
        },
      }),
      this.prisma.chat.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      chats: chats.map((chat) => new Chat(chat)),
      total,
    };
  }

  async findOne(id: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        messages: {
          where: { deleted_at: null },
          orderBy: { created_at: "asc" },
        },
      },
    });

    return chat ? new Chat(chat) : null;
  }

  async findByPersonId(personId: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        person_id: personId,
        deleted_at: null,
      },
    });

    return chat ? new Chat(chat) : null;
  }

  async findByPhone(phone: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        contact_phone: phone,
        deleted_at: null,
      },
    });

    return chat ? new Chat(chat) : null;
  }

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = await this.prisma.chat.create({
      data: {
        person_id: createChatDto.person_id,
        contact_name: createChatDto.contact_name,
        contact_phone: createChatDto.contact_phone,
        user_observations: createChatDto.user_observations,
        session_id: createChatDto.session_id,
        last_message_at: new Date(),
      },
    });

    return new Chat(chat);
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    const chat = await this.prisma.chat.update({
      where: { id },
      data: {
        ...(updateChatDto.contact_name && {
          contact_name: updateChatDto.contact_name,
        }),
        ...(updateChatDto.contact_phone && {
          contact_phone: updateChatDto.contact_phone,
        }),
        ...(updateChatDto.user_observations && {
          user_observations: updateChatDto.user_observations,
        }),
        ...(updateChatDto.last_message_at && {
          last_message_at: updateChatDto.last_message_at,
        }),
        ...(updateChatDto.session_id && {
          session_id: updateChatDto.session_id,
        }),
      },
    });

    return new Chat(chat);
  }

  async updateLastMessageAt(id: string): Promise<void> {
    await this.prisma.chat.update({
      where: { id },
      data: {
        last_message_at: new Date(),
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.chat.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: "system",
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.chat.count({
      where: {
        id,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  /**
   * PURGE - Permanently delete chat from database
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   */
  async purge(id: string): Promise<void> {
    await this.prisma.chat.delete({
      where: { id },
    });
  }
}
