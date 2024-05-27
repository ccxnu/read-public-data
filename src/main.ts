import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './interface/filters/AllExceptionsFilter';
import { HttpExceptionFilter } from './interface/filters/HttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = 3000;
  await app.listen(port);
  console.info(
    `Microservicio de autenticacion escuchando en el puerto: ${port}`,
  );
}
bootstrap();
