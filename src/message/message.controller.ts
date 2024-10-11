import { Controller, Get, Param, Delete, UseGuards,  Query } from "@nestjs/common";
import { MessageService } from "./message.service";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/user.decorator";

@Controller("messages")

export class MessageController {
  constructor(private readonly messageService: MessageService) {
  }

  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Get(":chatId")
  async Chat(@Param("chatId") id: string) {
    const chatId = parseInt(id, 10); // Преобразуем id в число
    return this.messageService.getMessagesByChat(chatId);
  }

  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Delete(":messageId")
  async deleteMessage(@Param("messageId") id: string,
                      @CurrentUser("id") userId: number) {
    const messageId = parseInt(id, 10); // Преобразуем id в число
    return this.messageService.deleteMessage(messageId, userId);
  }

  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Get('search/:chatId')
  async searchMessages(@Param("chatId") id: string,
                       @CurrentUser("id") userId: number,
                       @Query('query') query: string) {
    const chatId = parseInt(id, 10); // Преобразуем id в число
    return this.messageService.searchMessagesInChat(chatId, userId, query);
  }
}