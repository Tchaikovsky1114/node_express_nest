import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserModel) private readonly userRepository: Repository<UserModel>,
  ) {}


  async createUser(user: Pick<UserModel,'email' | 'password' | 'nickname'>) {
    
    const existEmailAndNickname = await this.userRepository.exist({
      where: [
        { email: user.email },
        { nickname: user.nickname}
      ]
    })
    if(existEmailAndNickname) throw new BadRequestException('이메일 또는 닉네임이 존재합니다.');


    const userObj = this.userRepository.create({
      nickname: user.nickname,
      password: user.password,
      email: user.email
    });
    const newUser = await this.userRepository.save(userObj);

    return newUser
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
