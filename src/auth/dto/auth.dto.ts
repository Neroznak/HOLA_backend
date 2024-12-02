import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class AuthDto {

  @IsString()
  phoneNumber: string;
  @IsString({
    message: "Номер телефона обязательно нужно указать"
  })


  @IsEmail()
  @IsOptional()
  email: string;
  @MinLength(6, {
    message: "Пароль должен содержать не менее 6 символов!"
  })


  @IsString({
    message: "Пароль обязателен"
  })
  password: string;
}