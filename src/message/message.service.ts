import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: dto.content,
        isRead: false,
        chatId: dto.chatId,
        userId: dto.userId,
      },
    });
  }

  async getMessagesByChat(chatId: number) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { updatedAt: 'asc' },
    });
  }

  async markAsRead(messageId: number)  {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async deleteMessage(messageId: number, userId: number){

    const message = await this.prisma.message.findUnique({ where: { id: messageId } });

    if (!message) throw new NotFoundException("Сообщения не существует")
      if (message.userId !== userId) {
        throw new ForbiddenException('You can only delete your own messages');
    }

    return this.prisma.message.delete({ where: { id: messageId } });
  }

  async updateMessage(messageId: number, userId: number, newContent: string) {
    const message = await this.prisma.message.findUnique({
      where: {
        id: messageId
      } });

    if (message.userId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }
    return this.prisma.message.update({
      where: { id: messageId },
      data: { content: newContent },
    });
  }

  async searchMessages(chatId: number, userId: number, query: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true },
    });

    // Проверяем, что пользователь является членом чата
    if (!chat || !chat.users.some(user => user.userId === userId)) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    return this.prisma.message.findMany({
      where: {
        chatId,
        content: { contains: query },
      },
    });
  }
}
