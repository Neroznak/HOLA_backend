import { Injectable } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { PrismaService } from "../prisma.service";

@Injectable()
export class DirectService extends ChatService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma); // Вызов конструктора родительского класса
  }

  async createDirectChat(userId1: number, userId2: number) {
    // Проверка, существует ли чат между двумя пользователями
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        AND: [
          { users: { some: { userId: userId1 } } },
          { users: { some: { userId: userId2 } } }
        ]
      }
    });
    if (existingChat) {
      if (existingChat.isDeleted) {
        return this.prisma.chat.update({
          where: { id: existingChat.id },
          data: {
            isDeleted: false
          }
        });
      }
      // Если чат существует, возвращаем его
      return existingChat;
    }
    if (userId1 === userId2) throw new Error("Нельзя создать чат с самим собой");
// Если чата не существует, создаём новый
    return this.prisma.chat.create({
      data: {
        creatorId: userId1, // Указываем, кто создает чат (можно выбрать одного из пользователей)
        users: {
          create: [
            { userId: userId1 },
            { userId: userId2 }
          ]
        }
      },
      include: {
        users: true
      }
    });
  }
}
