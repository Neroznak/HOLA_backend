import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";


@Injectable()
export class ChatService {
  constructor(protected readonly prisma: PrismaService) {
  }

  async getChatById(chatId: number, userId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId
      },
      include: {
        users: true
      }
    });
    if (!chat) throw new NotFoundException("Такого чата не существует");
    if (!chat.users.some(user => user.userId === userId)) throw new NotFoundException("Вы не являетесь участником этого чата");
    return chat;
  }


  async getChatsByUser(userId: number) {
    return this.prisma.chat.findMany({
      where: {
        isDeleted: false, // Фильтрация по полю isDeleted
        users: { // даём понять что поиск через связанную таблицу
          some: { // уточняем что именно ищем
            userId: userId
          }
        }
      },
      include: {
        users: {
          include: {
            User: true
          }
        }// Включаем связанные данные пользователей, если нужно
        //   messages: true, // Включаем сообщения, если нужно
      }
    });
  }


  async delete(chatId: number, userID: number) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true } // Включаем пользователей чата для проверки
    });
    if (!chat || !chat.users.some(user => user.userId === userID)) {
      throw new NotFoundException("Чат не найден или вы не участник этого чата");
    }
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { isDeleted: true } // Обновляем поле isDeleted
    });
  }


  async updateLastMessage(chatId: number, userID: number, lastMessage:string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true } // Включаем пользователей чата для проверки
    });
    if (!chat || !chat.users.some(user => user.userId === userID)) {
      throw new NotFoundException("Чат не найден или вы не участник этого чата");
    }
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { lastMessage: lastMessage } // Обновляем поле isDeleted
    });
  }


}