import { Injectable } from '@nestjs/common';
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
      orderBy: { createdAt: 'asc' },
    });
  }
}
