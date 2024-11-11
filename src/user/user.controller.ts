import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { CurrentUser } from "../auth/decorators/user.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Auth()
  @Get("profile")
  async getProfile(@CurrentUser("id") id: number) {
    return this.userService.getById(id);
  }

}