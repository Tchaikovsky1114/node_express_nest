import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/post.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer'
import { v4 as uuid } from 'uuid'
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostModel,
      UserModel
    ]), // 모델에 해당하는 레포지토리를 주입
    CommonModule,
    MulterModule.register({
      limits: {
        fileSize: 1000000 // byte 단위
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb : (err, boolean,)
         * 
         * 1번째 파라미터에는 에러가 있을 경우 에러 정보를 넣어준다
         * 2번째 파라미터는 파일을 받을지 말지 boolean을 넣어준다
         */
        // xxx.jpg => .jpg
        const ext = extname(file.originalname)
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false
          )
        }
        return cb(null, true)
      },
      storage: multer.diskStorage({
        destination: (req, res, cb) => {
          cb(null, POST_IMAGE_PATH);
        }, // 파일 다운로드 시 저장될 폴더
        filename: (req, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname)}`)
        }
      })
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService,AuthService,UsersService,JwtService],
})
export class PostsModule {}
