import { IsEmail } from "class-validator";

export class MailDto {

  @IsEmail( {}, {message: "Некорректный email"})
  email: string;
}