import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param, Patch,
  Post, Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { DirectService } from "./direct-chat.service";
import { GroupService } from "./group-chat.service";
import { JWTAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IdUsersChatDto } from "./dto/id-users-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { CreateGroupChatDto } from "./dto/сreate-group.chat.dto";


@Controller("chats")
export class ChatController {
  constructor(private readonly chatService: ChatService,
              private readonly directService: DirectService,
              private readonly groupService: GroupService) {
  }

  @Auth()
  @Get("by-id/:chatId")
  async getById(@Param("chatId") id: string,
                @CurrentUser("id") userId: number) {
    const chatId = parseInt(id, 10); // Преобразуем id в число
    return this.chatService.getChatById(chatId, userId);
  }

  @Auth()
  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Get("")
  async getChatsByUser(@CurrentUser("id") userId: number) {
    return this.chatService.getChatsByUser(userId);
  }

  @HttpCode(200)
  @Auth()
  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Patch(":chatId/delete")
  async delete(@Param("chatId") id: string, @CurrentUser("id") userId: number) {
    const chatId = parseInt(id, 10); // Преобразуем id в число
    return this.chatService.delete(chatId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Auth()
  @Post("create-direct")
  async createDirectChat(@CurrentUser("id") userId: number, @Body() IdUsersChatDto: IdUsersChatDto) {
    return this.directService.createDirectChat(userId, IdUsersChatDto.userId2);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Auth()
  @Post("create-group")
  async createGroupChat(@Body() createGroupChatDto: CreateGroupChatDto, @CurrentUser("id") creatorId:number) {
    return this.groupService.createGroupChat(createGroupChatDto, creatorId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Auth()
  @Put(":chatId")
  async update(
    @Param("chatId") id: string,
    @Body() dto: UpdateChatDto,
    @CurrentUser("id") userId: number)
 {
    const chatId = parseInt(id, 10); // Преобразуем id в число
    return this.groupService.updateGroupChat(chatId, dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Auth()
  @Patch(":chatId/add")
  async addUserToChat(
    @Param("chatId") id: string,
    @Body() dto: IdUsersChatDto
  ) {
    const chatId = parseInt(id, 10); // Преобразуем id в число
    return this.groupService.addUserToGroupChat(chatId, dto.userId2);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @UseGuards(JWTAuthGuard) // Применение защитного механизма
  @Auth()
  @Patch(":chatId/remove")
  async removeUserToChat(
    @Param("chatId") id: string,
    @Body() dto: IdUsersChatDto,
    @CurrentUser("id") creatorId: number,
  ) {
    const chatId = parseInt(id, 10); // Преобразуем id в число
    return this.groupService.removeUserToGroupChat(chatId, dto.userId2, creatorId);
  }
}

