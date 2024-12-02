import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  // PassportStrategy — базовый класс для настройки стратегий аутентификации в @nestjs/passport.
  // Strategy — стратегия JWT из библиотеки passport-jwt.
  // "jwt" — уникальное имя стратегии. Его можно использовать для явного указания, что именно эта стратегия (например, в Guards).
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Указывает, что JWT-токен будет извлекаться из заголовка Authorization в формате Bearer <token>.
      ignoreExpiration: true, // Указывает, что токен может быть использован, даже если его срок действия истёк.
      secretOrKey: configService.get("JWT_SECRET") // Указывает секретный ключ для проверки подписи JWT. Этот ключ должен совпадать с тем, который использовался для генерации токена.
    });
  }

  async validate(payload: { id: number }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id }
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Здесь должен возвращаться сам объект пользователя
  }
}