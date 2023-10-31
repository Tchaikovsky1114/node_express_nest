import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { PostModel } from 'src/posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModel,
      PostModel
    ])
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
