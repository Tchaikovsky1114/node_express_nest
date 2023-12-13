import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  // serialization: 직렬화 - 현재 시스템에서 사용되는 데이터의 구조를 다른 시스템에서도 쉽게 사용할 수 있는 포맷으로 변환
  // 여기서는 class의 object에서 JSON 포맷으로 변환
  getUsers() {
    return this.usersService.findAllUser()
  }
}
