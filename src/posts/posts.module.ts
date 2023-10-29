import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/post.entity';
import { UserModel } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostModel,
      UserModel
    ]) // 모델에 해당하는 레포지토리를 주입
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
