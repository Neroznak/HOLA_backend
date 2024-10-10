import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { CreateMessageDto } from "./dto/create-message.dto"; // Импортируй твой DTO
import { MessageService } from "./message.service";
import { Socket } from "socket.io";

@WebSocketGateway({
  namespace: 'messages',
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly messageService: MessageService) {
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(client: Socket, payload: CreateMessageDto) {
    // Валидация входящих данных с помощью CreateMessageDto
    const { chatId } = payload;

    const message = await this.messageService.createMessage(payload); // Здесь создается сообщение в базе данных

    this.server.to(chatId.toString()).emit("message", message); // Отправка сообщения всем пользователям в чате
  }
}
