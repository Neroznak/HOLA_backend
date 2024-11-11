import { IsString } from "class-validator";

export class UpdateLastMessageDto {
  @IsString({
    message: "Название обязательно"
  })
  lastMessage: string;
}