import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';  // Импортируем как default
import { v4 as uuidv4 } from 'uuid'; // Импортируем v4 для генерации UUID
import pgSession from 'connect-pg-simple';  // Импортируем connect-pg-simple
import { Pool } from 'pg';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser()); // Для работы с cookie

  // const pool = new Pool({
  //   connectionString: process.env.DATABASE_URL, // Подключаемся через DATABASE_URL
  // });
  //
  // const PgSession = pgSession(session);  // Передаем session в pgSession
  //
  // app.use(
  //   session({
  //     store: new PgSession({
  //       pool: pool, // Пул подключений к базе данных
  //       tableName: 'session', // Название таблицы с сессиями
  //     }),
  //     secret: process.env.SESSION_SECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //     cookie: {
  //       maxAge: 1000 * 60 * 60,
  //       secure: true
  //     },
  //     genid: function() {
  //       return uuidv4(); // use UUIDs for session IDs
  //     },
  //
  //   })
  // );

  app.enableCors({ // Настройка CORS для работы с фронтендом
    origin: '*', // Разрешаем все источники
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Разрешаем отправку куков
    exposedHeaders: 'set-cookie', // Экспонируем заголовок с куками
  });

  await app.listen(5000);
}

bootstrap();
