import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("pong-shippit");
  console.log("RUNNING APP WITH ENV:", process.env);

  await app.listen(process.env.PORT);
}
bootstrap();
