import { createParamDecorator, ExecutionContext } from "@nestjs/common";
// createParamDecorator библиотека для создания кастомных декораторов
// ExecutionContext - Универсальный объект контекста в NestJS. Он позволяет взаимодействовать с различными типами запросов: HTTP, WebSocket, RPC и т.д
// Контекст в nest.js - асбтракция для унификации доступа к данным по разным запросам (http, ws ит.д.)
import { User } from "@prisma/client";


export const CurrentUser = createParamDecorator( // используем метод создания декоратора
  (data: keyof User, ctx: ExecutionContext) => { // данные - те что будут указаны, но эт обязательно парам. USER
    // ctx - тот самый контекст запроса.
    // Определяем тип контекста
    if (ctx.getType() === 'http') { // если тип - http (почти всегда так и есть:
      const request = ctx.switchToHttp().getRequest(); // из контекста с помощью ExecutionContext получаем его данные
      const user = request.user; // достаём user'a
      return data ? user?.[data] : user; // если был задан параметр user'a - выдаём именно его. Если нет - возвращаем всего user'а
    } else if (ctx.getType() === 'ws') { // если websocket:
      const client = ctx.switchToWs().getClient(); // получаем client
      const user = client.handshake?.user; // Пользователь может храниться в handshake - это и есть connect через ws
      return data ? user?.[data] : user; // аналогично с http
    }
  },
);
