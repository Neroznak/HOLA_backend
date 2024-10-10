import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get("JWT_SECRET")
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