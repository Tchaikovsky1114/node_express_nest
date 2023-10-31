import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserModel) private readonly userRepository: Repository<UserModel>,
  ) {}


  async createUser(body: CreateUserDto) {
    const user = this.userRepository.create(body);
    return await this.userRepository.save(user);
  } 
  async findAllUser () {
    return await this.userRepository.find()
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email
      }
    })
  }
}
