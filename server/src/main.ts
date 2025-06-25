import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const allowedOrigin =
    process.env.NODE_ENV === 'production'
      ? 'https://your-production-frontend.com' // replace with your real prod frontend URL
      : 'http://localhost:3001';
  app.enableCors({
    origin: allowedOrigin,
    credentials: true, // if your frontend needs to send cookies/auth headers
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}, CORS allowed for: ${allowedOrigin}`);
}
bootstrap();
