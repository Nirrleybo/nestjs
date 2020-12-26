import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ExceptionsLoggerFilter } from './log/exceptionsLogger.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  const { httpAdapter } = app.get(HttpAdapterHost);
  
  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));
  app.use(cookieParser());
  await app.listen(port);
}
bootstrap();
