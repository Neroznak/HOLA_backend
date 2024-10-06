# Настройка проекта
1. Удаляем ненужные файлы: папку test, app.service, app.controller, app.spec
2. .prettierrc -> переименую в prettier.config.js
Редактирую его в:
`module.exports = {
singleQuote: true, // Использовать одинарные кавычки вместо двойных
trailingComma: 'none', // Не добавлять запятые в конце списков и объектов
tabWidth: 2, // Устанавливает ширину табуляции в 2 пробела
useTabs: false, // Использовать пробелы вместо табуляций для отступов
semi: true, // Добавлять точку с запятой в конце каждой строки
printWidth: 80, // Устанавливает максимальную длину строки в 80 символов
endOfLine: 'auto' // Автоматически определяет стиль окончания строки (CR, LF, CRLF) в зависимости от текущей операционной системы
};`
но можно оставить .prettierc и сделать как у teacode (но лучше не надо):
`{
"trailingComma": "none",
"useTabs": true,
"semi": false,
"tabWidth": 4,
"jsxSingleQuote": true,
"singleQuote": true,
"arrowParens": "avoid"
}`
3. eslintrc.js редактирую:
`module.exports = {
env: {
browser: true,
es2021: true,
node: true,
},
extends: [
'eslint:recommended',
'plugin:@typescript-eslint/recommended',
'prettier',
],
parser: '@typescript-eslint/parser',
parserOptions: {
ecmaVersion: 12,
sourceType: 'module',
},
plugins: [
'@typescript-eslint',
'prettier',
],
rules: {
"no-unused-vars": 0,
"@typescript-eslint/no-unused-vars": 2,
}
};`
4. **pnpm add @nestjs/config class-validator class-transformer @nestjs/jwt @nestjs/passport passport passport-jwt passport-google-oauth20 passport-yandex cookie-parser argon2 dayjs fs-extra @nestjs/serve-static app-root-path @prisma/client @a2seven/yoo-checkout**
5. **pnpm add -D @types/multer @types/fs-extra @types/passport-jwt @types/passport-google-oauth20 @types/cookie-parser**

# Настройка базы данных

6. **pnpm global add @nestjs/cli** **pnpm global add prisma** тут надо глобально установить prisma на компьютер. я это уже сделал. делается через эти команды. Если не работает: ПКМ на mycomputer -> свойства -> дополнительные настройки системы -> переменные среды -> сlick on PATH -> создать -> новый путь можно узнать командой в cmd  **yarn global bin** -> сохранить и перезапустить терминал
7. **prisma init**
8. .env `DATABASE_URL=postgresql://postgres:Nero00900@localhost:5432/shopLearn?schema=public` где postgres:Nero00900@localhost:5432 всегда едино, это как бы мой аккаунт postgres. db=shopLearn. Легко создать в bekeeperstudio or pgadmin
9. заполняем код архитектуры bd в schema.prisma:
   `generator client {
   provider = "prisma-client-js"
   }
datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}
model User {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
email    String  @unique
password String?
name    String @default("не указано")
picture String @default("/uploads/no-user-image.png")
stores Store[]
favorites Product[]
reviews   Review[]
orders Order[]
@@map("user")
}
model Store {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
title       String
description String?
user   User?   @relation(fields: [userId], references: [id])
userId String? @map("user_id")
products   Product[]
categories Category[]
colors     Color[]
reviews   Review[]
orderItem OrderItem[]
@@map("store")
}
model Product {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
title       String
description String
price       Int
images      String[]
reviews Review[]
store   Store?  @relation(fields: [storeId], references: [id])
storeId String? @map("store_id")
orderItems OrderItem[]
category   Category? @relation(fields: [categoryId], references: [id])
categoryId String?   @map("category_id")
color   Color?  @relation(fields: [colorId], references: [id])
colorId String? @map("color_id")
user    User?   @relation(fields: [userId], references: [id])
userId  String? @map("user_id")
@@map("product")
}
model Category {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
title       String
description String
products Product[]
store    Store?    @relation(fields: [storeId], references: [id])
storeId  String?   @map("store_id")
@@map("category")
}
model Color {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
name  String
value String
products Product[]
store    Store?    @relation(fields: [storeId], references: [id])
storeId  String?   @map("store_id")
@@map("color")
}
model Review {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
text      String
rating    Int
user      User?    @relation(fields: [userId], references: [id])
userId    String?  @map("user_id")
product   Product? @relation(fields: [productId], references: [id])
productId String?  @map("product_id")
store     Store?   @relation(fields: [storeId], references: [id])
storeId   String?  @map("store_id")
@@map("review")
}
model Order {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
status EnumOrderStatus @default(PENDING)
items  OrderItem[]
total  Int
user   User?       @relation(fields: [userId], references: [id])
userId String?     @map("user_id")
@@map("order")
}
model OrderItem {
id        String   @id @default(cuid())
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")
quantity Int
price    Int
order     Order?   @relation(fields: [orderId], references: [id])
orderId   String?  @map("order_id")
product   Product? @relation(fields: [productId], references: [id])
productId String?  @map("product_id")
store     Store?   @relation(fields: [storeId], references: [id])
storeId   String?  @map("store_id")
@@map("order_item")
}
enum EnumOrderStatus {
PENDING
PAYED
}`

9. **prisma db push** а потом **prisma generate**
10. в папке src создаём prisma.service.ts, а туда код:
    `import { Injectable, OnModuleInit } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';
    @Injectable()
    export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
    await this.$connect();
    }
    }` ЭТО КОД ИЗ ДОКУМЕНТАЦИИ NEST.JS в разделе prisma
11. .env
    `DATABASE_URL=postgresql://postgres:Nero00900@localhost:5432/shopLearn?schema=public
    CLIENT_URL=http://localhost:3000
    SERVER_URL=http://localhost:5000
    SERVER_DOMAIN=localhost`
12. main.ts
13. `import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import * as cookieParser from 'cookie-parser';
    async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    exposedHeaders: 'set-cookie'
    });
    await app.listen(5000);
    }
    bootstrap();`
14. app.module:
    `import { Module } from '@nestjs/common';
    import { ConfigModule } from '@nestjs/config';
@Module({
imports: [ConfigModule.forRoot()]
})
export class AppModule {}`

# Авторизация

15. **nest g res auth --no-spec** **nest g res user --no-spec**
16. src -> config -> jwt.config.ts:
    `import { ConfigService } from '@nestjs/config'
    import { JwtModuleOptions } from '@nestjs/jwt'
    export const getJwtConfig = async (
    configService: ConfigService
    ): Promise<JwtModuleOptions> => ({
    secret: configService.get('JWT_SECRET')
    })` берётся автоматом из документации
17. user.module:
    `providers: [UserService, PrismaService]`
18. user.service
    `import { Injectable } from '@nestjs/common';
    import { PrismaService } from '../prisma.service';
    import { hash } from 'argon2';
    import { AuthDto } from '../auth/dto/auth.dto';
@Injectable()
export class UserService {
constructor(private readonly prisma: PrismaService) {}
async getById(id: string) {
const user = await this.prisma.user.findUnique({
where: { id: id },
include: {
stores: true,
favorites: true,
orders: true
}
});
return user;
}
async getByEmail(email: string) {
const user = await this.prisma.user.findUnique({
where: { email: email },
include: {
stores: true,
favorites: true,
orders: true
}
});
return user;
}
async toggleFavorite(productId:string, userId:string) {
const user = await this.getById(userId);
const isExists = user.favorites.some(
product => product.id === productId);
await this.prisma.user.update({
where: { id: userId },
data: {
favorites: {
[isExists ? "disconnect" : "connect"]: {
id: productId
}
}
}
});
return true;
}
async create(dto: AuthDto) {
return this.prisma.user.create({
data: {
name: dto.name,
email: dto.email,
password: await hash(dto.password)
}
});
}
}`
19. user.controller -> `@Controller('users')`
19. auth -> dto -> auth.dto
    `import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class AuthDto {
@IsOptional()
@IsString()
name: string;
@IsString({
message: 'Почта обязательна'
})
@IsEmail()
email: string;
@MinLength(6,{
message: 'Пароль должен содержать не менее 6 символов!'
})
@IsString({
message: 'Пароль обязателен'
})
password: string;
}`
20. auth -> strategies -> jwt.strategy :
    `import { PassportStrategy } from '@nestjs/passport';
    import { ConfigService } from '@nestjs/config';
    import { UserService } from '../../user/user.service';
    import { ExtractJwt, Strategy } from 'passport-jwt';
    import { Injectable, UnauthorizedException } from "@nestjs/common";
    import { PrismaService } from "../../prisma.service";
    @Injectable()
    export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
    private configService: ConfigService,
    private userService: UserService,
    private prisma: PrismaService,
    ) {
    super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: true,
    secretOrKey: configService.get('JWT_SECRET')
    });
    }
    async validate(payload: { id: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
    throw new UnauthorizedException();
    }
    return user; // Здесь должен возвращаться сам объект пользователя
    }
    }`
21. auth -> strategy -> google.strategy :
`import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Profile } from "passport";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
constructor(private configService: ConfigService) {
super({
clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
callbackURL: configService.get<string>("SERVER_URL") + "/auth/google/callback",
scope: ["profile", "email"]
});
}
async validate(_accessToken: string,
_refreshToken: string,
profile: Profile,
done: VerifyCallback) {
const { displayName, emails, photos } = profile;
const user =
{
email: emails[0].value,
name: displayName,
picture: photos[0].value
}
done(null, user);
}
}`
22. auth -> strategy -> yandex.strategy :
`import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-yandex";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Profile } from "passport";
@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, "yandex") {
constructor(private configService: ConfigService) {
super({
clientID: configService.get<string>("YANDEX_CLIENT_ID"),
clientSecret: configService.get<string>("YANDEX_CLIENT_SECRET"),
callbackURL: configService.get<string>("SERVER_URL") + "/auth/yandex/callback"
});
}
async validate(_accessToken: string,
_refreshToken: string,
profile: Profile,
done: any
) {
const { username, emails, photos } = profile;
const user =
{
email: emails[0].value,
name: username,
picture: photos[0].value
}
done(null, user);
}
}` НА САЙТЕ passportjs.org/package можно найти любую стратегию авторизации / регистрации
    23. Делаем авторизацию через google:
        https://console.cloud.google.com/ -> создаём новый проект -> API & Services -> external -> app name -> user support email -> logo -> email -> save -> save -> back to dashboard -> слева credentials -> create credentials -> Oauth client ID -> ApplicationType=Web Application -> AddUrl=http://localhost:5000 => authorized redirect =http://localhost:5000/auth/google/callback
    копируем получившиеся client_id and secret_id и в .env их: `GOOGLE_CLIENT_ID=13067918992-05646p8ir7n9sbmeubr94ju3rbbmt18h.apps.googleusercontent.com
        GOOGLE_CLIENT_SECRET=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`
    24. Делаем авторизацию через яндекс:
    25. https://oauth.yandex.ru/ -> новое приложение -> cтавишь ник и аватарку приложения ->для платформ=веб сервисы -> сохранить и продолжить ->redirectURL=http://localhost:5000/auth/yandex/callback suggest hostname=http://localhost:5000 -> почта для связи dxnz@bk.ru -> всё верно, создать приложение 
    тоже всё нужное копируем в .env
        `YANDEX_CLIENT_ID=1107cdb2cf274e5e83cccb142baa48ac
        YANDEX_CLIENT_SECRET=3ba709ae3f5b4158851b52a49b323a41`
    26. в .env создаём `JWT_SECRET=gwjreklwqrwjgkgtjkjerwilk`
    27. auth -> guards -> jwt-auth.guard.ts - это специальные классы, которые определяют, должен ли текущий запрос быть обработан:
    `import { AuthGuard } from "@nestjs/passport"; 
    export class JWTAuthGuard extends AuthGuard('jwt') {}`
    28. auth -> decorators -> auth.decorator.ts: -> сокращение, упрощение кода. Проверка авторизован ли пользователь
     `import { UseGuards } from "@nestjs/common";
     import { JWTAuthGuard } from "../guards/jwt-auth.guard";
     export const Auth = () => UseGuards(JWTAuthGuard);`
    29. Апгрейд auth.module , добавляем кучу зависимостей:
        `import { Module } from '@nestjs/common';
        import { AuthService } from './auth.service';
        import { AuthController } from './auth.controller';
        import { UserModule } from "../user/user.module";
        import { ConfigModule, ConfigService } from "@nestjs/config";
        import { JwtModule } from "@nestjs/jwt";
        import { getJwtConfig } from "../config/jwt.config";
        import { PrismaService } from "../prisma.service";
        import { UserService } from "../user/user.service";
        import { JwtStrategy } from "./strategy/jwt.strategy";
        import { GoogleStrategy } from "./strategy/google.strategy";
        import { YandexStrategy } from "./strategy/yandex.strategy";
@Module({
imports: [UserModule, ConfigModule, JwtModule.registerAsync({
imports: [ConfigModule],
inject: [ConfigService],
useFactory: getJwtConfig
})],
controllers: [AuthController],
providers: [AuthService, PrismaService, UserService, JwtStrategy, GoogleStrategy, YandexStrategy],
})
export class AuthModule {}`
    30. auth.service:
        `import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
        import { JwtService } from "@nestjs/jwt";
        import { UserService } from "../user/user.service";
        import { PrismaService } from "../prisma.service";
        import { AuthDto } from "./dto/auth.dto";
@Injectable()
export class AuthService {
constructor(private jwt: JwtService, private userService: UserService, private prisma: PrismaService) {
}
async login(dto: AuthDto) {
const user = await this.validateUser(dto)
const tokens = this.issueTokens(user.id)
return { user, ...tokens}
}
async register(dto: AuthDto) {
const oldUser = await this.userService.getByEmail(dto.email)
if(oldUser) throw new BadRequestException("Пользователь уже существует")
const user = await this.userService.create(dto)
const tokens = this.issueTokens(user.id)
return { user, ...tokens}
}
issueTokens(userId: string) {
const data = {id: userId};
const accessToken = this.jwt.sign(data, {
expiresIn: '1h'
})
    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d'
    })
    return { accessToken, refreshToken };
}
private async validateUser (dto: AuthDto) {
const user = await this.userService.getByEmail(dto.email)
if (!user) throw new NotFoundException("Пользователь не найден");
return user;
}
}`
    31. auth.controller:
        `import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common";
        import { AuthService } from './auth.service';
        import { AuthDto } from "./dto/auth.dto";
@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Post('login')
async login(@Body() dto: AuthDto){
return this.authService.login(dto);
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Post('register')
async register(@Body() dto: AuthDto){
return this.authService.register(dto);
}
}`
    32. проверяем код в insomnia. Запускаем программу yarn start:dev, затем в insomnia POST запрос http://localhost:5000/auth/register, в body указать userName password email, в base environment указать BASE_URL локалхост and TOKEN, который выдаст response после авторизации
    33. в auth.service под методом регистрации создаём методы для генерации токенов:
        `async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken)
        if(!result) throw new UnauthorizedException('Невалидный refresh token')
        const user = await this.userService.getById(result.id)
        const tokens = this.issueTokens(user.id)
        return { user, ...tokens}
        }`
    34. ещё много изменений в auth.service, методы: validateOauthLogin, addRefreshTokenToResponse, removeRefreshTokenFromResponse для работы с токенами. Также дописан конструктор для использования .env:
        `export class AuthService {
        EXPIRE_DAY_REFRESH_TOKEN = 1
        REFRESH_TOKEN_NAME = 'refreshToken'
constructor(private jwt: JwtService,
private userService: UserService,
private prisma: PrismaService,
private configService: ConfigService) {
}`
а это можно добавить внизу:
        `// метод для google and yandex. any т.к. у google and yandex здесь будут разные вещи, но у них будет user
        async validateOauthLogin(req: any) {
        let user = await this.userService.getByEmail(req.user.email)
        if(!user) {
        user = await this.prisma.user.create({
        data: {
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
        },
        include: {
        stores: true,
        favorites: true,
        orders: true
        }
        })
        }`
`addRefreshTokenToResponse(res: Response, refreshToken:string) {
        const expiresIn = new Date()
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)
        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        domain: this.configService.get('SERVER_DOMAIN'),
        expires: expiresIn,
        secure: true,
        sameSite: 'none'
        })
        }
removeRefreshTokenFromResponse(res: Response) {
res.cookie(this.REFRESH_TOKEN_NAME, '', {
httpOnly: true,
domain: this.configService.get('SERVER_DOMAIN'),
expires: new Date(0),
secure: true,
sameSite: 'none'
})
}`
    35. На шаге 34 auth.servise готов. Теперь auth.controller: (я сам охренел как тут много)
        `import {
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
        import { AuthDto } from "./dto/auth.dto";
        import { Response, Request } from "express";
        import { AuthGuard } from "@nestjs/passport";
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
        const refreshTokenFromCookies = req.cookie[this.authService.REFRESH_TOKEN_NAME];
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
        @Get("google")
        @UseGuards(AuthGuard("google"))
        async googleAuth(@Req() _req) {
        }
        //Переадресация после авторизации в google
        @Get("google/callback")
        @UseGuards(AuthGuard("google"))
        async googleAuthCallback(
        @Req() req,
        @Res({ passthrough: true }) res: Response
        ) {
        const { refreshToken, ...response } =
        await this.authService.validateOauthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return res.redirect(`${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}`
    );
    }
    //Авторизация через yandex
    @Get("yandex")
    @UseGuards(AuthGuard("yandex"))
    async yandexAuth(@Req() _req) {
    }
    //Переадресация после авторизации в yandex
    @Get("yandex/callback")
    @UseGuards(AuthGuard("yandex"))
    async yandexAuthCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response
    ) {
    const { refreshToken, ...response } =
    await this.authService.validateOauthLogin(req);
    this.authService.addRefreshTokenToResponse(res, refreshToken);
    return res.redirect(`${process.env['CLIENT_URL']}/dashboard?accessToken=${response.accessToken}`
    );
    }
    }`
    36. user -> decorators -> user.decorator:
        `import { createParamDecorator, ExecutionContext } from "@nestjs/common";
        import { User } from "@prisma/client";
        export const CurrentUser = createParamDecorator((
        data: keyof User, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user[data] : user;
        }
        );`
    37. Теперь можно авторизироваться через login/password, google, yandex
    

# Сущности
1. **nest g res color --no-spec 
nest g res category --no-spec 
nest g res file --no-spec 
nest g res store --no-spec 
nest g res order --no-spec 
nest g res statistics --no-spec 
nest g res product --no-spec
nest g res review --no-spec**
2. user -> user.controller :
   `import { Controller, Get, Param, Patch } from "@nestjs/common";
   import { UserService } from "./user.service";
   import { CurrentUser } from "./decorators/user.decorator";
   import { Auth } from "../auth/decorators/auth.decorator";
   @Controller('users')
   export class UserController {
   constructor(private readonly userService: UserService) {
   }
   @Auth()
   @Get("profile")
   async getProfile(@CurrentUser("id") id: string) {
   return this.userService.getById(id);
   }
   @Auth()
   @Patch("profile/favorites/:productId")
   async toggleFavorite(
   @CurrentUser("id") userId: string,
   @Param("productId") productId: string
   ) {
   return this.userService.toggleFavorite(productId, userId);
   }
   }`
3. Cущность для магазина. store->service:
   `import { Injectable, NotFoundException } from "@nestjs/common";
   import { PrismaService } from "../prisma.service";
@Injectable()
export class StoreService {
constructor(private readonly prisma: PrismaService) {
}
async getById(storeId: string, userId: string) {
const store = await this.prisma.store.findUnique({
where: {
id: storeId,
userId
}
});
    if (!store)
      throw new NotFoundException(
        "Магазин не найден или вы не являетесь его владельцем"
      );
    return store;
}
async create(userId: string, dto: CreateStoreDto) {
return this.prisma.store.create({
data: {
title: dto.title,
userId
}
});
}
async update(storeId: string, userId: string, dto: UpdateStoreDto) {
await this.getById(storeId, userId);
    return this.prisma.store.update({
      where: { id: storeId },
      data: {
        ...dto,
        userId
      }
    });
}
async delete(storeId: string, userId: string) {
await this.getById(storeId, userId);
    return this.prisma.store.delete({
      where: { id: storeId }
    });
}
}`
4. Нужны валидации для создания и обновления магазинов. store -> dto -> create-store.dto.ts and update-store.dto.ts. For create:
   `import { IsString } from 'class-validator'
export class CreateStoreDto {
@IsString({
message: 'Название обязательно'
})
title: string
}` for update
   `import { IsString } from 'class-validator'
   import { CreateStoreDto } from './create-store.dto'
export class UpdateStoreDto extends CreateStoreDto {
@IsString({
message: 'Описание обязательно'
})
description: string
}`
5. store -> controller :
   `import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
   import { StoreService } from "./store.service";
   import { Auth } from "../auth/decorators/auth.decorator";
   import { CurrentUser } from "../user/decorators/user.decorator";
   import { CreateStoreDto } from "./dto/create-store.dto";
   import { UpdateStoreDto } from "./dto/update-store.dto";
@Controller('stores')
export class StoreController {
constructor(private readonly storeService: StoreService) {}
@Auth()
@Get('by-id/:id')
async getById(
@Param('id') storeId: string,
@CurrentUser('id') userId: string
) {
return this.storeService.getById(storeId, userId)
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Post()
async create(
@CurrentUser('id') userId: string,
@Body() dto: CreateStoreDto
) {
return this.storeService.create(userId, dto)
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Put(':id')
async update(
@Param('id') storeId: string,
@CurrentUser('id') userId: string,
@Body() dto: UpdateStoreDto
) {
return this.storeService.update(storeId, userId, dto)
}
@HttpCode(200)
@Auth()
@Delete(':id')
async delete(
@Param('id') storeId: string,
@CurrentUser('id') userId: string
) {
return this.storeService.delete(storeId, userId)
}
}`
6. Сущность для цвета color -> color.service:
   `import { Injectable, NotFoundException } from "@nestjs/common";
   import { PrismaService } from "../prisma.service";
   @Injectable()
   export class ColorService {
   constructor(private prisma: PrismaService) {}
   async getByStoreId(storeId: string) {
   return this.prisma.color.findMany({
   where: {
   storeId
   }
   })
   }
   async getById(id: string) {
   const color = await this.prisma.color.findUnique({
   where: {
   id
   }
   })
   if (!color) throw new NotFoundException('Цвет не найден')
   return color
   }
   async create(storeId: string, dto: ColorDto) {
   return this.prisma.color.create({
   data: {
   name: dto.name,
   value: dto.value,
   storeId
   }
   })
   }
   async update(id: string, dto: ColorDto) {
   await this.getById(id)
   return this.prisma.color.update({
   where: { id },
   data: dto
   })
   }
   async delete(id: string) {
   await this.getById(id)
   return this.prisma.color.delete({
   where: { id }
   })
   }
   }`
7. color -> dto -> color.dto.ts:
   `import { IsString } from "class-validator";
   export class ColorDto {
   @IsString({
   message: 'Название обязательно'
   })
   name: string
   @IsString({
   message: 'Значение обязательно'
   })
   value: string
   }`
8. в color.module запровайди призму ещё
9. color.controller:
   `import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
   import { ColorService } from './color.service';
   import { Auth } from "../auth/decorators/auth.decorator";
   import { ColorDto } from "./dto/color.dto";
   @Controller('colors')
   export class ColorController {
   constructor(private readonly colorService: ColorService) {}
   @Auth()
   @Get('by-storeId/:storeId')
   async getByStoreId(@Param('storeId') storeId: string) {
   return this.colorService.getByStoreId(storeId)
   }
   @Auth()
   @Get('by-id/:id')
   async getById(@Param('id') id: string) {
   return this.colorService.getById(id)
   }
   @UsePipes(new ValidationPipe())
   @HttpCode(200)
   @Auth()
   @Post(':storeId')
   async create(@Param('storeId') storeId: string, @Body() dto: ColorDto) {
   return this.colorService.create(storeId, dto)
   }
   @UsePipes(new ValidationPipe())
   @HttpCode(200)
   @Auth()
   @Put(':id')
   async update(@Param('id') id: string, @Body() dto: ColorDto) {
   return this.colorService.update(id, dto)
   }
   @HttpCode(200)
   @Auth()
   @Delete(':id')
   async delete(@Param('id') id: string) {
   return this.colorService.delete(id)
   }
   }`
10. Сущность категория СУПЕР похожа на color, меняй только color на category. CATEGORY.DT0:
    `import { IsString } from "class-validator";
export class CategoryDto {
@IsString({
message: 'Название обязательно'
})
title: string
@IsString({
message: 'Описание обязательно'
})
description: string
}`
11. CATEGORY.SERVICE
    `import { Injectable, NotFoundException } from "@nestjs/common";
    import { CategoryDto } from "./dto/category.dto";
    import { PrismaService } from "../prisma.service";
@Injectable()
export class CategoryService {
constructor(private prisma: PrismaService) {}
async getByStoreId(storeId: string) {
return this.prisma.category.findMany({
where: {
storeId
}
})
}
async getById(id: string) {
const category = await this.prisma.category.findUnique({
where: {
id
}
})
    if (!category) throw new NotFoundException('Категория не найдена')
    return category
}
async create(storeId: string, dto: CategoryDto) {
return this.prisma.category.create({
data: {
title: dto.title,
description: dto.description,
storeId
}
})
}
async update(id: string, dto: CategoryDto) {
await this.getById(id)
    return this.prisma.category.update({
      where: { id },
      data: dto
    })
}
async delete(id: string) {
await this.getById(id)
    return this.prisma.category.delete({
      where: { id }
    })
}
}`
12. category.controller:
    `import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
    import { CategoryService } from './category.service';
    import { Auth } from "../auth/decorators/auth.decorator";
    import { CategoryDto } from "./dto/category.dto";
@Controller('categories')
export class CategoryController {
constructor(private readonly categoryService: CategoryService) {}
@Auth()
@Get('by-storeId/:storeId')
async getByStoreId(@Param('storeId') storeId: string) {
return this.categoryService.getByStoreId(storeId)
}
@Get('by-id/:id')
async getById(@Param('id') id: string) {
return this.categoryService.getById(id)
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Post(':storeId')
async create(@Param('storeId') storeId: string, @Body() dto: CategoryDto) {
return this.categoryService.create(storeId, dto)
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Put(':id')
async update(@Param('id') id: string, @Body() dto: CategoryDto) {
return this.categoryService.update(id, dto)
}
@HttpCode(200)
@Auth()
@Delete(':id')
async delete(@Param('id') id: string) {
return this.categoryService.delete(id)
}
}`
13. Сущность file - для загрузки файлов на сайт. Используются базовые библиотеки typescript. Сперва создаём file.interface
    `export interface FileResponse {
    url: string
    name: string
    }`
14. file.module:
    `import { Module } from '@nestjs/common';
    import { FileService } from './file.service';
    import { FileController } from './file.controller';
    import { ServeStaticModule } from "@nestjs/serve-static";
    import { path } from 'app-root-path'
@Module({
imports: [
ServeStaticModule.forRoot({
rootPath: `${path}/uploads`,
serveRoot: '/uploads'
})
],
controllers: [FileController],
providers: [FileService]
})
export class FileModule {}`
15. file.service
    `import { Injectable } from '@nestjs/common'
    import { path } from 'app-root-path'
    import { ensureDir, writeFile } from 'fs-extra'
    import { FileResponse } from './file.interface'
@Injectable()
export class FileService {
async saveFiles(files: Express.Multer.File[], folder: string = 'products') {
const uploadedFolder = `${path}/uploads/${folder}`
    await ensureDir(uploadedFolder)
    const response: FileResponse[] = await Promise.all(
      files.map(async file => {
        const originalName = `${Date.now()}-${file.originalname}`
        await writeFile(
          `${uploadedFolder}/${originalName}`,
          file.buffer
        )
        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName
        }
      })
    )
    return response
}
}`
16. file.controller:
    `import { Controller, HttpCode, Post, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
    import { FileService } from './file.service';
    import { FilesInterceptor } from '@nestjs/platform-express'
    import { Auth } from "../auth/decorators/auth.decorator";
@Controller('files')
export class FileController {
constructor(private readonly fileService: FileService) {}
@HttpCode(200)
@UseInterceptors(FilesInterceptor('files'))
@Auth()
@Post()
async saveFiles(
@UploadedFiles() files: Express.Multer.File[],
@Query('folder') folder?: string
) {
return this.fileService.saveFiles(files, folder)
}
}`
17. uploads папка должна создаться сама, туда загрузи картинку no-user-image.png для дефолтной аватарки
18. Сущность продукты. Всё также + методы для поиска, списка похожих и списка самых популярных товаров
19. product.dto:
    `import { ArrayMinSize, IsNotEmpty, IsNumber, IsString } from 'class-validator'
export class ProductDto {
@IsString({
message: 'Название обязательно'
})
@IsNotEmpty({ message: 'Название не может быть пустым' })
title: string
@IsString({ message: 'Описание обязательно' })
@IsNotEmpty({ message: 'Описание не может быть пустым' })
description: string
@IsNumber({}, { message: 'Цена должна быть числом' })
@IsNotEmpty({ message: 'Цена не может быть пустой' })
price: number
@IsString({
message: 'Укажите хотя бы одну картинку',
each: true
})
@ArrayMinSize(1, { message: 'Должна быть хотя бы одна картинка' })
@IsNotEmpty({
each: true,
message: 'Путь к картинке не может быть пустым'
})
images: string[]
@IsString({
message: 'Категория обязательна'
})
@IsNotEmpty({ message: 'ID категории не может быть пустым' })
categoryId: string
@IsString({
message: 'Цвет обязателен'
})
@IsNotEmpty({ message: 'ID цвета не может быть пустым' })
colorId: string
}`
20. product.module провайдим prisma
21. product.service
    `import { Injectable, NotFoundException } from "@nestjs/common";
    import { PrismaService } from "../prisma.service";
    import { ProductDto } from "./dto/product.dto";
@Injectable()
export class ProductService {
constructor(private prisma: PrismaService) {}
async getAll(searchTerm?: string) {
if (searchTerm) return this.getSearchTermFilter(searchTerm)
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    })
}
private async getSearchTermFilter(searchTerm: string) {
return this.prisma.product.findMany({
where: {
OR: [
{
title: {
contains: searchTerm,
mode: 'insensitive'
}
},
{
description: {
contains: searchTerm,
mode: 'insensitive'
}
}
]
},
include: {
category: true
}
})
}
async getByStoreId(storeId: string) {
return this.prisma.product.findMany({
where: {
storeId
},
include: {
category: true,
color: true
}
})
}
async getById(id: string) {
const product = await this.prisma.product.findUnique({
where: {
id
},
include: {
category: true,
color: true,
reviews: {
include: {
user: true
}
}
}
})
    if (!product) throw new NotFoundException('Товар не найден')
    return product
}
async getByCategory(categoryId: string) {
const products = await this.prisma.product.findMany({
where: {
category: {
id: categoryId
}
},
include: {
category: true
}
})
    if (!products) throw new NotFoundException('Товары не найдены')
    return products
}
async getMostPopular() {
const mostPopularProducts = await this.prisma.orderItem.groupBy({
by: ['productId'],
_count: {
id: true
},
orderBy: {
_count: {
id: 'desc'
}
}
})
    const productIds = mostPopularProducts.map(item => item.productId)
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      include: {
        category: true
      }
    })
    return products
}
async getSimilar(id: string) {
const currentProduct = await this.getById(id)
    if (!currentProduct)
      throw new NotFoundException('Текущий товар не найден')
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          title: currentProduct.category.title
        },
        NOT: {
          id: currentProduct.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: true
      }
    })
    return products
}
async create(storeId: string, dto: ProductDto) {
return this.prisma.product.create({
data: {
title: dto.title,
description: dto.description,
price: dto.price,
images: dto.images,
categoryId: dto.categoryId,
colorId: dto.colorId,
storeId
}
})
}
async update(id: string, dto: ProductDto) {
await this.getById(id)
    return this.prisma.product.update({
      where: { id },
      data: dto
    })
}
async delete(id: string) {
await this.getById(id)
    return this.prisma.product.delete({
      where: { id }
    })
}
}`
22. product.controller:
    `import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe
    } from "@nestjs/common";
    import { ProductService } from './product.service';
    import { Auth } from "../auth/decorators/auth.decorator";
    import { ProductDto } from "./dto/product.dto";
@Controller('products')
export class ProductController {
constructor(private readonly productService: ProductService) {}
@Get()
async getAll(@Query('searchTerm') searchTerm?: string) {
return this.productService.getAll(searchTerm)
}
@Auth()
@Get('by-storeId/:storeId')
async getByStoreId(@Param('storeId') storeId: string) {
return this.productService.getByStoreId(storeId)
}
@Get('by-id/:id')
async getById(@Param('id') id: string) {
return this.productService.getById(id)
}
@Get('by-category/:categoryId')
async getbyCategory(@Param('categoryId') categoryId: string) {
return this.productService.getByCategory(categoryId)
}
@Get('most-popular')
async getMostPopular() {
return this.productService.getMostPopular()
}
@Get('similar/:id')
async getSimilar(@Param('id') id: string) {
return this.productService.getSimilar(id)
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Post(':storeId')
async create(@Param('storeId') storeId: string, @Body() dto: ProductDto) {
return this.productService.create(storeId, dto)
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Put(':id')
async update(@Param('id') id: string, @Body() dto: ProductDto) {
return this.productService.update(id, dto)
}
@HttpCode(200)
@Auth()
@Delete(':id')
async delete(@Param('id') id: string) {
return this.productService.delete(id)
}
}`
23. Сущность review. Со своей спецификой но тоже просто. review.dto:
    `import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";
export class ReviewDto {
@IsString({
message: 'Текст отзыва должен быть строкой'
})
@IsNotEmpty({ message: 'Текст отзыва обязателен' })
text: string
@IsNumber({}, { message: 'Рейтинг должен быть числом' })
@Min(1, { message: 'Минимальный рейтинг - 1' })
@Max(5, { message: 'Максимальный рейтинг - 5' })
@IsNotEmpty({ message: 'Рейтинг обязателен' })
rating: number
}`
24. в model провайдим productService and PrismaService
25. review.service:
    `import { Injectable, NotFoundException } from "@nestjs/common";
    import { PrismaService } from "../prisma.service";
    import { ProductService } from "../product/product.service";
    import { ReviewDto } from "./dto/review.dto";
@Injectable()
export class ReviewService {
constructor(
private prisma: PrismaService,
private productService: ProductService
) {}
async getByStoreId(storeId: string) {
return this.prisma.review.findMany({
where: {
storeId
},
include: {
user: true
}
})
}
async getById(id: string, userId: string) {
const review = await this.prisma.review.findUnique({
where: {
id,
userId
},
include: {
user: true
}
})
    if (!review)
      throw new NotFoundException(
        'Отзыв не найден или вы не являетесь его владельцем'
      )
    return review
}
async create(
userId: string,
productId: string,
storeId: string,
dto: ReviewDto
) {
await this.productService.getById(productId)
    return this.prisma.review.create({
      data: {
        ...dto,
        product: {
          connect: {
            id: productId
          }
        },
        user: {
          connect: {
            id: userId
          }
        },
        store: {
          connect: {
            id: storeId
          }
        }
      }
    })
}
async delete(id: string, userId: string) {
await this.getById(id, userId)
    return this.prisma.review.delete({
      where: {
        id
      }
    })
}
}`
26. review.controller:
    `import { Body, Controller, Delete, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
    import { ReviewService } from './review.service';
    import { Auth } from "../auth/decorators/auth.decorator";
    import { CurrentUser } from "../user/decorators/user.decorator";
    import { ReviewDto } from "./dto/review.dto";
@Controller('reviews')
export class ReviewController {
constructor(private readonly reviewService: ReviewService) {}
@Auth()
@Get('by-storeId/:storeId')
async getByStoreId(@Param('storeId') storeId: string) {
return this.reviewService.getByStoreId(storeId)
}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Auth()
@Post(':productId/:storeId')
async create(
@CurrentUser('id') userId: string,
@Param('productId') productId: string,
@Param('storeId') storeId: string,
@Body() dto: ReviewDto
) {
return this.reviewService.create(userId, productId, storeId, dto)
}
@HttpCode(200)
@Auth()
@Delete(':id')
async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
return this.reviewService.delete(id, userId)
}
}`
27. Дальше идёт order и настройка платёжной системы. Актуалочка
28. order -> dto -> order.dto.ts , payment-status.dto.ts
order.dto.ts:
    `import { EnumOrderStatus } from "@prisma/client";
    import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
    import { Type } from "class-transformer";
export class OrderDto {
@IsOptional()
@IsEnum(EnumOrderStatus, {
message: 'Статус заказа обязателен'
})
status: EnumOrderStatus
@IsArray({
message: 'В заказе нет ни одного товара'
})
@ValidateNested({ each: true })
@Type(() => OrderItemDto)
items: OrderItemDto[]
}
export class OrderItemDto {
@IsNumber({}, { message: 'Количество должно быть числом' })
quantity: number
@IsNumber({}, { message: 'Цена должна быть числом' })
price: number
@IsString({ message: 'ID продукта должен быть строкой' })
productId: string
@IsString({ message: 'ID магазина должен быть строкой' })
storeId: string
}`
29. payment-status.dto.ts:
    `class AmountPayment {
    value: string
    currency: string
    }
class ObjectPayment {
id: string
status: string
amount: AmountPayment
payment_method: {
type: string
id: string
saved: boolean
title: string
card: object
}
created_at: string
expires_at: string
description: string
}
export class PaymentStatusDto {
event:
| 'payment.succeeded'
| 'payment.waiting_for_capture'
| 'payment.canceled'
| 'refund.succeeded'
type: string
object: ObjectPayment
}`
30. .env:
    `YOOKASSA_SHOP_ID=464078 из сайта
    YOOKASSA_SECRET_KEY=test_cLbwXeulzBdWyB2lGaIqYtRiIdTyqXK9nbaulBv5wVw из сайта
    `
31. в order.module провайдим призму
32. order.service:
    `import { Injectable } from '@nestjs/common';
    import { PrismaService } from "../prisma.service";
    import { ICapturePayment, YooCheckout } from "@a2seven/yoo-checkout";
    import { OrderDto } from "./dto/order.dto";
    import { PaymentStatusDto } from "./dto/payment-status.dto";
    import { EnumOrderStatus } from "@prisma/client";
const checkout = new YooCheckout({
shopId: process.env['YOOKASSA_SHOP_ID'],
secretKey: process.env['YOOKASSA_SECRET_KEY']
})
@Injectable()
export class OrderService {
constructor(private prisma: PrismaService) {}
async createPayment(dto: OrderDto, userId: string) {
const orderItems = dto.items.map(item => ({
quantity: item.quantity,
price: item.price,
product: {
connect: {
id: item.productId
}
},
store: {
connect: {
id: item.storeId
}
}
}))
    const total = dto.items.reduce((acc, item) => {
      return acc + item.price * item.quantity
    }, 0)
    const order = await this.prisma.order.create({
      data: {
        status: dto.status,
        items: {
          create: orderItems
        },
        total,
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
    const payment = await checkout.createPayment({
      amount: {
        value: total.toFixed(2),
        currency: 'RUB'
      },
      payment_method_data: {
        type: 'bank_card'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.CLIENT_URL}/thanks`
      },
      description: `Оплата заказа в магазине TeaShop. Id платежи: #${order.id}`
    })
    return payment
}
async updateStatus(dto: PaymentStatusDto) {
if (dto.event === 'payment.waiting_for_capture') {
const capturePayment: ICapturePayment = {
amount: {
value: dto.object.amount.value,
currency: dto.object.amount.currency
}
}
      return checkout.capturePayment(dto.object.id, capturePayment)
    }
    if (dto.event === 'payment.succeeded') {
      const orderId = dto.object.description.split('#')[1]
      await this.prisma.order.update({
        where: {
          id: orderId
        },
        data: {
          status: EnumOrderStatus.PAYED
        }
      })
      return true
    }
    return true
}
}`
33. order.controller:
    `import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common";
    import { OrderService } from './order.service';
    import { PaymentStatusDto } from "./dto/payment-status.dto";
    import { Auth } from "../auth/decorators/auth.decorator";
    import { OrderDto } from "./dto/order.dto";
    import { CurrentUser } from "../user/decorators/user.decorator";
@Controller('orders')
export class OrderController {
constructor(private readonly orderService: OrderService) {}
@UsePipes(new ValidationPipe())
@HttpCode(200)
@Post('place')
@Auth()
async checkout(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
return this.orderService.createPayment(dto, userId)
}
@HttpCode(200)
@Post('status')
async updateStatus(@Body() dto: PaymentStatusDto) {
return this.orderService.updateStatus(dto)
}
}`
34. остаётся statistics. в module провайдим призму, statistics.service:
    `import { Injectable } from '@nestjs/common';
    import dayjs from "dayjs";
    import { PrismaService } from "../prisma.service";
dayjs.locale('ru')
const monthNames = [
'янв',
'фев',
'мар',
'апр',
'мая',
'июн',
'июл',
'авг',
'сен',
'окт',
'ноя',
'дек'
]
@Injectable()
export class StatisticsService {
constructor(private prisma: PrismaService) {}
async getMainStatistics(storeId: string) {
const totalRevenue = await this.calculateTotalRevenue(storeId)
    const productsCount = await this.countProducts(storeId)
    const categoriesCount = await this.countCategories(storeId)
    const averageRating = await this.calculateAverageRating(storeId)
    return [
      { id: 1, name: 'Выручка', value: totalRevenue },
      { id: 2, name: 'Товары', value: productsCount },
      { id: 3, name: 'Категории', value: categoriesCount },
      { id: 4, name: 'Средний рейтинг', value: averageRating || 0 }
    ]
}
async getMiddleStatistics(storeId: string) {
const monthlySales = await this.calculateMonthlySales(storeId)
    const lastUsers = await this.getLastUsers(storeId)
    return { monthlySales, lastUsers }
}
private async calculateTotalRevenue(storeId: string) {
const orders = await this.prisma.order.findMany({
where: {
items: {
some: {
store: { id: storeId }
}
}
},
include: {
items: {
where: { storeId }
}
}
})
    const totalRevenue = orders.reduce((acc, order) => {
      const total = order.items.reduce((itemAcc, item) => {
        return itemAcc + item.price * item.quantity
      }, 0)
      return acc + total
    }, 0)
    return totalRevenue
}
private async countProducts(storeId: string) {
const productsCount = await this.prisma.product.count({
where: { storeId }
})
return productsCount
}
private async countCategories(storeId: string) {
const categoriesCount = await this.prisma.category.count({
where: { storeId }
})
return categoriesCount
}
private async calculateAverageRating(storeId: string) {
const averageRating = await this.prisma.review.aggregate({
where: { storeId },
_avg: { rating: true }
})
return averageRating._avg.rating
}
private async calculateMonthlySales(storeId: string) {
const startDate = dayjs().subtract(30, 'days').startOf('day').toDate()
const endDate = dayjs().endOf('day').toDate()
    const salesRaw = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        items: {
          some: { storeId }
        }
      },
      include: {
        items: true
      }
    })
    const formatDate = (date: Date): string => {
      return `${date.getDate()} ${monthNames[date.getMonth()]}`
    }
    const salesByDate = new Map<string, number>()
    salesRaw.forEach(order => {
      const formattedDate = formatDate(new Date(order.createdAt))
      const total = order.items.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
      if (salesByDate.has(formattedDate)) {
        salesByDate.set(
          formattedDate,
          salesByDate.get(formattedDate)! + total
        )
      } else {
        salesByDate.set(formattedDate, total)
      }
    })
    const monthlySales = Array.from(salesByDate, ([date, value]) => ({
      date,
      value
    }))

    return monthlySales
}
private async getLastUsers(storeId: string) {
const lastUsers = await this.prisma.user.findMany({
where: {
orders: {
some: {
items: { some: { storeId } }
}
}
},
orderBy: { createdAt: 'desc' },
take: 5,
include: {
orders: {
where: {
items: { some: { storeId } }
},
include: {
items: {
where: { storeId },
select: { price: true }
}
}
}
}
})
    return lastUsers.map(user => {
      const lastOrder = user.orders[user.orders.length - 1]
      const total = lastOrder.items.reduce((total, item) => {
        return total + item.price
      }, 0)
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        total
      }
    })
}
}`
35. controller:
    `import { Controller, Get, Param } from "@nestjs/common";
    import { StatisticsService } from './statistics.service';
    import { Auth } from "../auth/decorators/auth.decorator";
@Controller('statistics')
export class StatisticsController {
constructor(private readonly statisticsService: StatisticsService) {}
@Auth()
@Get('main/:storeId')
async getMainStatistics(@Param('storeId') storeId: string) {
return this.statisticsService.getMainStatistics(storeId)
}
@Auth()
@Get('middle/:storeId')
async getMiddleStatistics(@Param('storeId') storeId: string) {
return this.statisticsService.getMiddleStatistics(storeId)
}
}`
36. На этом backend заканчивается. Тут описан весь crud, взаимодействие сущностей, основные методы с ними и авторизация























    


