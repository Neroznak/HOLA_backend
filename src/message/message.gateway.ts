import { WebSocketGateway, OnGatewayInit, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageService } from "./message.service";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { IsReadMessageDto } from "./dto/isRead-message.dto";

@WebSocketGateway(5006, { // WebSocket сервер на порту 5006
  namespace: 'messages',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('MyGateway');
  private connectedClients: number = 0; // счетчик подключений
  constructor(private readonly messageService: MessageService) {} // Инъекция сервиса


  afterInit(server: Server) {
    this.logger.log(`WebSocket сервер запущен на порту 5006 с namespace: /messages. ${server}`);
  }

  // Логирование подключений
  handleConnection(client: Socket) {
    this.connectedClients++;
    this.logger.log(`Клиент подключён: ${client.id}. Всего подключений: ${this.connectedClients}`);
  }

  // Логирование отключений
  handleDisconnect(client: Socket) {
    this.connectedClients--;
    this.logger.log(`Клиент отключён: ${client.id}. Всего подключений: ${this.connectedClients}`);
  }

  @SubscribeMessage('newMessage')
  async handleMessage(client: Socket, payload: CreateMessageDto) {
    this.logger.log(`Сообщение получено от клиента ${client.id}: ${JSON.stringify(payload)}`);
    const createdMessage = await this.messageService.createMessage(payload);
    return `Message saved: ${createdMessage.id}`; // Возвращай ID сохраненного сообщения или другой ответ
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: Socket, payload: IsReadMessageDto): Promise<void> {
    await this.messageService.markAsRead(payload.messageId);
    client.emit('messageRead', payload.messageId);
  }

  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(client: Socket, payload: UpdateMessageDto): Promise<void> {
    await this.messageService.updateMessage(payload.messageId, payload.userId, payload.content);
    client.emit('messageRead', payload.messageId);
  }


}
