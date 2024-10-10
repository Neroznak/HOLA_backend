import { IsString } from "class-validator";

export class UpdateChatDto {
  @IsString({
    message: "Название обязательно"
  })
  chatName: string;
}