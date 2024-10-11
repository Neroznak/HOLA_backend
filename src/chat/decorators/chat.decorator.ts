import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from "../../prisma.service";

export const GetChat = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user; // предполагаем, что пользователь аутентифицирован и есть в запросе
    const chatId = request.params.chatId; // получаем chatId из параметров URL

    const prisma: PrismaService = request.prisma; // получаем prisma сервис из контекста

    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) },
      include: { users: true },
    });

    // Проверяем, что чат существует и пользователь является его участником
    if (!chat || !chat.users.some(member => member.userId === user.id)) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    return chat; // возвращаем чат для дальнейшей работы
  },
);
