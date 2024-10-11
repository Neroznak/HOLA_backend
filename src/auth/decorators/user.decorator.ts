import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/client";

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    // Определяем тип контекста
    if (ctx.getType() === 'http') {
      // Если HTTP контекст
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;
      return data ? user?.[data] : user;
    } else if (ctx.getType() === 'ws') {
      // Если WebSocket контекст
      const client = ctx.switchToWs().getClient();
      const user = client.handshake?.user; // Пользователь может храниться в handshake
      return data ? user?.[data] : user;
    }
  },
);
