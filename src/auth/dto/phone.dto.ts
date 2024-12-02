import { IsPhoneNumber } from "class-validator";

export class PhoneDto {

  @IsPhoneNumber(null, {message: 'Некорректно задан номер телефона'})
  phoneNumber: string;
}