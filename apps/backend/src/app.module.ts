import { ZodValidationPipe, ZodSerializerInterceptor, ZodSerializationException } from 'nestjs-zod';
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER, BaseExceptionFilter } from '@nestjs/core';
import { ZodError } from 'zod';
import { Module, HttpException, ArgumentsHost, Logger, Catch } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventModule } from './event/event.module';

// Filter for NestJS's default error handling for enrichment with Zod details
@Catch(HttpException)
class HttpExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }
    super.catch(exception, host);
  }
}

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PostModule, PrismaModule, EventModule],
  controllers: [AppController],
  providers: [
    // Zod integration for custom validation pipe. No need to add it individually to each route anymore.
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    // Zod integration for response serialization
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    // Zod integration of exception enhancement (see HttpExceptionFilter above)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
