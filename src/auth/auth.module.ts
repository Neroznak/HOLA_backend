import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MailAuthService } from "./mail.service";
import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { getJwtConfig } from "../config/jwt.config";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { JWTAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PhoneAuthService } from "./phone.service";
import { SessionService } from "./session/session.service";


@Module({
  imports: [UserModule, ConfigModule,  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: getJwtConfig
  }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" } // Установите срок действия токена
    })
  ],
  controllers: [AuthController],
  exports: [JWTAuthGuard],
  providers: [AuthService, PrismaService, UserService, JwtStrategy, JWTAuthGuard, PhoneAuthService, MailAuthService, SessionService]
})


export class AuthModule {
};