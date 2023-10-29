import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  postUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body)
  }

  @Get()
  getAllUsers(){
    return this.usersService.findAllUser();
  }
  
}
