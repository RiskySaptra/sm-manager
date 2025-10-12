import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformResponseInterceptor } from './shared/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(
    new TransformResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('SM Manager API')
    .setDescription('API documentation for the SM Manager application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
