import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    // 변환 허가 (오름차순 등 기본값으로 넣어준 대로 반환할 수 있게 해준다)
    transform: true,
    transformOptions: {
      enableImplicitConversion: true // transform이 될 때 class-validator를 기반으로(IsNumber, IsBoolean) 자동으로 형을 변환하여 직렬화
    }
  }));
  await app.listen(3000);
}
bootstrap();
