import { cleanupOpenApiDoc } from 'nestjs-zod';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create API Documentation Document with Swagger
  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('GRIT API')
      .setDescription('API description built with Zod and Swagger')
      .setVersion('1.0')
      .build()
  );
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc));

  // Start Server
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Fatal Error during startup:', err);
  process.exit(1);
});
