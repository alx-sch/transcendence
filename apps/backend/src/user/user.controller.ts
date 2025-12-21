import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service.js';
import { User as UserModel } from '../generated/prisma/client.js';

@Controller()
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('user')
  async signupUser(@Body() userData: { name?: string; email: string }): Promise<UserModel> {
    return this.UserService.createUser(userData);
  }
}
