import { IsInt } from "class-validator";

export class IsReadMessageDto {


  @IsInt()
  messageId: number; //  ID чата
}
