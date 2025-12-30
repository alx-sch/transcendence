import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@generated/client/client';
import { ReqUserCreateDto } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() userData: ReqUserCreateDto) {
    return this.userService.createUser(userData);
  }
}
