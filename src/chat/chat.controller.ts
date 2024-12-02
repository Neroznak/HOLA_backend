import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param, ParseIntPipe, Patch,
  Post, Put,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { DirectService } from "./direct-chat.service";
import { GroupService } from "./group-chat.service";
import { IdUsersChatDto } from "./dto/id-users-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { CreateGroupChatDto } from "./dto/сreate-group.chat.dto";
import { UpdateLastMessageDto } from "./dto/update-lastmessage.dto";


@Controller("chats")
export class ChatController {
  constructor(private readonly chatService: ChatService,
              private readonly directService: DirectService,
              private readonly groupService: GroupService) {
  }

  @Auth()
  @Get("by-id/:chatId")
  async getById(@Param("chatId", ParseIntPipe) chatId: number,
                @CurrentUser("id") userId: number) {
    return this.chatService.getChatById(chatId, userId); // тест чтобы проверить как бы.. вот
  }

  @Auth()
  @Get("")
  async getChatsByUser(@CurrentUser("id") userId: number) {
    return this.chatService.getChatsByUser(userId);
  }

  @HttpCode(200)
  @Auth()
  @Patch(":chatId/delete")
  async delete(@Param("chatId", ParseIntPipe) chatId: number, @CurrentUser("id") userId: number) {
    return this.chatService.delete(chatId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post("create-direct/:friendId")
  async createDirectChat(@CurrentUser("id") userId: number, @Param("friendId", ParseIntPipe) friendId: number) {
    return this.directService.createDirectChat(userId, friendId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post("create-group")
  async createGroupChat(@Body() createGroupChatDto: CreateGroupChatDto, @CurrentUser("id") creatorId: number) {
    return this.groupService.createGroupChat(createGroupChatDto, creatorId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":chatId")
  async update(
    @Param("chatId", ParseIntPipe) chatId: number,
    @Body() dto: UpdateChatDto,
    @CurrentUser("id") userId: number) {
    return this.groupService.updateGroupChat(chatId, dto, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Patch(":chatId/add")
  async addUserToChat(
    @Param("chatId", ParseIntPipe) chatId: number,
    @Body() dto: IdUsersChatDto
  ) {
    return this.groupService.addUserToGroupChat(chatId, dto.userIds);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Patch(":chatId/remove")
  async removeUserToChat(
    @Param("chatId", ParseIntPipe) chatId: number,
    @Body() dto: IdUsersChatDto,
    @CurrentUser("id") creatorId: number
  ) {
    return this.groupService.removeUserToGroupChat(chatId, dto.userIds, creatorId);
  }


  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":chatId/lastMessage")
  async updateLastMessage(
    @Param("chatId", ParseIntPipe) chatId: number,
    @Body() dto: UpdateLastMessageDto,
    @CurrentUser("id") userId: number) {
    return this.chatService.updateLastMessage(chatId, userId, dto.lastMessage);
  }
}

