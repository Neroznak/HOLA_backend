import { IsArray, IsNotEmpty } from "class-validator";

export class IdUsersChatDto {
  @IsArray()
  @IsNotEmpty()
  userIds: number[];
}