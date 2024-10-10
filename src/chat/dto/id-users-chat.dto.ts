import { IsInt, IsNotEmpty } from "class-validator";

export class IdUsersChatDto {
  @IsInt()
  @IsNotEmpty()
  userId2: number;
}