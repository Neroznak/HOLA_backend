import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string; // Текст сообщения

  @IsInt()
  userId: number; //  ID пользователя

  @IsInt()
  messageId: number; //  ID чата
}
