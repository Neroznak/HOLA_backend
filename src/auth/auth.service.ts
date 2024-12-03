import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { AuthDto } from "./dto/auth.dto";
import { verify } from "argon2";
import { PrismaService } from "../prisma.service";
import * as QRCode from "qrcode";


@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = "refreshToken";

  constructor(private jwt: JwtService,
              private userService: UserService,
              private configService: ConfigService,
              private prisma: PrismaService) {
  }

  async login(dto: AuthDto) { // наверное сюда стоит добавить проверку в cookie токена
    const user = await this.validateUser(dto);
    const isValidPassword = await this.verifyPassword(dto.password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException("Неверный пароль");
    }
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByPhoneNumber(dto.phoneNumber);
    if (oldUser) throw new BadRequestException("Пользователь уже существует");
    const user = await this.userService.create(dto);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  // Проверяет старый refreshtoken и задаёт новые значения ac и rf, ссылаясь на функцию issueTokens
  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException("Невалидный refresh token");
    const user = await this.userService.getById(result.id);
    const tokens = this.issueTokens(user.id);
    return { user, ...tokens };
  }

  // Непосредственно назначает новые ac и rf для user'а
  issueTokens(userId: number) {
    const data = { id: userId };
    const accessToken = this.jwt.sign(data, {
      expiresIn: "1h"
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: "7d"
    });

    return { accessToken, refreshToken };
  }

  // Проверяет, существует ли пользователь по phoneNumber
  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByPhoneNumber(dto.phoneNumber);
    if (!user) throw new NotFoundException("Пользователь не найден");
    return user;
  }


  // добавляет в cookie новый refresh
  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get("SERVER_DOMAIN"),
      expires: expiresIn,
      secure: true,
      sameSite: "none"
    });
  }

  // удаляет refresh токен
  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, "", {
      httpOnly: true,
      domain: this.configService.get("SERVER_DOMAIN"),
      expires: new Date(0),
      secure: true,
      sameSite: "none"
    });
  }

// проверка пароля
  async verifyPassword(enteredPassword: string, hashedPassword: string): Promise<boolean> {
    return await verify(hashedPassword, enteredPassword);
  }


  // Кнопка, которая проверяет отсканировали ли уже QR код. Если да - авторизируй пользователя.
  async checkByQr(sid: string) {
    const session = await this.prisma.session.findUnique({
      where:
        { sid: sid }
    });
    if (!session) throw new NotFoundException("Ваш QR код ещё не отсканирован");
    const user = await this.userService.getById(session.user_id);
    const tokens = this.issueTokens(session.user_id);
    return { user, ...tokens };
  }


}

