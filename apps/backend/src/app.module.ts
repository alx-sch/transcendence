import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { UserService } from './user/user.service.js';
import { PostController } from './post/post.controller.js';
import { PostService } from './post/post.service.js';
import { UserController } from './user/user.controller.js';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, PostController, UserController],
  providers: [AppService, PrismaService, PostService, UserService],
})
export class AppModule {}
