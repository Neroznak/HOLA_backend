import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { getJwtConfig } from "../config/jwt.config";
import { PrismaService } from "../prisma.service";
import { UserService } from "../user/user.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JWTAuthGuard } from "./guards/jwt-auth.guard";


// import { GoogleStrategy } from "./strategies/google.strategy";


@Module({
  imports: [UserModule, ConfigModule, JwtModule.registerAsync({
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
  providers: [AuthService, PrismaService, UserService, JwtStrategy, JWTAuthGuard]
})
export class AuthModule {
}