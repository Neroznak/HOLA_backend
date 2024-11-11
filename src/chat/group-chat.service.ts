import { Injectable, NotFoundException } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { PrismaService } from "../prisma.service";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { CreateGroupChatDto } from "./dto/сreate-group.chat.dto";

@Injectable()
export class GroupService extends ChatService {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma); // Вызов конструктора родительского класса
  }

  async createGroupChat(createGroupChatDto: CreateGroupChatDto, creatorId: number) {
    const { chatName, userIds } = createGroupChatDto;
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        isGroup: true, // Убедимся, что это групповой чат
        users: {
          every: {
            userId: {
              in: userIds // Проверяем, входят ли все указанные пользователи в этот чат
            }
          }
        }
      }
    });
    if (existingChat) {
      throw new Error("Групповой чат с этими пользователями уже существует."); // Возвращаем ошибку, если чат найден
    }
    return this.prisma.chat.create({
      data: {
        chatName,
        isGroup: true,
        creatorId: creatorId,
        users: {
          create: userIds.map(userId => ({
            userId: userId // Здесь userId указывает на поле в UserChat, связывающее пользователей с чатом
          }))
        }
      }
    });
  }

  async updateGroupChat(chatId: number, dto: UpdateChatDto, userId: number) {
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        isGroup: true,  // Убедимся, что это групповой чат
        id: chatId,
        users: {
          some: {
            userId: userId // Проверяем, входят ли все указанные пользователи в этот чат
          }
        }
      }
    });
    if (!existingChat) throw new NotFoundException("Либо тебя в чате нет, либо это личка");
    return this.prisma.chat.update({
      where: { id: chatId },
      data: {
        chatName: dto.chatName
      }
    });
  }

  async addUserToGroupChat(chatId: number, userIds: number[]) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true } // Включаем информацию о пользователях чата
    });
    if (!chat) throw new Error("Чат не найден");
    if (!chat.isGroup) throw new Error("Нельзя добавить пользователя в direct-чат");
    const userAlreadyInChat = chat.users.some(user => user.userId in userIds);
    if (userAlreadyInChat) throw new Error("Пользователь уже находится в чате");
    return this.prisma.chat.update({
      where: { id: chatId },
      data: {
        users: {
          create: userIds.map(userId => ({
            userId: userId
          }))
        }
      }
    });
  }

  async removeUserToGroupChat(chatId: number, userIds: number[], creatorId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true } // Включаем информацию о пользователях чата
    });
    if (!chat) throw new NotFoundException("Чат не существует");
    if (chat.creatorId !== creatorId) throw new NotFoundException("Вы не создатель этой беседы");
    if (!chat.isGroup) throw new NotFoundException("Нельзя удалять пользователя из direct-чата");
    const userInChat = chat.users.some(user => user.userId in userIds);
    if (!userInChat) throw new NotFoundException("Пользователь не находится в чате");
    try {
      // Удаляем связь пользователя с чатом
      await this.prisma.userChat.deleteMany({
        where: {
          chatId: chatId,
          userId: {
            in: userIds,
          },
        }
      });

      // Возвращаем обновленный чат
      return this.prisma.chat.findUnique({
        where: { id: chatId },
        include: {
          users: true // Включаем пользователей, чтобы вернуть обновленный список
        }
      });
    } catch (error) {
      // Обработка ошибок
      throw new Error("Не удалось удалить пользователя из чата: " + error.message);
    }
  }


}
