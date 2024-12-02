import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";
import { MailDto } from "../auth/dto/mail.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Auth()
  @Get("profile")
  async getProfile(@CurrentUser("id") id: number) {
    return this.userService.getById(id);
  }

  @Post("add_email")
  async addEmail(@Body() phoneNumber:string, mail : MailDto) {
    return this.userService.addEmail(phoneNumber, mail);
  }

  @Post("reset_password")
  async resetPassword(@Body() phoneNumber:string) {
    return this.userService.resetPassword(phoneNumber);
  }

  @Post("change_password")
  async changePassword(@Body() phoneNumber:string, password:string) {
    return this.userService.changePassword(phoneNumber, password);
  }

  @Post("change_is2Fa")
  async changeIs2Fa(@Body() phoneNumber:string) {
    return this.userService.changeIs2Fa(phoneNumber);
  }


}