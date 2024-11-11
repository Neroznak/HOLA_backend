import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // для работы с cookie
  // app.setGlobalPrefix("api");
  app.enableCors({ // Cross-Origin Resource Sharing , для подключения к frontend'у
    origin: "*", // указываю какие URL могут делать запросу к backend'у
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // разрешаю отправлять куки при запросах с фронтэнда
    exposedHeaders: "set-cookie" // чтобы фронтэнд мог читать ответы через куки от сервера
  });
  await app.listen(5000);
}

bootstrap();


