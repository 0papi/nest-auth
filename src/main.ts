import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AtGuard } from './common/guards/at.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // const reflector = new Reflector();
  // app.useGlobalGuards(new AtGuard(reflector));
  await app.listen(3333);
}
bootstrap();
