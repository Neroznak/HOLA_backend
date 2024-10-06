import {
  Body,
  Controller, Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException, UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { AuthDto } from "../user/dto/user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  //Аутентификация
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login")
  async login(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.login(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  //Регистрация
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("register")
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...response } = await this.authService.register(dto);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  // Получение токена из cookie и добавление его в запрос
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("login/access-token")
  async getNewTokens(@Req() req: Request,
                     @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME];
    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res);
      throw new UnauthorizedException("Refresh токен не прошёл");
    }
    const { refreshToken, ...response } = await this.authService.getNewTokens(refreshTokenFromCookies);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return response;
  }

  //Выход из учётной записи (удаление token из cookie)
  @HttpCode(200)
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenFromResponse(res);
    return true;
  }

  //Авторизация через google
  // @Get("google")
  // @UseGuards(AuthGuard("google"))
  // async googleAuth(@Req() _req) {
  // }
  //
  // //Переадресация после авторизации в google
  // @Get("google/callback")
  // @UseGuards(AuthGuard("google"))
  // async googleAuthCallback(
  //   @Req() req,
  //   @Res({ passthrough: true }) res: Response
  // ) {
  //   const { refreshToken, ...response } =
  //     await this.authService.validateOAuthLogin(req);
  //   this.authService.addRefreshTokenToResponse(res, refreshToken);
  //   return res.redirect(`${process.env["CLIENT_URL"]}/dashboard?accessToken=${response.accessToken}`
  //   );
  // }


}