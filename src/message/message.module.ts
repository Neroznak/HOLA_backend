import { Module } from "@nestjs/common";
import { MessageService } from "./message.service";
import { PrismaService } from "../prisma.service";
import { MessageGateway } from "./message.gateway";
import { MessageController } from "./message.controller";

@Module({
  providers: [MessageGateway, MessageService, MessageController, PrismaService],
  controllers: [MessageController]
})
export class MessageModule {
}
