import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateGroupChatDto {
  @IsNotEmpty()
  chatName: string; // Название группового чата

  @IsArray()
  userIds: number[]; // Массив идентификаторов пользователей
}
