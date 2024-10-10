import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from "../prisma.service";
import { DirectService } from "./direct-chat.service";
import { GroupService } from "./group-chat.service";

@Module({
  controllers: [ChatController],
  providers: [ChatService, DirectService, GroupService, PrismaService],
})
export class ChatModule {}
