import {
  BadRequestException,
  Body,
  Controller, InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AuthDto } from "./dto/auth.dto";
import { PhoneAuthService } from "./phone.service";
import { MailAuthService } from "./mail.service";
import { PhoneDto } from "./dto/phone.dto";
import { MailDto } from "./dto/mail.dto";
import { SessionService } from "./session/session.service";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly phoneAuthService: PhoneAuthService,
              private readonly mailAuthService: MailAuthService,
              private readonly sessionService: SessionService,
              private readonly userService: UserService
  ) {
  }

  //Аутентификация
  @UsePipes(new ValidationPipe())
  @Post("login")
  async login(
    @Body() dto: AuthDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    const user = await this.userService.getByPhoneNumber(dto.phoneNumber);
    await this.sessionService.upsertSession(user.id, req.headers["user-agent"], req.ip);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }


  //Регистрация
  @UsePipes(new ValidationPipe())
  @Post("register")
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  // Получение токена из cookie и получение нового ac и rf токена
  @Post("login/access-token")
  async getNewTokens(@Req() req: Request,
                     @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME];
    console.log(req.cookies);
    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException("Refresh токен не прошёл");
    }
    const { refreshToken, ...response } = await this.authService.getNewTokens(refreshTokenFromCookies);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  //Выход из учётной записи (удаление token из cookie)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }

// Отправить sms код для верификации
  @UsePipes(new ValidationPipe())
  @Post("send-phone")
  async sendVerificationCode(@Body() phoneNumber: PhoneDto) {
    try {
      const result = await this.phoneAuthService.sendVerificationCode(phoneNumber);
      return { success: true, status: result };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to send verification code");
    }
    ;
  }


  // Метод для проверки кода верификации
  @UsePipes(new ValidationPipe())
  @Post("check-phone")
  async checkVerificationCode(
    @Body() phoneNumber: PhoneDto,
    @Body("code") code: string
  ) {
    if (!code) {
      return { success: false, message: "Code is required" };
    }
    try {
      const result = await this.phoneAuthService.checkVerificationCode(phoneNumber, code);
      return {
        success: result.status,
        phoneNumber: result.phoneNumber,
        message: "Code verified successfully"
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message); // Прокидываем сообщение об ошибке дальше
      }
      throw new InternalServerErrorException("Unexpected error during verification");
    }
  }


  @Post("send-mail")
  async sendVerificationMailCode(@Body() email: MailDto) {
    try {
      const result = await this.mailAuthService.sendVerificationEmail(email);
      return { success: result };
    } catch (error) {
      throw new BadRequestException(
        error.message || "Failed to send verification code");
    }
    ;
  }


  @Post("check-mail")
  async checkVerificationMail(
    @Body() email: MailDto,
    @Body("code") code: string
  ) {
    if (!code) {
      throw new BadRequestException("Email and code are required");
    }
    try {
      const result = await this.mailAuthService.verifyCode(email, code);
      return {
        success: result,
        message: "Code verified successfully"
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message); // Прокидываем сообщение об ошибке дальше
      }
      throw new BadRequestException("Unexpected error during verification");
    }
  }

}