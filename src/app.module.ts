import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule, UserModule, ChatModule, MessageModule], // чтобы удобнее работать с переменными окружения ENVIRONMENT VARIABLES
  controllers: [AppController],
  providers: [AppService, ChatModule, MessageModule, ]
})
export class AppModule {
}

