import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // Для работы с cookie

  app.enableCors({ // Настройка CORS для работы с фронтендом
    origin: '*', // Разрешаем все источники
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Разрешаем отправку куков
    exposedHeaders: 'set-cookie', // Экспонируем заголовок с куками
  });

  await app.listen(5000);
}

bootstrap();
