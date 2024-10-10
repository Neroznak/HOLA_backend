import { IsInt, IsNotEmpty } from "class-validator";

export class CreateMessageDto {
  @IsNotEmpty()
  content: string; // Текст сообщения

  @IsInt()
  userId: number; //  ID пользователя

  @IsInt()
  chatId: number; //  ID чата
}
