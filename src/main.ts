import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ExceptionsLoggerFilter } from './log/exceptionsLogger.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function initSwagger(app: any) {
  const options = new DocumentBuilder()
    .setTitle('Monolith')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );
  initSwagger(app);
  await app.listen(port);
}
bootstrap();
