import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';

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

  async getUserById (id: number) {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .where('user.id = :userId', {userId: id})
    .getOne()

    if(!user) {
      throw new NotFoundException(`유저 ${id}번은 존재하지 않습니다`)
    }
    return user
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email
      }
    })
  }
}
